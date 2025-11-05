import axiosInstance from "./axiosInstance";

//Hàm login (tạm mock)
export const loginUser = async (email, password) => {
    try {
        // Giả lập API (chưa có backend thật)
        const response = await axiosInstance.post("/auth/login", {
            email,
            password
        });
        return response.data; // Trả về dữ liệu người dùng
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}