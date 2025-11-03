#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import asyncio
import signal
import socket
import sys
from typing import Set, Tuple

# =========================
# Server
# =========================

class ChatServer:
    def __init__(self, host: str, port: int):
        self.host = host
        self.port = port
        self.clients: Set[Tuple[asyncio.StreamReader, asyncio.StreamWriter]] = set()
        self.server: asyncio.base_events.Server | None = None
        self._shutdown = asyncio.Event()

    async def start(self):
        self.server = await asyncio.start_server(self._handle_client, self.host, self.port)
        sockets = ", ".join(str(s.getsockname()) for s in self.server.sockets or [])
        print(f"💬 Chat Server đang chạy trên {sockets}")

        # graceful shutdown (Ctrl+C)
        loop = asyncio.get_running_loop()
        for sig in (signal.SIGINT, signal.SIGTERM):
            try:
                loop.add_signal_handler(sig, self._shutdown.set)
            except NotImplementedError:
                # Windows có thể không hỗ trợ add_signal_handler với SIGTERM
                pass

        async with self.server:
            await self._shutdown.wait()
            print("🛑 Đang dừng server...")

        # đóng tất cả client
        for _, w in list(self.clients):
            try:
                w.write_eof()
            except Exception:
                pass
            w.close()
        await asyncio.gather(*(w.wait_closed() for _, w in list(self.clients)), return_exceptions=True)

    async def _handle_client(self, reader: asyncio.StreamReader, writer: asyncio.StreamWriter):
        sock: socket.socket = writer.get_extra_info("socket")
        if sock:
            try:
                sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)  # tắt Nagle → giảm trễ
            except Exception:
                pass

        peer = writer.get_extra_info("peername")
        self.clients.add((reader, writer))
        print(f"🟢 Client mới kết nối: {peer}")

        try:
            # đọc theo dòng (newline framing)
            while True:
                line = await reader.readline()
                if not line:
                    break
                msg = line.decode("utf-8", errors="ignore").rstrip("\r\n")
                print(f"💭 {peer}: {msg}")
                # broadcast cho người khác
                data = (msg + "\n").encode("utf-8")
                dead = []
                for r, w in self.clients:
                    if w is not writer:
                        try:
                            w.write(data)
                            await w.drain()
                        except Exception:
                            dead.append((r, w))
                # loại client lỗi
                for d in dead:
                    self.clients.discard(d)
                    try:
                        d[1].close()
                    except Exception:
                        pass
        except asyncio.CancelledError:
            raise
        except Exception:
            # có thể là client đóng đột ngột
            pass
        finally:
            self.clients.discard((reader, writer))
            try:
                writer.close()
                await writer.wait_closed()
            except Exception:
                pass
            print(f"🔴 Client rời khỏi: {peer}")


# =========================
# Client
# =========================

class ChatClient:
    def __init__(self, host: str, port: int):
        self.host = host
        self.port = port
        self.reader: asyncio.StreamReader | None = None
        self.writer: asyncio.StreamWriter | None = None

    async def run(self):
        self.reader, self.writer = await asyncio.open_connection(self.host, self.port)
        sock: socket.socket = self.writer.get_extra_info("socket")
        if sock:
            try:
                sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
            except Exception:
                pass

        print("🟢 Đã kết nối đến server!")
        print("Gõ tin nhắn và Enter để gửi (gõ 'exit' để thoát)\n")

        # Task nền: nhận tin nhắn từ server
        recv_task = asyncio.create_task(self._recv_loop())

        # Vòng lặp đọc stdin mà không chặn event loop
        try:
            while True:
                msg = await asyncio.get_running_loop().run_in_executor(None, sys.stdin.readline)
                if not msg:
                    break
                msg = msg.rstrip("\r\n")
                if msg.lower() == "exit":
                    break
                await self._send_line(msg)
        finally:
            recv_task.cancel()
            try:
                await recv_task
            except asyncio.CancelledError:
                pass
            await self._close()

    async def _recv_loop(self):
        assert self.reader is not None
        try:
            while True:
                line = await self.reader.readline()
                if not line:
                    print("🔌 Mất kết nối tới server.")
                    break
                msg = line.decode("utf-8", errors="ignore").rstrip("\r\n")
                # in trên dòng mới, giữ prompt gọn
                print(f"\n💌 Tin nhắn từ người khác: {msg}")
                print("💬 Bạn: ", end="", flush=True)
        except asyncio.CancelledError:
            raise
        except Exception:
            pass

    async def _send_line(self, msg: str):
        assert self.writer is not None
        self.writer.write((msg + "\n").encode("utf-8"))
        await self.writer.drain()

    async def _close(self):
        if self.writer:
            try:
                self.writer.write_eof()
            except Exception:
                pass
            try:
                self.writer.close()
                await self.writer.wait_closed()
            except Exception:
                pass
        print("🔴 Ngắt kết nối.")


# =========================
# CLI
# =========================

def parse_args():
    p = argparse.ArgumentParser(description="Chat TCP đơn giản (asyncio)")
    sub = p.add_subparsers(dest="mode", required=True)

    sp_s = sub.add_parser("server", help="Chạy server")
    sp_s.add_argument("--host", default="0.0.0.0")
    sp_s.add_argument("--port", type=int, default=9000)

    sp_c = sub.add_parser("client", help="Chạy client")
    sp_c.add_argument("--host", default="127.0.0.1")
    sp_c.add_argument("--port", type=int, default=9000)

    return p.parse_args()

async def amain():
    args = parse_args()
    if args.mode == "server":
        await ChatServer(args.host, args.port).start()
    else:
        await ChatClient(args.host, args.port).run()

if __name__ == "__main__":
    try:
        asyncio.run(amain())
    except KeyboardInterrupt:
        pass
