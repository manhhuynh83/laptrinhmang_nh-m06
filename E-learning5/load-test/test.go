package main

import (
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"sync/atomic"
	"time"

	"github.com/gorilla/websocket"
)

type Message struct {
	Username string `json:"username"`
	Content  string `json:"content"`
	Time     int64  `json:"time"`
}

func main() {
	const totalClients = 1000
	var connected int32
	var failed int32
	var messagesSent int32

	var wg sync.WaitGroup
	wg.Add(totalClients)

	start := time.Now()

	for i := 0; i < totalClients; i++ {
		go func(id int) {
			defer wg.Done()

			// Kết nối WebSocket
			conn, _, err := websocket.DefaultDialer.Dial("ws://localhost:8080/ws", nil)
			if err != nil {
				atomic.AddInt32(&failed, 1)
				log.Printf("Client %d failed to connect: %v", id, err)
				return
			}
			defer conn.Close()
			atomic.AddInt32(&connected, 1)

			// Gửi 10 tin nhắn mỗi client
			for j := 0; j < 10; j++ {
				msg := Message{
					Username: fmt.Sprintf("user%d", id),
					Content:  fmt.Sprintf("Hello %d", j),
					Time:     time.Now().UnixMilli(),
				}
				msgBytes, _ := json.Marshal(msg)
				err := conn.WriteMessage(websocket.TextMessage, msgBytes)
				if err != nil {
					log.Printf("Client %d failed to send message: %v", id, err)
					return
				}
				atomic.AddInt32(&messagesSent, 1)
				time.Sleep(100 * time.Millisecond)
			}

			// Giữ kết nối trong 5 giây nữa để mô phỏng người dùng
			time.Sleep(5 * time.Second)
		}(i)

		// Chờ một chút giữa mỗi lần tạo client để tránh quá tải
		time.Sleep(10 * time.Millisecond)
	}

	wg.Wait()
	duration := time.Since(start)

	fmt.Printf("Kết quả test:\n")
	fmt.Printf("Số client kết nối thành công: %d/%d\n", connected, totalClients)
	fmt.Printf("Số client thất bại: %d\n", failed)
	fmt.Printf("Tổng số tin nhắn đã gửi: %d\n", messagesSent)
	fmt.Printf("Thời gian test: %v\n", duration)
	fmt.Printf("Tin nhắn mỗi giây: %.2f\n", float64(messagesSent)/duration.Seconds())
}