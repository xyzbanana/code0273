import {
  formEnterIDContent,
  gameData,
  textLoginContent,
} from "../data/index.js";

import { capitalizeFirstLetter, formatCurrency } from "../libs/index.js";

let isFullListDisplayed = false;
let lastClickedElement = null;
let previousClickedElementDenom = null;
let previousClickedElementPaymentMethod = null;

// const url = new URL(window.location);
// const urlParams = new URLSearchParams(url.search);
// const channelPaymentMethodParam = urlParams.get("channel");

function createNotificationElement(methodSelected) {
  const div = document.createElement("div");
  div.id = "notification";
  div.className = "mb-4 text-xs/normal text-text-secondary";
  div.innerHTML = `
        <svg width="1em" height="1em" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="inline-block align-middle text-base/none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9 18C9 11.9249 13.9249 7 20 7H60C66.0751 7 71 11.9249 71 18V62C71 68.0751 66.0751 73 60 73H20C13.9249 73 9 68.0751 9 62V18ZM20 13C17.2386 13 15 15.2386 15 18V62C15 64.7614 17.2386 67 20 67H60C62.7614 67 65 64.7614 65 62V18C65 15.2386 62.7614 13 60 13H20ZM23 31C23 29.3431 24.3431 28 26 28H54C55.6569 28 57 29.3431 57 31C57 32.6569 55.6569 34 54 34H26C24.3431 34 23 32.6569 23 31ZM26 46C24.3431 46 23 47.3431 23 49C23 50.6569 24.3431 52 26 52H42C43.6569 52 45 50.6569 45 49C45 47.3431 43.6569 46 42 46H26Z" fill="currentColor"></path>
        </svg>
        <span id="notiText">Nạp thẻ <span style="color: #d81a0d;">
          ${capitalizeFirstLetter(methodSelected)}
        </span> vào tài khoản game của bạn</span>
      `;
  return div;
}

