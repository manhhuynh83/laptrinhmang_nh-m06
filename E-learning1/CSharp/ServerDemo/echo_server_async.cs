using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

public static class EchoServerAsync {
    public static async Task RunAsync() {
        var listener = new TcpListener(IPAddress.Loopback, 9000);
        listener.Start();
        Console.WriteLine("Server đang lắng nghe trên cổng 9000...");

        while (true) {
            var client = await listener.AcceptTcpClientAsync();
            _ = HandleClientAsync(client);
        }
    }

    private static async Task HandleClientAsync(TcpClient client) {
        var buffer = new byte[1024];
        var stream = client.GetStream();
        Console.WriteLine("Client đã kết nối.");

        int bytesRead;
        while ((bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length)) != 0) {
            var message = Encoding.UTF8.GetString(buffer, 0, bytesRead);
            Console.WriteLine($"Nhận từ client: {message}");
            await stream.WriteAsync(buffer, 0, bytesRead);
        }

        client.Close();
        Console.WriteLine("Client đã ngắt kết nối.");
    }
}
