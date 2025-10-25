using System;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace AsyncDemoApp {
    public static class EchoClientAsync {
        public static async Task RunAsync() {
            using var client = new TcpClient();
            await client.ConnectAsync("127.0.0.1", 9000);
            Console.WriteLine("🟢 Đã kết nối đến server!\n");

            var stream = client.GetStream();
            while (true) {
                Console.Write("💬 Bạn: ");
                var msg = Console.ReadLine();

                if (string.IsNullOrEmpty(msg) || msg.ToLower() == "exit") break;

                var data = Encoding.UTF8.GetBytes(msg);
                await stream.WriteAsync(data, 0, data.Length);

                var buffer = new byte[1024];
                int bytes = await stream.ReadAsync(buffer, 0, buffer.Length);
                var reply = Encoding.UTF8.GetString(buffer, 0, bytes);

                Console.WriteLine($"📩 Phản hồi từ server: {reply}\n");
            }

            Console.WriteLine("🔴 Ngắt kết nối.");
        }
    }
}
