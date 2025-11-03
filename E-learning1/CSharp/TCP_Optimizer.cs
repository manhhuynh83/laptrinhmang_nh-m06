using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp {
    public static class ChatServer {
        private static readonly List<TcpClient> Clients = new();

        public static async Task RunAsync() {
            var listener = new TcpListener(IPAddress.Any, 9000);
            listener.Start();
            Console.WriteLine("💬 Chat Server đang chạy trên cổng 9000...");

            while (true) {
                var client = await listener.AcceptTcpClientAsync();
                lock (Clients) Clients.Add(client);
                Console.WriteLine($"🟢 Client mới kết nối: {client.Client.RemoteEndPoint}");
                _ = HandleClientAsync(client);
            }
        }

        private static async Task HandleClientAsync(TcpClient client) {
            var stream = client.GetStream();
            var buffer = new byte[1024];

            try {
                while (true) {
                    int bytes = await stream.ReadAsync(buffer, 0, buffer.Length);
                    if (bytes == 0) break;

                    var msg = Encoding.UTF8.GetString(buffer, 0, bytes);
                    Console.WriteLine($"💭 {client.Client.RemoteEndPoint}: {msg}");

                    // Gửi lại cho các client khác
                    lock (Clients) {
                        foreach (var other in Clients) {
                            if (other != client) {
                                var outStream = other.GetStream();
                                _ = outStream.WriteAsync(buffer, 0, bytes);
                            }
                        }
                    }
                }
            } catch { }
            finally {
                lock (Clients) Clients.Remove(client);
                client.Close();
                Console.WriteLine($"🔴 Client rời khỏi: {client.Client.RemoteEndPoint}");
            }
        }
    }

    public static class ChatClient {
        public static async Task RunAsync() {
            using var client = new TcpClient();
            await client.ConnectAsync("127.0.0.1", 9000);
            Console.WriteLine("🟢 Đã kết nối đến server!\nGõ tin nhắn và nhấn Enter để gửi (gõ 'exit' để thoát)\n");

            var stream = client.GetStream();

            _ = Task.Run(async () => {
                var buffer = new byte[1024];
                while (true) {
                    int bytes = await stream.ReadAsync(buffer, 0, buffer.Length);
                    if (bytes == 0) break;
                    var msg = Encoding.UTF8.GetString(buffer, 0, bytes);
                    Console.WriteLine($"\n💌 Tin nhắn từ người khác: {msg}");
                }
            });

            while (true) {
                Console.Write("💬 Bạn: ");
                var msg = Console.ReadLine();
                if (string.IsNullOrEmpty(msg) || msg.ToLower() == "exit") break;

                var data = Encoding.UTF8.GetBytes(msg);
                await stream.WriteAsync(data, 0, data.Length);
            }

            Console.WriteLine("🔴 Ngắt kết nối.");
        }
    }

    public class Program {
        public static async Task Main(string[] args) {
            if (args.Length == 0) {
                Console.WriteLine("⚙️ Sử dụng: dotnet run -- [server|client]");
                return;
            }

            if (args[0].Equals("server", StringComparison.OrdinalIgnoreCase)) {
                await ChatServer.RunAsync();
            } else if (args[0].Equals("client", StringComparison.OrdinalIgnoreCase)) {
                await ChatClient.RunAsync();
            } else {
                Console.WriteLine("❌ Tham số không hợp lệ. Hãy dùng: server hoặc client");
            }
        }
    }
}
