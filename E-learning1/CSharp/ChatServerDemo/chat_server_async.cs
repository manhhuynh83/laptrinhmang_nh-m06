using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace ChatServerDemo {
    public static class ChatServerAsync {
        private static readonly List<TcpClient> Clients = new();

        public static async Task RunAsync() {
            var listener = new TcpListener(IPAddress.Any, 9000);
            listener.Start();
            Console.WriteLine("Chat Server đang chay tren cong 9000...");

            while (true) {
                var client = await listener.AcceptTcpClientAsync();
                lock (Clients) Clients.Add(client);
                Console.WriteLine($"-- Client moi ket noi: {client.Client.RemoteEndPoint}");
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

                    // Gửi tin nhắn cho tất cả client khác
                    lock (Clients) {
                        foreach (var other in Clients) {
                            if (other != client) {
                                var outStream = other.GetStream();
                                outStream.WriteAsync(buffer, 0, bytes);
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
}
