use std::io::{self, Write, Read};
use std::net::TcpStream;

fn main() {
    // Kết nối đến server
    match TcpStream::connect("127.0.0.1:7878") {
        Ok(mut stream) => {
            println!("✅ Đã kết nối đến server tại 127.0.0.1:7878");

            // Gửi thông điệp đến server
            let msg = "GET / HTTP/1.1\r\nHost: localhost\r\n\r\n";
            stream.write_all(msg.as_bytes()).expect("Không thể gửi dữ liệu");

            println!("Đã gửi yêu cầu: {}", msg);

            // Đọc phản hồi từ server
            let mut buffer = [0; 512];
            let bytes_read = stream.read(&mut buffer).expect("Không thể đọc phản hồi");

            println!(
                "Phản hồi từ server:\n{}",
                String::from_utf8_lossy(&buffer[..bytes_read])
            );
        }
        Err(e) => {