function renderStickyFooterDenom(
  document,
  elementSelected,
  game,
  paymentMethod,
) {
  if (elementSelected) {
    const denomIcon = elementSelected.querySelector("img")?.src;
    const denomPrice = elementSelected.querySelector(".denomPrice").textContent;
    const matchingDenom = findDenomByPrice(game, denomPrice, gameData);
    // const url = new URL(window.location);

    const matchingBonusProcessed =
      typeof matchingDenom.bonus === "number"
        ? Number(
            formatCurrency(matchingDenom.bonus)
              .replace("đ", "")
              .replace(".", ""),
          )
        : Number(matchingDenom.bonus.replace(/[^\d.]/g, "").replace(".", ""));

    localStorage.setItem(
      "footerDenom",
      JSON.stringify({
        denomPrice: denomPrice,
        matchingDenomPrice: matchingDenom.denom,
        matchingDenomBonus: matchingBonusProcessed,
        totalPrice: matchingDenom.denom + matchingBonusProcessed,
        denomIcon: denomIcon,
        paymentMethod,
      }),
    );

    const existingStickyContainer = document.querySelector(".sticky-footer");
    if (existingStickyContainer) {
      existingStickyContainer.remove();
    }

    const stickyContainer = document.createElement("div");
    stickyContainer.className = "sticky sticky-footer inset-x-0 bottom-0 z-10";
    stickyContainer.dataset.headlessuiState = "";

    const innerContainer = document.createElement("div");
    innerContainer.className =
      "mx-auto flex w-full max-w-5xl items-center justify-between gap-4 bg-white p-4 shadow-top-line md:justify-end md:gap-10 lg:px-10";

    const infoSection = document.createElement("div");
    infoSection.id = "infoSection";
    infoSection.className = "flex flex-col md:items-end";

    const pointsContainer = document.createElement("div");
    pointsContainer.className =
      "flex items-center gap-1 text-sm/none font-bold md:text-end md:text-base/none";

    const pointsImage = document.createElement("img");
    pointsImage.className = "h-4 w-4 object-contain";
    pointsImage.src = denomIcon;

    const pointsText = document.createElement("span");
    pointsText.dir = "ltr";
    if (typeof matchingDenom.denom === "number") {
      pointsText.textContent = formatCurrency(matchingDenom.denom).replace(
        "đ",
        "",
      );
    } else if (typeof matchingDenom.denom === "string") {
      const numericBonus = matchingDenom.denom.replace(/[^\d.]/g, "");
      pointsText.textContent = numericBonus;
    }

    const bonusText = document.createElement("span");
    bonusText.className = "whitespace-nowrap";
    if (typeof matchingDenom.bonus === "number") {
      bonusText.textContent = `+ ${formatCurrency(matchingDenom.bonus).replace(
        "đ",
        "",
      )}`;
    } else if (typeof matchingDenom.bonus === "string") {
      const numericBonus = matchingDenom.bonus.replace(/[^\d.]/g, "");
      bonusText.textContent = `+ ${numericBonus}`;
    }

    const expandButton = document.createElement("button");
    expandButton.className =
      "rounded-full bg-[#F2F2F6] text-lg transition-all hover:opacity-70";
    expandButton.type = "button";
    expandButton.setAttribute("aria-expanded", "false");
    expandButton.dataset.headlessuiState = "";
    expandButton.id = "headlessui-popover-button-:r50:";
    expandButton.innerHTML = `<svg width="1em" height="1em" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.25 9.96484L9 7.71484L6.75 9.96484" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

    pointsContainer.appendChild(pointsImage);
    pointsContainer.appendChild(pointsText);
    pointsContainer.appendChild(bonusText);
    pointsContainer.appendChild(expandButton);

    const totalPriceSection = document.createElement("div");
    totalPriceSection.className =
      "mt-2 flex items-center gap-1 text-sm/none md:text-end md:text-base/none";

    const totalPriceText = document.createElement("span");
    totalPriceText.className = "font-medium";
    totalPriceText.textContent = "Giá:";

    const totalPriceValue = document.createElement("span");
    totalPriceValue.className =
      "items-center [text-decoration:inherit] flex font-bold text-primary-red";
    totalPriceValue.textContent = `${denomPrice}`;

    totalPriceSection.appendChild(totalPriceText);
    totalPriceSection.appendChild(totalPriceValue);

    infoSection.appendChild(pointsContainer);
    infoSection.appendChild(totalPriceSection);

    const paymentButton = document.createElement("button");
    paymentButton.type = "button";
    paymentButton.id = "paymentButton";
    paymentButton.className =
      "inline-flex items-center justify-center gap-1.5 rounded-md border py-1 text-center leading-none transition-colors border-primary-red bg-primary-red text-white hover:bg-primary-red-hover hover:border-primary-red-hover px-5 text-base font-bold h-11";
    paymentButton.innerHTML = `<span class="text-lg h-[18px] w-[18px]"><svg width="1em" height="1em" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M54.125 34.1211C55.2966 32.9495 55.2966 31.05 54.125 29.8784C52.9534 28.7069 51.0539 28.7069 49.8823 29.8784L38.0037 41.7571L32.125 35.8784C30.9534 34.7069 29.0539 34.7069 27.8823 35.8784C26.7108 37.05 26.7108 38.9495 27.8823 40.1211L35.8823 48.1211C37.0539 49.2926 38.9534 49.2926 40.125 48.1211L54.125 34.1211Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M43.4187 3.4715C41.2965 2.28554 38.711 2.28554 36.5889 3.4715L8.07673 19.4055C6.19794 20.4555 4.97252 22.4636 5.02506 24.7075C5.36979 39.43 10.1986 63.724 37.0183 76.9041C38.8951 77.8264 41.1125 77.8264 42.9893 76.9041C69.809 63.724 74.6377 39.43 74.9825 24.7075C75.035 22.4636 73.8096 20.4555 71.9308 19.4055L43.4187 3.4715ZM39.5159 8.7091C39.8191 8.53968 40.1885 8.53968 40.4916 8.7091L68.9826 24.6313C68.6493 38.3453 64.2154 59.7875 40.343 71.5192C40.135 71.6214 39.8725 71.6214 39.6646 71.5192C15.7921 59.7875 11.3583 38.3453 11.025 24.6313L39.5159 8.7091Z" fill="currentColor"></path></svg></span>Thanh toán`;

    innerContainer.appendChild(infoSection);
    innerContainer.appendChild(paymentButton);

    stickyContainer.appendChild(innerContainer);

    const mainSection = document.querySelector("#mainSection");
    if (mainSection) {
      mainSection.appendChild(stickyContainer);
    } else {
      document.body.appendChild(stickyContainer);
    }

    paymentButton.addEventListener("click", function () {
      const url = new URL(window.location);
      const appParam = url.searchParams.get("app");
      const codeInputValue = document.getElementById("codeInput").value;
      const serialInputValue = document.getElementById("serialInput").value;
      const playerIdInputElement = document.getElementById("inputPlayerId");

      let playerIdInputValue = null;
      let isValid = true; // Biến theo dõi trạng thái validate

      if (playerIdInputElement) {
        playerIdInputValue = document.getElementById("inputPlayerId").value;
      }

      if (appParam === "free_fire" || appParam === "garena_undawn" || appParam === "delta_force") {
        if (playerIdInputValue !== null && playerIdInputValue === "") {
          document
            .getElementById("inputPlayerId")
            .classList.add("form-input-invalid");
          const formWrapper = document.querySelector("form");
          if (!formWrapper.querySelector("#error-message")) {
            const errorMessage = document.createElement("div");
            errorMessage.id = "error-message";
            errorMessage.className = "text-xs text-primary-red md:text-sm";
            errorMessage.textContent = "Vui lòng nhập ID người chơi";
            formWrapper.appendChild(errorMessage);
          }

          setTimeout(() => {
            const scrollToElement = document.getElementById(
              "gameSelectionContainer",
            );
            if (scrollToElement) {
              scrollToElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }, 0);

          // Có lỗi, set isValid = false
          isValid = false;
        }
      }

      // Giả sử $code và $seri là các biến jQuery tương ứng với các trường nhập mã thẻ và seri
      var $code = $("#codeInput");
      var $seri = $("#serialInput");

      if ($code.val().length === 0) {
        $code.addClass("form-input-invalid");
        showError("codeWrapper", "Vui lòng nhập mã thẻ");
      } else if ($seri.val().length === 0) {
        $seri.addClass("form-input-invalid");
        showError("serialWrapper", "Vui lòng nhập seri");
      } else if ($code.val().length < 12 || $code.val().length > 16) {
        $code.addClass("form-input-invalid");
        showError("codeWrapper", "Mã thẻ không đúng định dạng");
      } else if ($seri.val().length < 9 || $seri.val().length > 15) {
        $seri.addClass("form-input-invalid");
        showError("serialWrapper", "Seri không đúng định dạng");
      } else {
        // Xử lý hợp lệ
      }

      function showError(wrapperId, message) {
        var wrapper = document.querySelector("." + wrapperId);
        var errorMessage = wrapper.querySelector("#error-message");
        if (!errorMessage) {
          errorMessage = document.createElement("div");
          errorMessage.id = "error-message";
          errorMessage.className = "text-xs text-primary-red md:text-sm";
          wrapper.appendChild(errorMessage);
        }
        errorMessage.textContent = message;
        document
          .getElementById("formSubmitCardGarena")
          .scrollIntoView({ behavior: "smooth", block: "center" });
        isValid = false; // Có lỗi, set isValid = false
      }

      function showError(wrapperId, message) {
        var wrapper = document.querySelector("." + wrapperId);
        var errorMessage = wrapper.querySelector("#error-message");
        if (!errorMessage) {
          errorMessage = document.createElement("div");
          errorMessage.id = "error-message";
          errorMessage.className = "text-xs text-primary-red md:text-sm";
          wrapper.appendChild(errorMessage);
        }
        errorMessage.textContent = message;
        document
          .getElementById("formSubmitCardGarena")
          .scrollIntoView({ behavior: "smooth", block: "center" });
        isValid = false; // Có lỗi, set isValid = false
      }

      if (isValid) {
        handleCardTopUpProcessing(
          document,
          appParam || "nap_so",
          codeInputValue,
          serialInputValue,
          playerIdInputValue,
        );
      }
    });

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      infoSection.addEventListener("click", function () {
        const currentState = stickyContainer.getAttribute(
          "data-headlessui-state",
        );
        const targetElement = document.getElementById(
          "headlessui-popover-panel-:r2l:",
        );

        if (currentState !== "open") {
          stickyContainer.setAttribute("data-headlessui-state", "open");
          if (expandButton.classList.contains("rotate-180-reverse")) {
            expandButton.classList.replace("rotate-180-reverse", "rotate-180");
          } else if (!expandButton.classList.contains("rotate-180")) {
            expandButton.classList.add("rotate-180");
          }

          if (!targetElement) {
            // Tạo element chính
            const popover = document.createElement("div");
            popover.className =
              "absolute bottom-full flex flex-col gap-3 bg-white p-4 shadow-top-line max-md:inset-x-0 md:w-[390px] md:gap-4 md:rounded-lg md:border md:border-line md:shadow-[0_9px_28px_8px_rgba(0,0,0,0.05)] opacity-100 translate-y-0";
            popover.className += " fadeIn";
            popover.id = "headlessui-popover-panel-:r2l:";
            popover.tabIndex = -1;
            popover.setAttribute("data-headlessui-state", "open");

            const headerDiv = document.createElement("div");
            headerDiv.className =
              "flex justify-between text-sm/none font-bold text-text-title md:text-base/none";

            headerDiv.innerHTML = "";

            const textNode = document.createTextNode("Tổng nhận");
            headerDiv.appendChild(textNode);

            const spanElement = document.createElement("span");
            spanElement.className = "inline-flex items-center";

            const imgElement = document.createElement("img");
            imgElement.className = "me-1.5 h-4 w-4 object-contain";
            imgElement.src = denomIcon;

            spanElement.appendChild(imgElement);

            const processedBonus =
              typeof matchingDenom.bonus === "number"
                ? Number(formatCurrency(matchingDenom.bonus).replace("đ", ""))
                : Number(
                    matchingDenom.bonus.replace(/[^\d.]/g, "").replace(".", ""),
                  );

            const countTextNode = document.createTextNode(
              `${formatCurrency(matchingDenom.denom + processedBonus).replace(
                /[^\d.]/g,
                "",
              )}`,
            );
            spanElement.appendChild(countTextNode);

            // Append the span to the headerDiv
            headerDiv.appendChild(spanElement);

            const listDiv = document.createElement("div");
            const ul = document.createElement("ul");
            ul.className =
              "flex flex-col gap-3 rounded-[5px] border border-line/50 bg-[#F9F9F9] p-3 text-xs/none md:text-sm/none";

            // Tạo và thêm các li vào ul
            const li1 = document.createElement("li");
            li1.className = "flex items-center justify-between gap-12";

            const div1_1 = document.createElement("div");
            div1_1.textContent = "Giá gốc";

            const div1_2 = document.createElement("div");
            div1_2.className = "flex shrink-0 items-center gap-1";

            const img1 = document.createElement("img");
            img1.className = "h-3 w-3 object-contain";
            img1.src = denomIcon;
            img1.alt = matchingDenom.denomName;

            const div1_3 = document.createElement("div");
            div1_3.id = "originalPrice";
            div1_3.className = "font-medium";
            div1_3.textContent = formatCurrency(matchingDenom.denom).replace(
              "đ",
              "",
            );

            div1_2.append(img1, div1_3);
            li1.append(div1_1, div1_2);

            const li2 = document.createElement("li");
            li2.className = "flex items-center justify-between gap-12";

            const div2_1 = document.createElement("div");
            div2_1.style.color = "#ff7a00";
            div2_1.textContent = "+ Bonus";

            const div2_2 = document.createElement("div");
            div2_2.className = "flex shrink-0 items-center gap-1";

            const img2 = document.createElement("img");
            img2.className = "h-3 w-3 object-contain";
            img2.src = denomIcon;
            img2.alt = matchingDenom.denomName;

            const div2_3 = document.createElement("div");
            div2_3.id = "bonusPrice";
            div2_3.className = "font-medium";
            div2_3.textContent =
              typeof matchingDenom.bonus === "number"
                ? formatCurrency(matchingDenom.bonus).replace("đ", "")
                : matchingDenom.bonus.replace(/[^\d.]/g, "");
            div2_2.append(img2, div2_3);
            li2.append(div2_1, div2_2);

            // Nối các element
            ul.appendChild(li1);
            ul.appendChild(li2);
            listDiv.appendChild(ul);
            popover.appendChild(headerDiv);
            popover.appendChild(listDiv);

            infoSection.appendChild(popover);
          }
        } else {
          stickyContainer.setAttribute("data-headlessui-state", "closed");
          expandButton.classList.replace("rotate-180", "rotate-180-reverse");

          if (targetElement) {
            removePopoverWithFadeOut(targetElement);
          }
        }
      });
    } else {
      let isMouseInPopover = false;
      let globalPopover = null;

      infoSection.addEventListener("mouseenter", function () {
        const targetElement = document.getElementById(
          "headlessui-popover-panel-:r2l:",
        );
        stickyContainer.setAttribute("data-headlessui-state", "open");
        if (expandButton.classList.contains("rotate-180-reverse")) {
          expandButton.classList.replace("rotate-180-reverse", "rotate-180");
        } else if (!expandButton.classList.contains("rotate-180")) {
          expandButton.classList.add("rotate-180");
        }

        if (!targetElement) {
          const popover = createPopoverElement(
            document,
            denomIcon,
            matchingDenom,
          );
          globalPopover = popover;
          infoSection.appendChild(popover);

          // Chỉ thêm lắng nghe sự kiện một lần ngay sau khi popover được tạo
          globalPopover.addEventListener("mouseenter", function () {
            isMouseInPopover = true;
          });

          globalPopover.addEventListener("mouseleave", function () {
            isMouseInPopover = false;
            // Có thể cần thêm logic để xử lý khi chuột rời khỏi popover ở đây
          });
        }
      });

      infoSection.addEventListener("mouseleave", function () {
        setTimeout(() => {
          if (!isMouseInPopover && globalPopover) {
            removePopoverWithFadeOut(globalPopover);

            stickyContainer.setAttribute("data-headlessui-state", "closed");
            expandButton.classList.replace("rotate-180", "rotate-180-reverse");
          }
        }, 100);
      });
    }
  }
}

