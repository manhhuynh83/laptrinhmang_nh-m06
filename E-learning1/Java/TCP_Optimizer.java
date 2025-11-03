import java.io.*;
import java.net.*;

public class SimpleTFO {
    private static final int PORT = 8888;
    private static boolean serverRunning = true;

    public static void main(String[] args) throws Exception {
        if (args.length == 0) {
            startServer();
        } else {
            startClient();
        }
    }

    // Server code
    private static void startServer() {
        System.out.println("🖥️  Server đang chạy trên cổng " + PORT);

        try (ServerSocket server = new ServerSocket(PORT)) {
            while (serverRunning) {
                Socket client = server.accept();
                System.out.println("📥 Client mới đã kết nối: " + client.getInetAddress());

                // Handle client in a simple way
                handleClient(client);
            }
        } catch (IOException e) {
            System.out.println("Lỗi Server: " + e.getMessage());
        }
    }

    private static void handleClient(Socket client) {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(client.getInputStream()));
             PrintWriter out = new PrintWriter(client.getOutputStream(), true)) {

            String message;
            while ((message = in.readLine()) != null) {
                System.out.println("📨 Đã nhận: " + message);

                if (message.equals("thoát")) {
                    out.println("Tạm biệt!");
                    break;
                }

                // Echo back with server timestamp
                String response = message + " | Time: " + System.currentTimeMillis();
                out.println(response);
            }

        } catch (IOException e) {
            System.out.println("Client đã dừng kết nối");
        } finally {
            try {
                client.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    // Client code
    private static void startClient() {
        System.out.println("👤 Client đang bắt đầu...");

        try (Socket socket = new Socket("localhost", PORT);
             BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
             PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
             BufferedReader userInput = new BufferedReader(new InputStreamReader(System.in))) {

            System.out.println("✅ Đã kết nối đến Server!");
            System.out.println("Nhập tin nhắn để gửi đến Server (Nhập 'thoát' để dừng lại):");

            String userMessage;
            while ((userMessage = userInput.readLine()) != null) {
                // Send message to server
                out.println(userMessage);

                // Receive response from server
                String response = in.readLine();
                System.out.println("🖥️  Server phản hồi: " + response);

                if (userMessage.equals("thoát")) {
                    break;
                }
            }

        } catch (IOException e) {
            System.out.println("❌ Lỗi Client : " + e.getMessage());
        }
    }
}