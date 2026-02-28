import {
  capitalizeFirstLetter,
  formatCurrencyNoUnit,
  isJsonString,
} from "../libs/index.js";

// Lấy cấu hình reCAPTCHA từ config.php
let recaptcha_sitekey = '';
let recaptcha_enabled = true;

// Hàm để lấy cấu hình reCAPTCHA từ server
async function getRecaptchaSiteKey() {
  try {
    const response = await fetch('/api/get_recaptcha_key.php');
    const data = await response.json();
    
    // Lấy trạng thái bật/tắt reCAPTCHA
    recaptcha_enabled = data.enabled;
    
    if (data.sitekey) {
      recaptcha_sitekey = data.sitekey;
      console.log('reCAPTCHA site key:', recaptcha_sitekey);  
      // Chỉ tải reCAPTCHA nếu được bật
      if (recaptcha_enabled) {
        // Thêm script reCAPTCHA với site key đã lấy được
        loadRecaptchaScript();
      } else {
        // Nếu reCAPTCHA bị tắt, bỏ qua việc tải script và bật nút thanh toán
        console.log('reCAPTCHA đã bị tắt trong cấu hình');
        enablePaymentButton();
      }
    }
  } catch (error) {
    console.error('Lỗi khi lấy cấu hình reCAPTCHA:', error);
    // Sử dụng giá trị mặc định nếu không lấy được từ server
    recaptcha_sitekey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
    recaptcha_enabled = true;
    loadRecaptchaScript();
  }
}

// Hàm để bật nút thanh toán
function enablePaymentButton() {
  if ($("#btnPayment").length) {
    var btnPayment2 = $("#btnPayment");
    btnPayment2.prop("disabled", false);
    btnPayment2.removeClass("opacity-50 cursor-not-allowed");
  }
}