function handleSelectPaymentMethod(element) {
  const url = new URL(window.location);
  const searchParams = new URLSearchParams(url.search);
  const elementSelectedID = element.getAttribute("id").split("-")[1];
  const paymentMethodCard = document.getElementById("paymentMethodCard");

  if (paymentMethodCard) {
    switch (elementSelectedID) {
       case "garena":
         paymentMethodCard.style.display = "block";
         paymentMethodCard.src = "https://cdn-gop.garenanow.com/webmain/static/open_platform/images/icon_ppc.png";
         break;
      case "vinaphone":
        paymentMethodCard.style.display = "block";
        paymentMethodCard.src = "../images/vinaphone.png";
        break;
      case "viettel":
        paymentMethodCard.style.display = "block";
        paymentMethodCard.src = "../images/viettel.svg";
        break;
      case "mobifone":
        paymentMethodCard.style.display = "block";
        paymentMethodCard.src = "../images/mobifone.png";
        break;
      default:
        break;
    }
  }

  if (previousClickedElementPaymentMethod === element) {
    element.removeAttribute("data-headlessui-state");
    updateDenomItemsStatus(null, document);

    // Remove the notification elements from the DOM
    const paymentMethodContainer = document.getElementById(
      "headlessui-radiogroup-payment-method",
    );
    const stickyNotificationElement = paymentMethodContainer.querySelector(
      "#notificationSticky",
    );
    const notificationStickyWrapperElement =
      paymentMethodContainer.querySelector("#notificationStickyWrapper");
    if (stickyNotificationElement) {
      stickyNotificationElement.remove();
      notificationStickyWrapperElement.remove();
    }

    const notificationElement =
      paymentMethodContainer.querySelector("#notification");

    if (notificationElement) {
      paymentMethodContainer.removeChild(notificationElement);
    }

    previousClickedElementPaymentMethod = null;

    searchParams.delete("channel");
    url.search = searchParams.toString();
    // Update the browser history
    window.history.pushState({}, "", url.toString());
    paymentMethodCard.style.display = "none";
  } else {
    if (previousClickedElementPaymentMethod) {
      previousClickedElementPaymentMethod.removeAttribute(
        "data-headlessui-state",
      );
    }

    element.setAttribute("data-headlessui-state", "checked active");
    updateDenomItemsStatus(element, document);

    const paymentMethodContainer = document.getElementById(
      "headlessui-radiogroup-payment-method",
    );

    const existingStickyNotificationElement =
      paymentMethodContainer.querySelector("#notificationSticky");
    if (existingStickyNotificationElement) {
      const contentElement =
        existingStickyNotificationElement.querySelector("#notiStrongText");
      if (contentElement) {
        contentElement.textContent = elementSelectedID;
      }
    }

    const existingNotificationElement =
      paymentMethodContainer.querySelector("#notification");
    if (existingNotificationElement) {
      const notiTextElement =
        existingNotificationElement.querySelector("#notiText");
      if (notiTextElement) {
        notiTextElement.innerHTML = `Nạp thẻ <span style="color: #d81a0d;">${capitalizeFirstLetter(
          elementSelectedID,
        )}</span> vào tài khoản game của bạn`;
      }
    } else {
      const notificationElement = createNotificationElement(elementSelectedID);
      const secondChild = paymentMethodContainer.children[1];
      if (secondChild) {
        paymentMethodContainer.insertBefore(notificationElement, secondChild);
      } else {
        paymentMethodContainer.appendChild(notificationElement);
      }
    }

    // const url = new URL(window.location);
    url.searchParams.set("channel", elementSelectedID);
    searchParams.set("channel", elementSelectedID);
    // sortUrlParams(url);

    renderStickyFooterDenom(
      document,
      previousClickedElementDenom,
      gameData.find(
        (g) => g.id === new URLSearchParams(url.search).get("app") || "nap_so",
      ),
      elementSelectedID,
    );

    sortUrlParams(url);

    previousClickedElementPaymentMethod = element;
  }

  // urlParamSelectedState = new URLSearchParams(url.search).get("channel");
}

function updateDenomItemsStatus(elementSelected, document) {
  const isSelected = elementSelected !== null && elementSelected !== undefined;

  setTimeout(() => {
    const denomItems = document.querySelectorAll(".denomItem");

    denomItems.forEach((item) => {
      if (isSelected) {
        item.classList.remove("disabled");
      } else {
        item.classList.add("disabled");
      }
    });
  }, 0);
}

function sortUrlParams(url) {
  const sortOrder = ["app", "channel", "denom"];

  const params = new URLSearchParams(url.search);

  const sortedParams = Array.from(params.entries()).sort((a, b) => {
    const indexA = sortOrder.indexOf(a[0]);
    const indexB = sortOrder.indexOf(b[0]);
    return indexA - indexB;
  });

  const uniqueParams = sortedParams.reduce((acc, current) => {
    const [key] = current;
    if (!acc.find(([accKey]) => accKey === key)) {
      acc.push(current);
    }
    return acc;
  }, []);

  const newParams = new URLSearchParams(uniqueParams);

  url.search = newParams.toString();

  window.history.pushState({}, "", url);
}

function removePopoverWithFadeOut(popover) {
  if (popover.classList.contains("fadeIn")) {
    popover.classList.replace("fadeIn", "fadeOut");
  }

  popover.addEventListener("animationend", () => {
    popover.remove();
  });
}

function findDenomByPrice(game, denomPrice, gameData) {
  const normalizedPrice = denomPrice.replace(/\D/g, "");
  for (const denomItem of game.denomList) {
    const itemPrice = denomItem.price.replace(/\D/g, "");
    if (itemPrice === normalizedPrice) {
      const gameInfo = gameData.find((g) => g.id === game.id);
      const denomName = gameInfo ? gameInfo.denomName : "Unknown";
      return {
        denom: denomItem.denom,
        bonus: denomItem.bonus,
        denomName: denomName,
      };
    }
  }
  return null;
}

function handleCardTopUpProcessing(
  document,
  appParam,
  codeInputValue,
  serialInputValue,
  playerIdInputValue,
) {
  // const url = new URL(window.location);
  const body = document.querySelector("body");

  const playerData = JSON.parse(localStorage.getItem("playerData"));
  console.log('appParam in saveUserRechargeInfo:', appParam);
  const gameSelected = gameData.find((g) => g.id === appParam);
  console.log('gameSelected found:', gameSelected);

  const userRechargeData = {
    appParam,
    codeInputValue,
    serialInputValue,
    playerIdInputValue:
      playerIdInputValue || (playerData ? playerData.playerId : ""),
    gameSelected,
    playerName: playerData ? playerData.playerName : "",
  };
  
  console.log('Saving userRechargeInfo:', userRechargeData);
  console.log('Game selected:', gameSelected);
  
  localStorage.setItem(
    "userRechargeInfo",
    JSON.stringify(userRechargeData),
  );
  body.classList.add("body-loading");
  window.location.href = "payment.html";
  body.classList.remove("body-loading");
  // body.classList.add("body-loading");
  /*
  $.ajax({
    type: "POST",
    url: "/api/callback.php",
    data: {
      type: new URLSearchParams(url.search).get("channel").toUpperCase(),
      amount: Number(new URLSearchParams(url.search).get("denom")) * 1000,
      code: codeInputValue,
      serial: serialInputValue,
      name: playerData ? playerData.nickname : "test",
    },
    beforeSend: function () {
      body.classList.add("body-loading");
    },
  }).done(function (data) {
    const parsedData = JSON.parse(data);

    body.classList.remove("body-loading");
    var tengame = playerData;
        window.location.href = 'check.php?status='+parsedData.status+'&name='+name;

    if (parsedData.status === "error") {
      alert(parsedData.code);
      body.classList.remove("body-loading");
    } else {
      setTimeout(() => {
        window.location.href = "/payment.html";
      }, 100);
    } 
  });
*/
  // setTimeout(() => {}, 2000);
}

function createPopoverElement(document, denomIcon, matchingDenom) {
  const popover = document.createElement("div");
  popover.className =
    "absolute bottom-full flex flex-col gap-3 bg-white p-4 shadow-top-line max-md:inset-x-0 md:w-[390px] md:gap-4 md:rounded-lg md:border md:border-line md:shadow-[0_9px_28px_8px_rgba(0,0,0,0.05)] opacity-100 translate-y-0";
  popover.className += " fadeIn";
  popover.id = "headlessui-popover-panel-:r2l:";
  popover.tabIndex = -1;
  popover.setAttribute("data-headlessui-state", "open");

  const headerDiv = document.createElement("div");
  headerDiv.className =
    "flex justify-between text-sm/none font-bold text-text-title md:text-base/none";

  headerDiv.innerHTML = "";

  const textNode = document.createTextNode("Tổng nhận");
  headerDiv.appendChild(textNode);

  const spanElement = document.createElement("span");
  spanElement.id = "denomTotal";
  spanElement.className = "inline-flex items-center";

  const imgElement = document.createElement("img");
  imgElement.className = "me-1.5 h-4 w-4 object-contain";
  imgElement.src = denomIcon;

  spanElement.appendChild(imgElement);

  const processedBonus =
    typeof matchingDenom.bonus === "number"
      ? Number(formatCurrency(matchingDenom.bonus).replace("đ", ""))
      : Number(matchingDenom.bonus.replace(/[^\d.]/g, "").replace(".", ""));

  const countTextNode = document.createTextNode(
    `${formatCurrency(matchingDenom.denom + processedBonus).replace(
      /[^\d.]/g,
      "",
    )}`,
  );

  spanElement.appendChild(countTextNode);

  // Append the span to the headerDiv
  headerDiv.appendChild(spanElement);

  const listDiv = document.createElement("div");
  const ul = document.createElement("ul");
  ul.className =
    "flex flex-col gap-3 rounded-[5px] border border-line/50 bg-[#F9F9F9] p-3 text-xs/none md:text-sm/none";

  // Tạo và thêm các li vào ul
  const li1 = document.createElement("li");
  li1.className = "flex items-center justify-between gap-12";

  const div1_1 = document.createElement("div");
  div1_1.textContent = "Giá gốc";

  const div1_2 = document.createElement("div");
  div1_2.className = "flex shrink-0 items-center gap-1";

  const img1 = document.createElement("img");
  img1.className = "h-3 w-3 object-contain";
  img1.src = denomIcon;
  img1.alt = matchingDenom.denomName;

  const div1_3 = document.createElement("div");
  div1_3.className = "font-medium";
  div1_3.textContent = formatCurrency(matchingDenom.denom).replace("đ", "");

  div1_2.append(img1, div1_3);
  li1.append(div1_1, div1_2);

  const li2 = document.createElement("li");
  li2.className = "flex items-center justify-between gap-12";

  const div2_1 = document.createElement("div");
  div2_1.style.color = "#ff7a00";
  div2_1.textContent = "+ Bonus";

  const div2_2 = document.createElement("div");
  div2_2.className = "flex shrink-0 items-center gap-1";

  const img2 = document.createElement("img");
  img2.className = "h-3 w-3 object-contain";
  img2.src = denomIcon;
  img2.alt = matchingDenom.denomName;

  const div2_3 = document.createElement("div");
  div2_3.className = "font-medium";
  div2_3.textContent =
    typeof matchingDenom.bonus === "number"
      ? formatCurrency(matchingDenom.bonus).replace("đ", "")
      : matchingDenom.bonus.replace(/[^\d.]/g, "");
  div2_2.append(img2, div2_3);
  li2.append(div2_1, div2_2);

  // Nối các element
  ul.appendChild(li1);
  ul.appendChild(li2);
  listDiv.appendChild(ul);
  popover.appendChild(headerDiv);
  popover.appendChild(listDiv);

  return popover;
}

