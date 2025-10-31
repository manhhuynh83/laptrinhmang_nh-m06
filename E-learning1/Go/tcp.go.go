package main

import (
	"bufio"
	"fmt"
	"net"
	"os"
	"strings"
)

// ---------------------- MAIN ----------------------
func main() {
	fmt.Println("Chọn chế độ chạy:")
	fmt.Println("1. Server")
	fmt.Println("2. Client")
	fmt.Print("Nhập số (1/2): ")

	var choice string
	fmt.Scanln(&choice)

	if choice == "1" {
		startServer()
	} else if choice == "2" {
		startClient()
	} else {
		fmt.Println("Lựa chọn không hợp lệ! Thoát chương trình.")
	}
}

// ---------------------- SERVER ----------------------
func startServer() {
	listener, err := net.Listen("tcp", ":8080")
	if err != nil {
		fmt.Println("Error listening:", err)
		os.Exit(1)
	}
	defer listener.Close()

	fmt.Println("✅ Server đang chạy trên cổng 8080...")

	for {
		conn, err := listener.Accept()
		if err != nil {
			fmt.Println("Error accepting:", err)
			continue
		}

		if tcpConn, ok := conn.(*net.TCPConn); ok {
			tcpConn.SetNoDelay(true)
			tcpConn.SetReadBuffer(65536)
			tcpConn.SetWriteBuffer(65536)
			tcpConn.SetKeepAlive(true)
		}

		go handleConnection(conn)
	}
}

func handleConnection(conn net.Conn) {
	defer conn.Close()

	clientAddr := conn.RemoteAddr().String()
	fmt.Printf("📡 Kết nối từ: %s\n", clientAddr)

	buffer := make([]byte, 1024)

	for {
		length, err := conn.Read(buffer)
		if err != nil {
			fmt.Printf("⚠️ Đóng kết nối từ %s\n", clientAddr)
			return
		}

		message := strings.TrimSpace(string(buffer[:length]))
		fmt.Printf("📨 Nhận từ %s: %s\n", clientAddr, message)

		// Gửi lại phản hồi cho client
		_, err = conn.Write([]byte("Echo: " + message + "\n"))
		if err != nil {
			fmt.Println("Lỗi khi gửi:", err)
			return
		}
	}
}

// ---------------------- CLIENT ----------------------
func startClient() {
	conn, err := net.Dial("tcp", "127.0.0.1:8080")
	if err != nil {
		fmt.Println("Không thể kết nối server:", err)
		return
	}
	defer conn.Close()

	fmt.Println("✅ Đã kết nối server. Gõ tin nhắn (gõ 'exit' để thoát).")

	reader := bufio.NewReader(os.Stdin)
	for {
		fmt.Print("Bạn: ")
		text, _ := reader.ReadString('\n')
		text = strings.TrimSpace(text)

		if text == "exit" {
			fmt.Println("🔚 Đóng kết nối client...")
			break
		}

		_, err := conn.Write([]byte(text + "\n"))
		if err != nil {
			fmt.Println("Lỗi gửi:", err)
			break
		}

		buffer := make([]byte, 1024)
		length, err := conn.Read(buffer)
		if err != nil {
			fmt.Println("⚠️ Server đã đóng kết nối.")
			break
		}

		fmt.Printf("Server: %s\n", string(buffer[:length]))
	}
}
