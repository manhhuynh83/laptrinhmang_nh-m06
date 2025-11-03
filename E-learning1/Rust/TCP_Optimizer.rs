use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::thread;
use std::time::Duration;

fn handle_client(mut stream: TcpStream) {
    let mut buffer = [0; 512];
    let bytes_read = stream.read(&mut buffer).expect("Không thể đọc dữ liệu từ client");

    println!(
        "Yêu cầu từ client:\n{}",
        String::from_utf8_lossy(&buffer[..bytes_read])
    );

    // Gửi phản hồi HTTP đơn giản về client
    let response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\nXin chào từ server!";
    stream.write_all(response.as_bytes()).expect("Không thể gửi phản hồi");
    println!("Đã gửi phản hồi đến client");
}

fn run_server() {
    let listener = TcpListener::bind("127.0.0.1:7878").expect("Không thể mở port 7878");
    println!("Server đang chạy tại 127.0.0.1:7878");

    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                println!("Client mới kết nối: {}", stream.peer_addr().unwrap());
                thread::spawn(|| handle_client(stream));
            }
            Err(e) => {
                eprintln!("Lỗi khi chấp nhận kết nối: {}", e);
            }
        }
    }
}

fn run_client() {
    match TcpStream::connect("127.0.0.1:7878") {
        Ok(mut stream) => {
            println!("Đã kết nối đến server tại 127.0.0.1:7878");

            let msg = "GET / HTTP/1.1\r\nHost: localhost\r\n\r\n";
            stream.write_all(msg.as_bytes()).expect("Không thể gửi dữ liệu");
            println!("Đã gửi yêu cầu: {}", msg);

            let mut buffer = [0; 512];
            let bytes_read = stream.read(&mut buffer).expect("Không thể đọc phản hồi");

            println!(
                "Phản hồi từ server:\n{}",
                String::from_utf8_lossy(&buffer[..bytes_read])
            );
        }
        Err(e) => {
            println!("Không thể kết nối đến server: {}", e);
        }
    }
}

fn main() {
    println!("Bạn muốn chạy [s]erver hay [c]lient?");
    let mut choice = String::new();
    std::io::stdin().read_line(&mut choice).unwrap();

    match choice.trim() {
        "s" | "S" => run_server(),
        "c" | "C" => {
            // Đợi 1 chút cho server khởi động (nếu chạy cùng máy)
            thread::sleep(Duration::from_millis(500));
            run_client()
        }
        _ => println!("Vui lòng nhập 's' để chạy server hoặc 'c' để chạy client."),
    }
}