$(document).ready(function () {
  const gameSelectionContainer = document.getElementById(
    "gameSelectionContainer",
  );
  const gameSelectionName = document.getElementById("gameSelectionName");
  const gameSelectionImage = document.getElementById("gameSelectionImage");
  const gameContainer = document.getElementById("gameContainer");
  const buttonViewMore = document.getElementById("btnViewMore");
  const denomContainer = document.getElementById("denomContainer");
  const paymentMethodContainer = document.getElementById(
    "paymentMethodContainer",
  );
  const btnUserProfile = document.getElementById("btnUserProfile");

  function closeSidebar() {
    $("#sidebarLogin").removeClass("open");
    $("#overlayUserLogin").removeClass("show");

    setTimeout(function () {
      $("#sidebarLoginWrapper").remove();
      $("#overlay").remove();
    }, 300);
  }

  const loadingElement = `
  <div id="loading-login" class="mx-auto flex min-h-[250px] h-full w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-6 pb-9 pt-8 text-center md:max-w-[600px] md:bg-contain">
              <div class="flex flex-col items-center text-center">
                <div class="mb-5 inline-block text-[90px]">
                  <div class="mb-1">
                    <img class="h-9 w-9 animate-spin" src="https://cdn-gop.garenanow.com/gop/mshop/www/live/assets/loading-d72c4881.png">
                  </div>
                </div>
              </div>
            </div>
`;

  // Thêm element loading vào DOM và ẩn header, main, footer
  $("#root").append(loadingElement);
  $("header, main, footer").hide();

  // Đặt thời gian chờ để xóa element loading sau 0.75 giây và hiển thị lại header, main, footer
  setTimeout(function () {
    $("#loading-login").remove();
    $("header, main, footer").show();
    renderWelcomePopup();
  }, 750); // 0.75 giây = 750 mili giây

  const childrenPaymentMethodContainer = paymentMethodContainer
    ? paymentMethodContainer.children
    : [];

  const playerData = JSON.parse(localStorage.getItem("playerData"));
  const startIndex = gameData.findIndex((game) => game.id === "delta_force");

  let childrenGameContainer = gameContainer ? gameContainer.children : [];
  let childrenDenomContainer = denomContainer ? denomContainer.children : [];

  const urlParams = new URLSearchParams(window.location.search);
  const channelPaymentMethodParam = urlParams.get("channel");
  const appParam = urlParams.get("app");
  const denomParam = urlParams.get("denom");
  const isMobile = window.innerWidth < 768;

  const isUnsupportedAppParam = !["garena_undawn", "free_fire", "delta_force"].includes(
    appParam,
  );

  if (isUnsupportedAppParam || urlParams.size === 0) {
    localStorage.removeItem("playerData");

    setTimeout(() => {
      const buttonLogout = document.querySelector(".logout-button");
      if (buttonLogout) {
        buttonLogout.remove();
      }
    }, 100);

    const playerData = null;
    const appIdDefault = "nap_so";

    setTimeout(() => {
      if (!playerData) {
        const loginSection = $("#loginSection");
        const game = gameData.find((game) => game.id === appIdDefault);

        if (game.isEnterId) {
          loginSection.html(formEnterIDContent);
          // event delegation
          loginSection
            .off("click", "#login-button")
            .on("click", "#login-button", handleFormSubmit);
        } else {
          loginSection.html(textLoginContent);
        }
      }
    }, 100);
  }

  if (urlParams.size === 0) {
    const paymentMethodCard = document.getElementById("paymentMethodCard");
    if (paymentMethodCard) {
      paymentMethodCard.style.display = "none";
    }
  }

  if (isMobile) {
    const bannerImage = document.getElementById("bannerImage");
    bannerImage.setAttribute("width", "375");
    bannerImage.setAttribute("height", "141");
  }

  displayGames(0, startIndex + 2);
  updateDenomItemsStatus(null, document);

  if (playerData) {
    renderPlayerInfoIntoLoginSection(playerData, playerData.playerId);
    renderButtonLogout();

    $("#userAvatar").html(`
      <img src="${playerData.img_url}" alt="User avatar" class="h-full w-full rounded-full">
      `);
  }

  setTimeout(() => {
    const userLogin = localStorage.getItem("userLogin");
    if (userLogin) {
      renderPlayerNameIntoLoginSectionGarena(userLogin);
      renderButtonLogout();
    }
  }, 100);

  if (channelPaymentMethodParam) {
    const elementToSelect = document.getElementById(
      `channel-${channelPaymentMethodParam}`,
    );
    if (elementToSelect) {
      handleSelectPaymentMethod(elementToSelect);
      updateDenomItemsStatus(elementToSelect, document);
    }
  }

  if (appParam) {
    localStorage.setItem("app", appParam);
    const elementToSelect = Array.from(childrenGameContainer).find(
      (element) => element.getAttribute("data-game-id") === appParam,
    );
    if (elementToSelect) {
      elementToSelect.click();
    }
  }

  if (denomParam) {
    const elementToSelect = Array.from(childrenDenomContainer).find(
      (element) =>
        element.querySelector("span").textContent.replace("đ", "") ===
        denomParam,
    );

    if (elementToSelect) {
      elementToSelect.click();
    }
  }

  Array.from(childrenPaymentMethodContainer).forEach((element) => {
    element.addEventListener("click", () => {
      handleSelectPaymentMethod(element);
    });
  });

  btnUserProfile.addEventListener("click", function () {
    updateSidebar();
  });

  function updateSidebar() {
    const playerData = JSON.parse(localStorage.getItem("playerData"));

    if (playerData) {
      if ($("#sidebarLogin").length === 0) {
        $("#headlessui-portal-root").append(`
        <button id="overlayUserLogin" type="button" data-headlessui-focus-guard="true" aria-hidden="true" style="position: fixed; top: 1px; left: 1px; width: 1px; height: 0px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; border-width: 0px;"></button>
        <div id="sidebarLoginWrapper"  data-headlessui-portal="">
   <button type="button" data-headlessui-focus-guard="true" aria-hidden="true" style="position: fixed; top: 1px; left: 1px; width: 1px; height: 0px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; border-width: 0px;"></button>
   <div>
      <div class="fixed inset-0 z-10" id="headlessui-dialog-:r7e:" role="dialog" aria-modal="true" data-headlessui-state="open">
         <div id="overlay" class="absolute inset-0 bg-black/60"></div>
         <div id="sidebarLogin" class="h-full z-20" id="headlessui-dialog-panel-:r7f:" data-headlessui-state="open">
               <div class="relative h-full w-[286px]">
                  <button id="closeSidebar" class="absolute start-4 top-4 text-[28px] text-white transition-opacity hover:opacity-70" aria-label="ปิด">
                     <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g>
                           <path fill-rule="evenodd" clip-rule="evenodd" d="M7.83644 6.56341C7.48497 6.21194 6.91512 6.21194 6.56365 6.56341C6.21218 6.91488 6.21218 7.48473 6.56365 7.8362L10.7273 11.9998L6.56366 16.1634C6.21218 16.5149 6.21218 17.0847 6.56366 17.4362C6.91513 17.7877 7.48498 17.7877 7.83645 17.4362L12 13.2726L16.1637 17.4362C16.5151 17.7877 17.085 17.7877 17.4364 17.4362C17.7879 17.0847 17.7879 16.5149 17.4364 16.1634L13.2728 11.9998L17.4364 7.8362C17.7879 7.48473 17.7879 6.91488 17.4364 6.56341C17.085 6.21194 16.5151 6.21194 16.1637 6.56341L12 10.727L7.83644 6.56341Z" fill="currentColor"></path>
                        </g>
                     </svg>
                  </button>
                  <div class="flex h-full min-h-full flex-col overflow-y-auto">
                     <div class="flex h-[246px] flex-col items-center justify-start gap-5 bg-cover bg-top p-12 pt-14 text-center text-white md:h-auto md:gap-2.5 md:px-6 md:py-[18px]" style="background-image: url(&quot;https://cdn-gop.garenanow.com/gop/mshop/www/live/assets/user-menu-bg-mb-795b7595.svg&quot;);">
                        <div class="relative h-20 w-20">
                           <div class="overflow-hidden rounded-full"><img class="h-full w-full" src="${playerData.img_url}" aria-label="User avatar"></div>
                        </div>
                        <div class="text-xl/none font-bold md:text-base/none">${playerData.nickname}</div>
                     </div>
                     <div class="flex-1 bg-white px-1.5 py-3 md:py-1.5">
                        <ul class="flex flex-col">
                           <li>
                              <a class="flex w-full items-center gap-3 rounded-md px-[18px] py-4 transition-colors hover:bg-[#FAFAFA] md:py-3 text-text-title" href="https://www.garena.co.th/customer" target="_blank">
                                 <div class="shrink-0 text-2xl md:text-xl">
                                    <svg width="1em" height="1em" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                       <path d="M28 31.4287C27.9995 25.9848 32.4125 21.5713 37.8564 21.5713H42.1418C47.6027 21.5713 51.9992 26.0312 51.9989 31.4586C51.9987 35.1829 49.8974 38.6189 46.5502 40.2926L43.2814 41.9271C42.8459 42.1449 42.5708 42.5901 42.5708 43.0771V43.4284C42.5708 45.0853 41.2276 46.4284 39.5708 46.4284C37.9139 46.4284 36.5708 45.0853 36.5708 43.4284V43.0771C36.5708 40.3175 38.1298 37.7948 40.598 36.5606L43.8668 34.9261C45.1654 34.2768 45.9988 32.9281 45.9989 31.4582C45.999 29.3111 44.2553 27.5713 42.1418 27.5713H37.8564C35.7264 27.5713 33.9998 29.2981 34 31.4281C34.0002 33.085 32.6572 34.4282 31.0003 34.4284C29.3434 34.4286 28.0002 33.0856 28 31.4287Z" fill="currentColor"></path>
                                       <path d="M43.5 54C43.5 56.2091 41.7091 58 39.5 58C37.2909 58 35.5 56.2091 35.5 54C35.5 51.7909 37.2909 50 39.5 50C41.7091 50 43.5 51.7909 43.5 54Z" fill="currentColor"></path>
                                       <path fill-rule="evenodd" clip-rule="evenodd" d="M29.4418 74.4261C32.784 75.4499 36.3303 76 40 76C40.5558 76 41.1088 75.9874 41.6587 75.9624C60.3752 75.1136 75.3675 59.9731 75.9805 41.196C75.9935 40.7989 76 40.4002 76 40C76 20.1178 59.8823 4 40 4C20.1178 4 4 20.1178 4 40C4 48.2364 6.76011 55.8431 11.4225 61.9142L11.445 61.9436L11.4683 61.9724C13.4759 64.4571 14.6761 67.6137 14.6761 71.0588C14.6761 71.4774 14.6584 71.8912 14.6238 72.2995L14.4043 74.8909L16.9383 75.4758C18.4259 75.8192 19.9729 76 21.5584 76C24.3475 76 27.0123 75.4406 29.4418 74.4261ZM40 10C23.4315 10 10 23.4315 10 40C10 46.863 12.2911 53.1822 16.16 58.2322C18.7717 61.4773 20.4154 65.5407 20.6476 69.9719C20.9486 69.9905 21.2523 70 21.5584 70C23.8542 70 26.0171 69.4675 27.9381 68.5222L29.058 67.971L30.2384 68.3769C33.2947 69.428 36.5774 70 40 70C40.3852 70 40.7687 69.9928 41.1502 69.9784C56.7142 69.3917 69.2437 56.9483 69.9671 41.4196C69.9889 40.9493 70 40.476 70 40C70 23.4315 56.5685 10 40 10Z" fill="currentColor"></path>
                                    </svg>
                                 </div>
                                 <div class="text-base md:text-sm">Trợ giúp</div>
                              </a>
                           </li>
                           <li>
                              <a class="flex w-full items-center gap-3 rounded-md px-[18px] py-4 transition-colors hover:bg-[#FAFAFA] md:py-3 text-text-title" href="/info/howtotopup">
                                 <div class="shrink-0 text-2xl md:text-xl">
                                    <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                       <g clip-path="url(#clip0_965_24626)">
                                          <g>
                                             <path d="M10 2.25C5.71979 2.25 2.25 5.71979 2.25 10C2.25 14.2802 5.71979 17.75 10 17.75C10.8788 17.75 11.722 17.604 12.5075 17.3356C12.8994 17.2016 13.3258 17.4108 13.4597 17.8028C13.5936 18.1947 13.3845 18.6211 12.9925 18.755C12.0529 19.0761 11.046 19.25 10 19.25C4.89137 19.25 0.75 15.1086 0.75 10C0.75 4.89137 4.89137 0.75 10 0.75C15.1086 0.75 19.25 4.89137 19.25 10C19.25 10.9456 19.1079 11.8593 18.8433 12.7203C18.7217 13.1162 18.3021 13.3386 17.9061 13.2169C17.5102 13.0953 17.2878 12.6757 17.4095 12.2797C17.6307 11.5599 17.75 10.7946 17.75 10C17.75 5.71979 14.2802 2.25 10 2.25Z" fill="currentColor"></path>
                                             <path d="M9.25 5C9.25 4.58579 9.58579 4.25 10 4.25C10.4142 4.25 10.75 4.58579 10.75 5V6H12.25C12.6642 6 13 6.33579 13 6.75C13 7.16421 12.6642 7.5 12.25 7.5H8.625C8.14175 7.5 7.75 7.89175 7.75 8.375C7.75 8.85825 8.14175 9.25 8.625 9.25H11.375C12.6867 9.25 13.75 10.3133 13.75 11.625C13.75 12.9367 12.6867 14 11.375 14H10.75V15C10.75 15.4142 10.4142 15.75 10 15.75C9.58579 15.75 9.25 15.4142 9.25 15V14H7.75C7.33579 14 7 13.6642 7 13.25C7 12.8358 7.33579 12.5 7.75 12.5H11.375C11.8582 12.5 12.25 12.1082 12.25 11.625C12.25 11.1418 11.8582 10.75 11.375 10.75H8.625C7.31332 10.75 6.25 9.68668 6.25 8.375C6.25 7.06332 7.31332 6 8.625 6H9.25V5Z" fill="currentColor"></path>
                                             <path d="M15.1806 13.7619C15.4501 13.4474 15.9236 13.411 16.2381 13.6806C16.5526 13.9501 16.589 14.4236 16.3194 14.7381L15.8807 15.25H18.5C18.9142 15.25 19.25 15.5858 19.25 16C19.25 16.4142 18.9142 16.75 18.5 16.75H14.25C13.9571 16.75 13.691 16.5795 13.5686 16.3134C13.4462 16.0473 13.4899 15.7343 13.6806 15.5119L15.1806 13.7619Z" fill="currentColor"></path>
                                          </g>
                                       </g>
                                       <defs>
                                          <clipPath>
                                             <rect width="20" height="20" fill="currentColor"></rect>
                                          </clipPath>
                                       </defs>
                                    </svg>
                                 </div>
                                 <div class="text-base md:text-sm">Hướng dẫn nạp tiền</div>
                              </a>
                           </li>
                        </ul>
                        <div class="px-[18px] py-2 md:py-1.5">
                           <hr class="w-full border border-line/50">
                        </div>
                        <button id="btnLogout" class="flex w-full items-center gap-3 rounded-md px-[18px] py-4 transition-colors hover:bg-[#FAFAFA] md:py-3 text-primary-red">
                           <div class="shrink-0 text-2xl md:text-xl">
                              <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="rtl:-scale-x-100">
                                 <g>
                                    <g>
                                       <path d="M7 2.25C4.65279 2.25 2.75 4.15279 2.75 6.5V13.5C2.75 15.8472 4.65279 17.75 7 17.75H12.75C13.1642 17.75 13.5 17.4142 13.5 17C13.5 16.5858 13.1642 16.25 12.75 16.25H7C5.48122 16.25 4.25 15.0188 4.25 13.5V6.5C4.25 4.98122 5.48122 3.75 7 3.75H12.75C13.1642 3.75 13.5 3.41421 13.5 3C13.5 2.58579 13.1642 2.25 12.75 2.25H7Z" fill="currentColor"></path>
                                       <path d="M14.5303 6.46967C14.2374 6.17678 13.7626 6.17678 13.4697 6.46967C13.1768 6.76256 13.1768 7.23744 13.4697 7.53033L15.1893 9.25H9.5C9.08579 9.25 8.75 9.58579 8.75 10C8.75 10.4142 9.08579 10.75 9.5 10.75H15.1893L13.4697 12.4697C13.1768 12.7626 13.1768 13.2374 13.4697 13.5303C13.7626 13.8232 14.2374 13.8232 14.5303 13.5303L17.5303 10.5303C17.8232 10.2374 17.8232 9.76256 17.5303 9.46967L14.5303 6.46967Z" fill="currentColor"></path>
                                    </g>
                                 </g>
                              </svg>
                           </div>
                           <div  class="text-base md:text-sm">Đăng xuất</div>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
      </div>
   </div>
   <button type="button" data-headlessui-focus-guard="true" aria-hidden="true" style="position: fixed; top: 1px; left: 1px; width: 1px; height: 0px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; border-width: 0px;"></button>
  </div>
        `);
        // Thêm class open để thực hiện animation
        setTimeout(function () {
          $("#sidebarLogin").addClass("open");
        }, 100); // Thêm một khoảng trễ nhỏ để đảm bảo element đã được thêm vào DOM
      }
    }

    // Sự kiện click trên nút đóng sidebar
    $(document).on("click", "#closeSidebar", function () {
      closeSidebar();
    });

    // Sự kiện click trên overlay
    $(document).on("click", "#overlay", function (e) {
      // Ngăn chặn sự kiện lan truyền lên body khi click vào overlay
      e.stopPropagation();

      // Kiểm tra xem người dùng click vào phần nào trong sidebar
      if ($(e.target).closest("#sidebarLogin").length === 0) {
        closeSidebar();
      }
    });

    $(document).on("click", "#btnLogout", function () {
      $("#headlessui-dialog-\\:r2k\\:")
        .fadeIn(300) // 500ms duration for fade in
        .attr("data-headlessui-state", "open");

      function closeModal() {
        // Use fadeOut to hide the modal
        $("#headlessui-dialog-\\:r2k\\:").fadeOut(300, function () {
          // 500ms duration for fade out
          $(this).attr("data-headlessui-state", "false");
        });
      }

      // When the user clicks anywhere outside of the modal, close it
      $(window).click(function (event) {
        if (
          event.target.className ===
          "absolute inset-0 grid overflow-auto justify-items-center items-center"
        ) {
          closeModal();
        }
      });

      $("#btnConfirmLogout").on("click", function () {
        closeModal();
        localStorage.removeItem("playerData");
        localStorage.removeItem("userLogin");
        location.reload();
      });
    });
  }

  function renderWelcomePopup() {
    if (localStorage.getItem("close_welcome_popup")) {
      return; // Do not render the popup if it was closed
    }

    // Create a new div element to hold the welcome popup content
    const welcomePopup = document.createElement("div");
    welcomePopup.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2" id="welcomePopup" role="dialog" aria-modal="true" data-headlessui-state="open" aria-describedby="headlessui-description-:r5:" aria-labelledby="headlessui-dialog-title-:r4:">
        <div class="relative w-full max-w-xs lg:max-w-[400px]" id="headlessui-dialog-panel-:r3:" data-headlessui-state="open">
          <img class="pointer-events-none" src="https://cdn-gop.garenanow.com/gop/mshop/www/live/assets/welcome-03e7f5dc.png">
          <div class="rounded-b-lg bg-white p-6 dark:bg-slate-800">
            <h2 class="mb-3 text-center text-base/none font-bold lg:mb-2.5" id="headlessui-dialog-title-:r4:" data-headlessui-state="open">THÔNG BÁO </h2>
           <p class="mb-5 text-center text-sm/[22px] text-text-secondary" id="headlessui-description-:r5:" data-headlessui-state="open" style="font-family: 'Arial', sans-serif;">
  Đây là trang nạp thẻ chính thức của Garena. Nạp Sò, nạp Quân Huy, nạp Kim Cương, nạp EP dễ dàng và an toàn cho các game Garena như Free Fire, Liên Quân, ...
</p>

            <button id="closeWelcomePopupButton" class="inline-flex items-center justify-center gap-1.5 rounded-md border py-1 text-center leading-none transition-colors border-primary-red bg-primary-red text-white hover:bg-primary-red-hover hover:border-primary-red-hover px-5 text-sm font-bold h-10 w-full">ĐÓNG</button>
          </div>
        </div>
      </div>
    `;

    // Append the welcome popup to the body of the document
    document.body.appendChild(welcomePopup);

    document
      .getElementById("closeWelcomePopupButton")
      .addEventListener("click", function () {
        localStorage.setItem("close_welcome_popup", "true");
        document.getElementById("welcomePopup").remove();
        renderBillboard(); // Call renderBillboard after closing the welcome popup
      });
  }

  function renderBillboard() {
    // Check if the billboard was previously closed
    if (localStorage.getItem("close_billboard")) {
      return; // Do not render the billboard if it was closed
    }

    // Create a new div element to hold the billboard content
    const billboard = document.createElement("div");
    billboard.innerHTML = `
      <div class="fixed inset-0 z-10 flex overflow-auto bg-black/60" id="billboard" role="dialog" aria-modal="true">
        <div class="m-auto w-[100vmin] max-w-lg p-3">
          <div class="relative w-full pt-[100%]">
            <a class="absolute inset-0 block">
              <img class="pointer-events-none h-full w-full object-cover" src="${window.__ANHTHONGBAO__}">
            </a>
            <button class="absolute end-2 top-2 rounded-full border border-white bg-black/80 p-1 text-xl text-white" id="closeBillboardButton">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M7.83644 6.56341C7.48497 6.21194 6.91512 6.21194 6.56365 6.56341C6.21218 6.91488 6.21218 7.48473 6.56365 7.8362L10.7273 11.9998L6.56366 16.1634C6.21218 16.5149 6.21218 17.0847 6.56366 17.4362C6.91513 17.7877 7.48498 17.7877 7.83645 17.4362L12 13.2726L16.1637 17.4362C16.5151 17.7877 17.085 17.7877 17.4364 17.4362C17.7879 17.0847 17.7879 16.5149 17.4364 16.1634L13.2728 11.9998L17.4364 7.8362C17.7879 7.48473 17.7879 6.91488 17.4364 6.56341C17.085 6.21194 16.5151 6.21194 16.1637 6.56341L12 10.727L7.83644 6.56341Z" fill="currentColor"></path></g></svg>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(billboard);

    document
      .getElementById("closeBillboardButton")
      .addEventListener("click", function () {
        localStorage.setItem("close_billboard", "true");
        document.getElementById("billboard").remove();
      });
  }

  if (
    localStorage.getItem("close_welcome_popup") &&
    !localStorage.getItem("close_billboard")
  ) {
    renderBillboard();
  }

  function handleRenderDenom(lastClickedElement) {
    denomContainer.innerHTML = "";

    const gameId = lastClickedElement.getAttribute("data-game-id");

    const game = gameData.find((game) => game.id === gameId);

    if (game && game.denomList) {
      game.denomList.forEach((denomination, index) => {
        const denomItem = document.createElement("div");

        if (index === 0) {
          denomItem.classList.add("disabled");
          denomItem.setAttribute("aria-disabled", "true");
          denomItem.style.pointerEvents = "none";
          denomItem.style.opacity = "0.5";
        }

        denomItem.className = "denomItem relative";

        denomItem.addEventListener("click", function () {
          if (previousClickedElementDenom === this) {
            this.removeAttribute("data-headlessui-state");

            // Remove the denom parameter from the URL
            const url = new URL(window.location);
            url.searchParams.delete("denom");
            window.history.pushState({}, "", url);

            const stickyFooter = document.querySelector(".sticky-footer");
            if (stickyFooter) {
              stickyFooter.remove();
            }

            previousClickedElementDenom = null;
          } else {
            if (previousClickedElementDenom) {
              previousClickedElementDenom.removeAttribute(
                "data-headlessui-state",
              );
            }
            this.setAttribute("data-headlessui-state", "checked active");
            previousClickedElementDenom = this;

            const denomPrice = Number(denomination.price.replace("đ", ""));

            const url = new URL(window.location);
            url.searchParams.set("denom", denomPrice);
            window.history.pushState({}, "", url);

            sortUrlParams(url);

            renderStickyFooterDenom(
              document,
              this,
              game,
              new URLSearchParams(url.search).get("channel"),
            );
          }

          // updateDenomItemsStatus(this);
        });

        const denomContent = document.createElement("div");
        denomContent.className =
          "peer relative flex min-h-[50px] cursor-pointer flex-col items-center justify-center rounded-md outline outline-1 -outline-offset-1 outline-box-border ui-checked:bg-selected-bg ui-checked:outline-2 ui-checked:-outline-offset-2 ui-checked:outline-primary-red ui-disabled:bg-[#F4F4F4] ui-disabled:outline-none sm:min-h-[64px] md:min-h-[72px]";
        denomContent.setAttribute("role", "radio");
        denomContent.setAttribute("aria-checked", "false");
        denomContent.setAttribute("tabindex", "0");
        // denomContent.dataset.headlessuiState = "";

        const denomInner = document.createElement("div");
        denomInner.className = "flex items-center";

        const denomImage = document.createElement("img");
        denomImage.className =
          "denomIcon hidden h-0 w-0 object-contain md:h-4 md:w-4 opacity-0";
        denomImage.src = game.denomIcon;
        denomImage.alt = game.name;

        const denomValue = document.createElement("span");
        denomValue.className =
          "denomPrice text-sm/none font-medium md:text-lg/none";
        denomValue.textContent = denomination.price;

        denomInner.appendChild(denomImage);
        denomInner.appendChild(denomValue);
        denomContent.appendChild(denomInner);
        denomItem.appendChild(denomContent);

        const denomOverlay = document.createElement("div");
        denomOverlay.className =
          "absolute inset-0 hidden cursor-pointer peer-aria-checked:block";
        denomOverlay.id = `headlessui-radiogroup-option-${index + 1}`;
        denomOverlay.setAttribute("role", "radio");
        denomOverlay.setAttribute("aria-checked", "false");
        denomOverlay.dataset.headlessuiState = "";

        denomItem.appendChild(denomOverlay);

        denomContainer.appendChild(denomItem);
      });
    }
  }

  function renderDenomList(lastClickedElement) {
    const garenaCardList = document.getElementById("garenaCardList");
    const gameId = lastClickedElement.getAttribute("data-game-id");
    const game = gameData.find((game) => game.id === gameId);

    if (garenaCardList) {
      const filteredList = game.denomList.filter(
        (item) => item.price !== "NaN",
      );

      garenaCardList.innerHTML = "";

      filteredList.forEach((item) => {
        const element = document.createElement("div");
        element.className = "flex justify-between gap-4 px-5 py-4 items-center";

        const leftDiv = document.createElement("div");
        leftDiv.className = "flex gap-3 items-center";

        const img = document.createElement("img");
        img.className = "h-[30px] w-[30px] object-contain";
        img.src = game.denomIcon;

        const textDiv = document.createElement("div");
        textDiv.className = "flex flex-col gap-1.5";

        const p = document.createElement("p");
        p.className = "text-sm/none font-medium md:text-base/none";
        p.textContent = `${formatCurrency(item.denom).replace("đ", "")} ${
          game.denomName
        }`;

        const bonusDiv = document.createElement("div");
        bonusDiv.className =
          "flex flex-col gap-1.5 text-xs/none font-medium text-bonus empty:hidden md:text-sm/none";
        bonusDiv.appendChild(document.createTextNode(` + ${item.bonus}`));

        textDiv.appendChild(p);
        textDiv.appendChild(bonusDiv);

        leftDiv.appendChild(img);
        leftDiv.appendChild(textDiv);

        const rightDiv = document.createElement("div");
        rightDiv.className = "shrink-0 py-2 text-sm/none font-medium";

        const span = document.createElement("span");
        span.className =
          "items-center [text-decoration:inherit] justify-end flex";
        span.textContent = `${item.price}`;

        rightDiv.appendChild(span);

        element.appendChild(leftDiv);
        element.appendChild(rightDiv);

        garenaCardList.appendChild(element);
      });
    }
  }

  function displayGames(fromIndex, limit, type) {
    if (type === "reset") {
      gameContainer.innerHTML = "";
    }

    gameData.slice(fromIndex, limit).forEach((game) => {
      const gameElement = document.createElement("div");
      gameElement.className = "cursor-pointer outline-none";
      gameElement.setAttribute("role", "radio");
      gameElement.setAttribute("aria-checked", "false");
      gameElement.setAttribute("tabindex", "-1");
      gameElement.setAttribute("data-game-id", game.id);
      gameElement.innerHTML = `
              <div class="mx-auto max-w-[70px] md:max-w-[105px]">
                <div class="mb-1 px-[3px] md:mb-2 md:px-2">
                  <div class="relative">
                    <div class="relative overflow-hidden rounded-[25%] border-[3px] border-transparent transition-colors ui-checked:border-primary-red md:border-4">
                      <div class="relative pt-[100%]">
                        <img class="pointer-events-none absolute inset-0 h-full w-full bg-white object-cover" src="${game.icon}" />
                      </div>
                    </div>
                    <div class="absolute inset-0 origin-top-left scale-50 rounded-ss-[50%] p-[18.75%] opacity-0 transition-opacity ui-checked:opacity-100 ltr:bg-[linear-gradient(-45deg,transparent_50%,#D81A0D_50%)] rtl:origin-top-right rtl:bg-[linear-gradient(45deg,transparent_50%,#D81A0D_50%)]">
                      <svg width="1em" height="1em" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-full w-full origin-top-left scale-[45%] text-white rtl:origin-top-right md:scale-[45.714%]">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.683616 3.34767C0.966833 3.06852 1.41058 3.02521 1.74384 3.24419L4.84892 5.28428L11.2468 0.49236C11.5616 0.256548 12.0047 0.286191 12.2843 0.561764C12.5639 0.837337 12.594 1.27411 12.3548 1.58439L6.77224 8.82375C6.70207 8.92749 6.62168 9.02414 6.53224 9.1123C5.82037 9.81394 4.68878 9.84975 3.93408 9.21971L3.77319 9.07952C3.75044 9.05904 3.72815 9.03804 3.70636 9.01656C3.5095 8.82253 3.36114 8.59882 3.26127 8.36003L0.578633 4.39267C0.35646 4.06419 0.4004 3.62682 0.683616 3.34767Z" fill="currentColor"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div data-game-id="${game.id}" class="line-clamp-2 text-center text-xs ui-checked:font-bold ui-checked:text-primary-red md:text-sm/[22px]">
                  ${game.name}
                </div>
              </div>
            `;
      gameContainer.appendChild(gameElement);
      childrenGameContainer = gameContainer.children;
    });

    Array.from(childrenGameContainer).forEach((child) => {
      child.addEventListener("click", function () {
        const gameId = this.getAttribute("data-game-id");
        const game = gameData.find((g) => g.id === gameId);
        const denomIcons = document.querySelectorAll(".denomIcon");
        const logoutButton = document.querySelector(".logout-button");

        denomIcons.forEach((icon) => {
          icon.src = game.denomIcon;
        });

        if (lastClickedElement && lastClickedElement !== this) {
          lastClickedElement.removeAttribute("data-headlessui-state");

          $("#userAvatar")
            .html(`<svg width="1em" height="1em" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-full w-full" aria-label="Default avatar">
                    <circle cx="40" cy="40" r="40" fill="#C8C8C8"></circle>
                    <circle cx="40" cy="25.6694" r="14" fill="white"></circle>
                    <path d="M18.6624 60.6252C16.2799 58.0468 17.02 54.0297 20.0672 52.2863C25.9526 48.9192 32.7514 46.9976 39.9935 46.9976C47.2356 46.9976 54.0345 48.9192 59.9198 52.2863C62.967 54.0297 63.7072 58.0468 61.3246 60.6252C55.9949 66.3929 48.41 69.9976 39.9935 69.9976C31.5771 69.9976 23.9921 66.3929 18.6624 60.6252Z" fill="white"></path>
                  </svg>`);

          if (logoutButton) logoutButton.remove();

          if (localStorage.getItem("playerData")) {
            const loginSection = $("#loginSection");
            loginSection.html(textLoginContent);
            localStorage.removeItem("playerData");
          }

          if (localStorage.getItem("userLogin")) {
            const loginSection = $("#loginSection");
            loginSection.html(textLoginContent);
            localStorage.removeItem("userLogin");
          }
        }

        this.setAttribute("data-headlessui-state", "checked");

        lastClickedElement = this;

        if (game) {
          localStorage.setItem("app", game.id);
          const url = new URL(window.location);
          url.searchParams.set("app", game.id);
          window.history.pushState({}, "", url);

          sortUrlParams(url);
        }

        handleRenderDenom(this);
        renderDenomList(this);
      });
    });

    updateEventListeners();
  }

  function renderPlayerInfoIntoLoginSection(data, playerId) {
    var playerContainer = $("<div>").addClass("flex items-start gap-2");

    const dataConverted = typeof data === "string" ? JSON.parse(data) : data;

    var playerImage = $("<img>")
      .attr("src", dataConverted.img_url)
      .attr("alt", dataConverted.nickname)
      .addClass("w-10 h-10 rounded-full border border-gray-300");

    var rightContainer = $("<div>").addClass("flex flex-col");

    var playerName = $("<span>")
      .text(dataConverted.nickname)
      .addClass("player-name font-bold");

    var playerIdElement = $("<span>")
      .text("ID người chơi: " + playerId)
      .addClass("player-id text-xs text-text-secondary");

    rightContainer.append(playerName).append(playerIdElement);

    playerContainer.append(playerImage).append(rightContainer);

    $("#loginSection").empty().append(playerContainer);
  }

  function renderPlayerNameIntoLoginSectionGarena(userLogin) {
    var playerContainer = $("<div>").addClass("flex items-start gap-2");
    const app = localStorage.getItem("app");
    const game = gameData.find((g) => g.id === app);

    var playerImage = $("<img>")
      .attr("src", game.icon)
      .attr("alt", game.name)
      .addClass("w-10 h-10 rounded-full border border-gray-300");

    var rightContainer = $("<div>").addClass("flex flex-col");

    // var playerName = $("<span>")
    //   .text(userLogin)
    //   .addClass("player-name font-bold");

    var playerIdElement = $("<span>")
      .text("Username: " + userLogin)
      .addClass("player-id text-xs text-text-secondary font-bold");

    rightContainer.append(playerIdElement);

    playerContainer.append(playerImage).append(rightContainer);

    $("#loginSection").empty().append(playerContainer);
  }

  function renderButtonLogout() {
    const loginSection = document.querySelector("#textLoginSection");
    const logoutButton = document.createElement("button");
    logoutButton.setAttribute("type", "button");
    logoutButton.className =
      "logout-button ms-auto flex items-center text-sm/none text-primary-red transition-opacity hover:opacity-70 group-[.loading]:pointer-events-none group-[.loading]:opacity-50";
    logoutButton.innerHTML = `<svg width="1em" height="1em" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="me-1"><path fill-rule="evenodd" clip-rule="evenodd" d="M53.048 11.8069C51.8367 10.6764 49.9383 10.7418 48.8078 11.953C47.6773 13.1643 47.7428 15.0626 48.954 16.1932L58.3898 25H14.0007C12.3439 25 11.0007 26.3432 11.0007 28C11.0007 29.6569 12.3439 31 14.0007 31H66.0007C67.233 31 68.3399 30.2465 68.7917 29.1001C69.2436 27.9538 68.9485 26.6476 68.0477 25.8069L53.048 11.8069ZM26.9539 68.1932C28.1652 69.3237 30.0636 69.2582 31.1941 68.0469C32.3245 66.8356 32.259 64.9373 31.0477 63.8068L21.6114 55H66.0001C67.657 55 69.0001 53.6569 69.0001 52C69.0001 50.3432 67.657 49 66.0001 49H14.0001C12.7679 49 11.6609 49.7535 11.2091 50.8999C10.7572 52.0464 11.0524 53.3525 11.9532 54.1932L26.9539 68.1932Z" fill="currentColor"></path></svg>Đăng xuất`;

    // When the logout button is clicked
    $(logoutButton).click(function () {
      // Use fadeIn to show the modal
      $("#headlessui-dialog-\\:r2k\\:")
        .fadeIn(300) // 500ms duration for fade in
        .attr("data-headlessui-state", "open");
    });

    // Function to close modal
    function closeModal() {
      // Use fadeOut to hide the modal
      $("#headlessui-dialog-\\:r2k\\:").fadeOut(300, function () {
        // 500ms duration for fade out
        $(this).attr("data-headlessui-state", "false");
      });
    }

    $("#btnConfirmCancelLogout").click(closeModal);

    // When the user clicks anywhere outside of the modal, close it
    $(window).click(function (event) {
      if (event.target.id === "headlessui-dialog-panel-:r2l:") {
        closeModal();
      }
    });

    $("#btnConfirmLogout").click(function () {
      closeModal();
      localStorage.removeItem("playerData");
      localStorage.removeItem("userLogin");
      window.location.reload();
      // playerData = null;
    });

    loginSection.appendChild(logoutButton);
  }

  function fetchDataPlayer(playerId) {
    // Lấy game hiện tại được chọn
    const currentApp = localStorage.getItem("app") || "nap_so";
    const apiUrl = currentApp === "delta_force" ? "/api/deltaforce.php" : "/api/call.php";
    
    $.ajax({
      type: "POST",
      url: apiUrl,
      data: { login_true: true, idfaifai: playerId },
      success: function (response) {
        //var data = JSON.parse(response);
        var data = (typeof response === "string") ? JSON.parse(response) : response;

        if (data.error && data.error === "invalid_id") {
          const formElement = $("form");
          const inputElement = $(":input[id='inputPlayerId']");
          const errorMessageId = "error-message";
          let existingErrorMessage = $("#" + errorMessageId);

          inputElement.addClass("form-input-invalid");

          if (!existingErrorMessage.length) {
            existingErrorMessage = $("<div></div>", {
              id: errorMessageId,
              class:
                "mt-2 text-xs/none text-primary-red md:text-sm/none form-input-invalid",
              text: "ID người chơi không hợp lệ",
            });
            formElement.append(existingErrorMessage);
          }

          $("#login-button").prop("disabled", false);
          $("#login-button").text("Đăng nhập");
          return;
        }

        if (data.nickname) {
          localStorage.setItem(
            "playerData",
            JSON.stringify({
              ...data,
              playerId,
            }),
          );

          $("#userAvatar").html(`
            <img src="${data.img_url}" alt="User avatar" class="h-full w-full rounded-full">
            `);

          renderPlayerInfoIntoLoginSection(data, playerId);

          renderButtonLogout();
        }
      },
    });
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const formElement = document.querySelector("form");
    const inputElement = document.getElementById("inputPlayerId");
    const errorMessageId = "error-message";
    let playerId = inputElement.value;
    let existingErrorMessage = document.getElementById(errorMessageId);

    inputElement.addEventListener("input", function () {
      const newValue = this.value;
      playerId = newValue;
    });

    if (playerId === "") {
      inputElement.className += " form-input-invalid";

      if (existingErrorMessage) {
        existingErrorMessage.remove();
      }

      existingErrorMessage = document.createElement("div");
      existingErrorMessage.id = errorMessageId;
      existingErrorMessage.className =
        "mt-2 text-xs/none text-primary-red md:text-sm/none";
      existingErrorMessage.textContent = "Vui lòng nhập ID người chơi";

      formElement.appendChild(existingErrorMessage);
    } else {
      // Kiểm tra độ dài ID dựa trên game
      const currentApp = localStorage.getItem("app") || "nap_so";
      let isValidLength = false;
      let errorMessage = "ID người chơi không hợp lệ";
      
      if (currentApp === "delta_force") {
        // Delta Force: ID từ 15-25 ký tự
        isValidLength = playerId.length >= 15 && playerId.length <= 25;
        errorMessage = "ID người chơi không hợp lệ";
      } else {
        // Các game khác: ID từ 7-12 ký tự
        isValidLength = playerId.length >= 7 && playerId.length <= 12;
        errorMessage = "ID người chơi không hợp lệ";
      }
      
      if (!isValidLength) {
        inputElement.className += " form-input-invalid";

        if (existingErrorMessage) {
          existingErrorMessage.remove();
        }

        existingErrorMessage = document.createElement("div");
        existingErrorMessage.id = errorMessageId;
        existingErrorMessage.className =
          "mt-2 text-xs/none text-primary-red md:text-sm/none";
        existingErrorMessage.textContent = errorMessage;

        formElement.appendChild(existingErrorMessage);
      } else {
        if (existingErrorMessage) {
          existingErrorMessage.remove();
        }

        inputElement.classList.remove("form-input-invalid");

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("id", playerId);
      window.history.pushState({}, "", newUrl);

      const idParam = newUrl.searchParams.get("id");

      if (idParam) {
        $("#login-button").prop("disabled", true);
        $("#login-button").text("Đang xử lý...");
        fetchDataPlayer(idParam);
      }
      }
    }
  }

  function updateEventListeners() {
    $(childrenGameContainer).each(function () {
      $(this).on("click", function () {
        if (lastClickedElement && lastClickedElement !== this) {
          $(lastClickedElement).removeAttr("data-headlessui-state");
        }
        $(this).attr("data-headlessui-state", "checked");
        lastClickedElement = this;

        const gameId = $(this).attr("data-game-id");
        const game = gameData.find((game) => game.id === gameId);

        if (game) {
          $(gameSelectionName).text(game.name);
          $(gameSelectionImage).attr("src", game.icon);
          $(gameSelectionContainer).css(
            "background-image",
            `url(${game.background})`,
          );

          const loginSection = $("#loginSection");
          const playerData = localStorage.getItem("playerData");
          const userLogin = localStorage.getItem("userLogin");

          if (userLogin) {
            renderPlayerNameIntoLoginSectionGarena(userLogin);
          } else {
            if (game.isEnterId) {
              loginSection.html(formEnterIDContent);
              // event delegation
              loginSection
                .off("click", "#login-button")
                .on("click", "#login-button", handleFormSubmit);
            } else {
              loginSection.html(textLoginContent);
            }
          }

          if (playerData) {
            const parsedData = JSON.parse(playerData);
            renderPlayerInfoIntoLoginSection(parsedData, parsedData.playerId);
          } else {
            if (game.isEnterId) {
              loginSection.html(formEnterIDContent);
              // event delegation
              loginSection
                .off("click", "#login-button")
                .on("click", "#login-button", handleFormSubmit);
            } else {
              loginSection.html(textLoginContent);
            }
          }
        }
      });
    });

    if (gameData && gameData.length > 0) {
      const firstGame = gameData[0];
      if (firstGame.background) {
        $(gameSelectionImage).attr("src", firstGame.icon);
        $(gameSelectionContainer).css(
          "background-image",
          `url(${firstGame.background})`,
        );
        $("#loginSection").html(textLoginContent);
      }
    }
  }

  buttonViewMore.addEventListener("click", () => {
    const arrowDown = `<svg width="1em" height="1em" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="ms-1" role="none"><g id="arrow_down" role="none"><path id="Vector 564 (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M17.1716 28.1716C18.7337 26.6095 21.2663 26.6095 22.8284 28.1716L40 45.3431L57.1716 28.1716C58.7337 26.6095 61.2663 26.6095 62.8284 28.1716C64.3905 29.7337 64.3905 32.2663 62.8284 33.8284L42.8284 53.8284C41.2663 55.3905 38.7337 55.3905 37.1716 53.8284L17.1716 33.8284C15.6095 32.2663 15.6095 29.7337 17.1716 28.1716Z" fill="currentColor" role="none"></path></g></svg>`;
    const arrowUp = `<svg width="1em" height="1em" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="ms-1" role="none"><g id="arrow_up" role="none"><path id="Vector 564 (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M62.8284 51.8284C61.2663 53.3905 58.7337 53.3905 57.1716 51.8284L40 34.6569L22.8284 51.8284C21.2663 53.3905 18.7337 53.3905 17.1716 51.8284C15.6095 50.2663 15.6095 47.7337 17.1716 46.1716L37.1716 26.1716C38.7337 24.6095 41.2663 24.6095 42.8284 26.1716L62.8284 46.1716C64.3905 47.7337 64.3905 50.2663 62.8284 51.8284Z" fill="currentColor" role="none"></path></g></svg>`;

    if (isFullListDisplayed) {
      displayGames(0, startIndex + 2, "reset");
      buttonViewMore.innerHTML = `Xem thêm ${arrowDown}`;
    } else {
      displayGames(startIndex + 2, gameData.length, "viewMore");
      buttonViewMore.innerHTML = `Thu gọn ${arrowUp}`;
    }
    isFullListDisplayed = !isFullListDisplayed;

    Array.from(childrenGameContainer).forEach((child) => {
      child.addEventListener("click", function () {
        if (lastClickedElement && lastClickedElement !== this) {
          lastClickedElement.removeAttribute("data-headlessui-state");
        }

        this.setAttribute("data-headlessui-state", "checked");

        lastClickedElement = this;

        handleRenderDenom(this);
        renderDenomList(this);
      });
    });
  });

  if (gameData.length > 0 && childrenGameContainer.length > 0) {
    const firstGameId = gameData[0].id;
    const firstElement = Array.from(childrenGameContainer).find(
      (child) => child.getAttribute("data-game-id") === firstGameId,
    );

    if (firstElement && !appParam) {
      firstElement.setAttribute("data-headlessui-state", "checked");
      firstElement.focus();
      lastClickedElement = firstElement;

      handleRenderDenom(firstElement);
      renderDenomList(firstElement);
      localStorage.setItem("app", firstGameId);
    }
  }
});
