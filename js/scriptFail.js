import { capitalizeFirstLetter, formatCurrencyNoUnit } from "../libs/index.js";

$(document).ready(function () {
  // const playerData = JSON.parse(localStorage.getItem("playerData"));
  const footerDenom = JSON.parse(localStorage.getItem("footerDenom"));
  const userRechargeInfo = JSON.parse(localStorage.getItem("userRechargeInfo"));
  const transactionTime = localStorage.getItem("transactionTime");
  const playerData = JSON.parse(localStorage.getItem("playerData"));

  const totalPrice = document.getElementById("totalPrice");
  const originalPrice = document.getElementById("originalPrice");
  const bonusPrice = document.getElementById("bonusPrice");
  const denomPrice = document.getElementById("denomPrice");
  const denomIcons = document.querySelectorAll(".denomIcon");
  const paymentMethod = document.getElementById("paymentMethod");
  const gameName = document.getElementById("gameName");

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
    paymentMethod.textContent = capitalizeFirstLetter(
      footerDenom.paymentMethod,
    );
  }

  // Hiển thị tên game từ userRechargeInfo
  console.log('userRechargeInfo:', userRechargeInfo);
  console.log('gameName element:', gameName);
  
  // Force set game name based on currentApp first
  const currentApp = localStorage.getItem("app") || "nap_so";
  console.log('Current app from localStorage:', currentApp);
  
  if (currentApp === "delta_force") {
    gameName.textContent = "Delta Force";
    console.log('Set game name to Delta Force from currentApp');
  } else if (userRechargeInfo && userRechargeInfo.gameSelected && gameName) {
    gameName.textContent = userRechargeInfo.gameSelected.name;
    console.log('Game name from userRechargeInfo:', userRechargeInfo.gameSelected.name);
  } else {
    console.log('userRechargeInfo or gameSelected not found:', userRechargeInfo);
    // Keep default "Free Fire" if no data found
  }

  if (transactionTime) {
    // Chuyển UNIX timestamp (giây) thành milliseconds bằng cách nhân với 1000
    const date = new Date(parseInt(transactionTime, 10));

    // Format ngày tháng theo yêu cầu: "21:16:01 6/6/2024"
    const formattedDate =
      date.toLocaleTimeString("en-GB", { hour12: false }) +
      " " +
      date.getDate() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getFullYear();

    $("#transactionTime").text(formattedDate);
  }

  // if (playerData) {
  //   playerName.textContent = playerData.nickname;
  // }
});
