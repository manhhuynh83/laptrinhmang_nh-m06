package main

import (
	"bufio"
	"fmt"
	"net"
	"os"
)

func main() {
	conn, err := net.Dial("tcp", "127.0.0.1:8080")
	if err != nil {
		fmt.Println("Error connecting:", err)
		return
	}
	defer conn.Close()

	fmt.Println("✅ Connected to server. Type messages below:")

	reader := bufio.NewReader(os.Stdin)
	for {
		fmt.Print("You: ")
		text, _ := reader.ReadString('\n')

		_, err := conn.Write([]byte(text))
		if err != nil {
			fmt.Println("Error writing:", err)
			break
		}

		buffer := make([]byte, 1024)
		length, err := conn.Read(buffer)
		if err != nil {
			fmt.Println("Server closed connection")
			break
		}

		fmt.Printf("Server: %s\n", string(buffer[:length]))
	}
}