// Hàm để tải script reCAPTCHA với site key
function loadRecaptchaScript() {
  const script = document.createElement('script');
  script.src = `https://www.google.com/recaptcha/api.js?render=explicit&onload=onRecaptchaLoaded`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

// Hàm callback khi reCAPTCHA được tải
window.onRecaptchaLoaded = function() {
  console.log('reCAPTCHA đã được tải');
  // Tạo reCAPTCHA widget
  var recaptchaContainer = document.getElementById('recaptcha-container');
  if (recaptchaContainer) {
    console.log('Tìm thấy container, đang render reCAPTCHA');
    grecaptcha.render('recaptcha-container', {
      'sitekey': recaptcha_sitekey,
      'callback': 'recaptchaCallback'
    });
  } else {
    console.error('Không tìm thấy phần tử recaptcha-container trên trang');
  }
};

// Gọi hàm để lấy site key khi trang được tải
getRecaptchaSiteKey();

$(document).ready(function () {
  const playerData = JSON.parse(localStorage.getItem("playerData"));
  const footerDenom = JSON.parse(localStorage.getItem("footerDenom"));
  const userRechargeInfo = JSON.parse(localStorage.getItem("userRechargeInfo"));

  const totalPrice = document.getElementById("totalPrice");
  const originalPrice = document.getElementById("originalPrice");
  const bonusPrice = document.getElementById("bonusPrice");
  const denomPrice = document.getElementById("denomPrice");
  const denomIcons = document.querySelectorAll(".denomIcon");
  const code = document.getElementById("code");
  const serial = document.getElementById("serial");
  const paymentMethod = document.getElementById("paymentMethod");
  const playerName = document.getElementById("playerName");
  const gameBackground = document.getElementById("gameBackground");
  const gameLogo = document.getElementById("gameLogo");
  const gameName = document.getElementById("gameName");
  const btnPayment = document.getElementById("btnPayment");
  // const paymentInfoSection = document.getElementById("paymentInfoSection");

  if (footerDenom && userRechargeInfo) {
    totalPrice.textContent = formatCurrencyNoUnit(footerDenom.totalPrice);
    originalPrice.textContent = formatCurrencyNoUnit(
      footerDenom.matchingDenomPrice,
    );
    bonusPrice.textContent = formatCurrencyNoUnit(
      footerDenom.matchingDenomBonus,
    );
    denomIcons.forEach((icon) => {
      icon.src = footerDenom.denomIcon;
    });
    denomPrice.textContent = footerDenom.denomPrice;
    code.textContent = userRechargeInfo.codeInputValue;
    serial.textContent = userRechargeInfo.serialInputValue;
    paymentMethod.textContent = capitalizeFirstLetter(
      footerDenom.paymentMethod,
    );
    gameBackground.style.backgroundImage = `url(${userRechargeInfo.gameSelected.background})`;
    gameLogo.src = userRechargeInfo.gameSelected.icon;
    gameName.textContent = userRechargeInfo.gameSelected.name;
  }

  if (playerData) {
    playerName.textContent = playerData.nickname;
  }

  function extractDenomPrice(priceString) {
    var numericString = priceString.replace(/[^\d]/g, "");

    var numericValue = parseInt(numericString, 10);
    return numericValue;
  }

  if (btnPayment) {
    var btnPayment2 = $("#btnPayment");
    // Vô hiệu hóa nút thanh toán ban đầu
    btnPayment2.prop("disabled", true);
    btnPayment2.addClass("opacity-50 cursor-not-allowed");
    
    // Kiểm tra reCAPTCHA khi có thay đổi
    function checkRecaptcha() {
      // Chỉ kiểm tra nếu reCAPTCHA được bật và grecaptcha đã được khởi tạo
      if (recaptcha_enabled && typeof grecaptcha !== 'undefined' && grecaptcha && grecaptcha.getResponse) {
        var recaptchaResponse = grecaptcha.getResponse();
        if (recaptchaResponse.length > 0) {
          btnPayment2.prop("disabled", false);
          btnPayment2.removeClass("opacity-50 cursor-not-allowed");
        } else {
          btnPayment2.prop("disabled", true);
          btnPayment2.addClass("opacity-50 cursor-not-allowed");
        }
      }
    }
    
    // Chỉ kiểm tra nếu reCAPTCHA được bật
    if (recaptcha_enabled) {
      // Kiểm tra mỗi 1 giây
      setInterval(checkRecaptcha, 1000);
    }
    
    // Thêm callback cho reCAPTCHA
    window.recaptchaCallback = function() {
      btnPayment2.prop("disabled", false);
      btnPayment2.removeClass("opacity-50 cursor-not-allowed");
    };
    
    btnPayment.addEventListener("click", function () {
      // Chỉ kiểm tra reCAPTCHA nếu được bật
      if (recaptcha_enabled) {
        var recaptchaResponse = grecaptcha.getResponse();
        if (recaptchaResponse.length === 0) {
          alert("Vui lòng xác nhận bạn không phải là robot");
          return;
        }
      } else {
        // Nếu reCAPTCHA bị tắt, đặt giá trị trống cho recaptchaResponse
        var recaptchaResponse = "";
      }

      $.ajax({
        type: "POST",
        url: "/api/callback.php",
        data: {
          type:
            footerDenom.paymentMethod === "garena"
              ? "GARENA2"
              : footerDenom.paymentMethod.toUpperCase(),
          amount: extractDenomPrice(footerDenom.denomPrice),
          code: userRechargeInfo.codeInputValue,
          serial: userRechargeInfo.serialInputValue,
          name: playerData ? playerData.nickname : "test",
          recaptcha: recaptchaResponse,
        },
        beforeSend: function () {
          btnPayment2.prop("disabled", true);
          btnPayment2.text("Đang thanh toán...");
          $("#paymentInfoSection").removeClass();
          $("#paymentInfoSection").html(`
            <div class="bg-[#F9F9F9]">
              <div class="mx-auto flex min-h-[250px] w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-6 pb-9 pt-8 text-center md:max-w-[600px] md:bg-contain">
                <div class="flex flex-col items-center text-center">
                  <div class="mb-5 inline-block text-[90px]">
                    <div class="mb-1">
                      <img class="h-9 w-9 animate-spin" src="https://cdn-gop.garenanow.com/gop/mshop/www/live/assets/loading-d72c4881.png">
                    </div>
                  </div>
                  <div class="mb-3 px-4 text-base/none font-bold text-text-title">Đang xử lí...</div>
                  <div class="px-4 text-sm/[22px] text-text-secondary">Vui lòng không đóng trình duyệt đến khi trang chuyển hướng</div>
                </div>
              </div>
            </div>
          `);
        },
      }).done(function (data) {
        const currentTime = new Date().getTime();
        localStorage.setItem("transactionTime", currentTime);
        
        try {
          // Xử lý trường hợp data là object hoặc chuỗi JSON
          let parsedData = data;
          
          // Nếu data là chuỗi, thử parse thành JSON
          if (typeof data === 'string') {
            parsedData = JSON.parse(data);
          }
          
          if (parsedData.status === "error") {
            setTimeout(() => {
              window.location.href = "/fail.html";
            }, 2000);
          } else {
            setTimeout(() => {
              window.location.href = "/success.html";
            }, 2000);
          }
        } catch (error) {
          // Mặc định chuyển hướng đến trang success
          setTimeout(() => {
            window.location.href = "/success.html";
          }, 2000);
        }
      });
      //window.location.href = "/success.html";
    });
  }
});
