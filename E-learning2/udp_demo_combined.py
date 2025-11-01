import socket
import selectors
import threading
import time

def udp_server(host="127.0.0.1", port=9999):
    sel = selectors.DefaultSelector()

    server_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server_sock.bind((host, port))
    server_sock.setblocking(False)

    sel.register(server_sock, selectors.EVENT_READ)
    print(f"🟢 UDP Non-blocking Echo Server đang chạy tại {host}:{port}")

    try:
        while True:
            events = sel.select(timeout=0.5)
            for key, mask in events:
                sock = key.fileobj
                if mask & selectors.EVENT_READ:
                    data, addr = sock.recvfrom(1024)
                    print(f"📩 Nhận từ {addr}: {data.decode()}")
                    sock.sendto(data, addr)
    except Exception as e:
        print("❌ Lỗi server:", e)
    finally:
        sel.unregister(server_sock)
        server_sock.close()
        print("🛑 Server dừng.")

def udp_client(server=("127.0.0.1", 9999)):
    time.sleep(1)  
    client_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    print("💬 Nhập tin nhắn (gõ 'exit' để thoát):")

    while True:
        msg = input("> ")
        if msg.lower() == "exit":
            break
        client_sock.sendto(msg.encode(), server)
        data, _ = client_sock.recvfrom(1024)
        print("🪞 Phản hồi:", data.decode())

    client_sock.close()
    print("👋 Kết thúc client.")

if __name__ == "__main__":
    server_thread = threading.Thread(target=udp_server, daemon=True)
    server_thread.start()

    udp_client()
