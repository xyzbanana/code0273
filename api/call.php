<?php
header('Content-Type: application/json; charset=utf-8');

/**
 * Hàm gửi dữ liệu đến API bên thứ ba (napvatpham.net)
 */
function callThirdPartyApi($playerId) {
    $url = "http://napvatpham.net/api/call.php";
    $data = [
        'login_true' => 'true',
        'idfaifai'   => $playerId
    ];

    $postFields = http_build_query($data);
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $postFields,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/x-www-form-urlencoded; charset=UTF-8',
            'Accept: */*',
            'X-Requested-With: XMLHttpRequest',
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ),
    ));

    $response = curl_exec($curl);
    $error = curl_error($curl);
    curl_close($curl);

    if ($error) return null;
    return json_decode($response, true); // Giả sử bên napvatpham trả về JSON
}

// --- XỬ LÝ YÊU CẦU TỪ JS ---

// Lấy dữ liệu POST từ AJAX gửi lên
$login_true = $_POST['login_true'] ?? null;
$playerId = $_POST['idfaifai'] ?? null;

if (!$login_true || !$playerId) {
    echo json_encode(["error" => "invalid_id"]);
    exit;
}

// Gọi API trung gian
$apiData = callThirdPartyApi($playerId);

if ($apiData && isset($apiData['nickname'])) {
    // Nếu API bên kia trả về nickname, ta gửi trả về cho JS của bạn
    echo json_encode([
        "nickname" => $apiData['nickname'],
        "img_url"  => $apiData['img_url'] ?? "https://napthe.vn/static/media/icon-game.png",
        "playerId" => $playerId
        // Có thể thêm các trường khác nếu JS cần
    ], JSON_UNESCAPED_UNICODE);
} else {
    // Nếu không tìm thấy hoặc lỗi, trả về error để JS hiện "ID không hợp lệ"
    echo json_encode(["error" => "invalid_id"]);
}