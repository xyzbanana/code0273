import { formatCurrency } from "../libs/index.js";

const defaultDenomList = [
  { denom: 112, bonus: 112, price: 20000 },
  { denom: 224, bonus: 223, price: 50000 },
  { denom: 512, bonus: 336, price: 100000 },
  { denom: 1024, bonus: 448, price: 200000 },
  { denom: 2048, bonus: 550, price: 500000 },
].map((item) => ({
  ...item,
  price: `${formatCurrency(item.price)}`,
}));

const freeFireDenomList = [
{ denom: 1130, price: "20.000đ", bonus: "Kim Cương × 11.130" },
  { denom: 2240, price: "50.000đ", bonus: "Kim Cương × 12.830" },
{ denom: 5560, price: "100.000đ", bonus: "Kim Cương × 15.660" },
{ denom: 11320, price: "200.000đ", bonus: "Kim Cương × 22.900" },
{ denom: 15700, price: "500.000đ", bonus: "Kim Cương × 27.830" }
];

const rovMobileMobaDenomList = [
{ denom: 599, price: "20.000đ", bonus: "Quân huy × 5400" },
{ denom: 1399, price: "50.000đ", bonus: "Quân huy × 2080" },
{ denom: 2750, price: "100.000đ", bonus: "Quân huy × 4129" },
{ denom: 5859, price: "200.000đ", bonus: "Quân huy × 6489" },
  { denom: 10359, price: "500.000đ", bonus: "Quân huy × 15982" }
];
const soDenomList = [
  { denom: 3, price: "20.000đ", bonus: "Sò × 113" },
  { denom: 224, price: "50.000đ", bonus: "Sò × 283" },
  { denom: 512, price: "100.000đ", bonus: "Sò × 566" },
  { denom: 1024, price: "200.000đ", bonus: "Sò × 1.132" },
  { denom: 2048, price: "500.000đ", bonus: "Sò × 2.830" },
];
const fifaDenomList = [
{ denom: 200, price: "20.000đ", bonus: "FC × 1130" },
{ denom: 400, price: "50.000đ", bonus: "FC × 2830" },
{ denom: 800, price: "100.000đ", bonus: "FC × 5760" },
{ denom: 1600, price: "200.000đ", bonus: "FC × 11.320" },
  { denom: 3200, price: "500.000đ", bonus: "FC × 28.300" }
];
const fifamDenomList = [
{ denom: 300, price: "20.000đ", bonus: "MC × 1130" },
{ denom: 500, price: "50.000đ", bonus: "MC × 2830" },
{ denom: 700, price: "100.000đ", bonus: "MC × 5660" },
{ denom: 1400, price: "200.000đ", bonus: "MC × 11.320" },
  { denom: 3200, price: "500.000đ", bonus: "MC × 28.300" }
];
const ctthDenomList = [
  { denom: 35, price: "20.000đ", bonus: "Vàng × 113" },
{ denom: 224, price: "50.000đ", bonus: "Vàng × 283" },
{ denom: 512, price: "100.000đ", bonus: "Vàng × 566" },
{ denom: 1024, price: "200.000đ", bonus: "Vàng × 1.132" },
{ denom: 2048, price: "500.000đ", bonus: "Vàng × 2.830" }
];

const deltaForceDenomList = [
  { denom: 113, price: "20.000đ", bonus: "Delta Coin × 113" },
  { denom: 224, price: "50.000đ", bonus: "Delta Coin × 283" },
  { denom: 512, price: "100.000đ", bonus: "Delta Coin × 566" },
  { denom: 1024, price: "200.000đ", bonus: "Delta Coin × 1.132" },
  { denom: 2048, price: "500.000đ", bonus: "Delta Coin × 2.830" },
];
const gameData = [
  {
    id: "nap_so",
    name: "Nạp Sò",
    background:
      "https://cdn-gop.garenanow.com/gop/mshop/www/live/assets/shell-f5269abe.jpg",
    icon: "https://cdn-gop.garenanow.com/gop/app/0000/010/091/icon.png",
    denomIcon: "https://cdn-gop.garenanow.com/gop/app/0000/010/091/icon.png",
    isEnterId: false,
    denomName: "Sò",
  },
  {
    id: "free_fire",
    name: "Free Fire",
    background:
      "https://cdn-gop.garenanow.com/gop/mshop/www/live/assets/FF-2cb78e7c.jpg",
    icon: "https://cdn-gop.garenanow.com/gop/app/0000/100/067/icon.png",
    denomIcon: "https://cdn-gop.garenanow.com/gop/app/0000/100/067/point.png",
    isEnterId: true,

    denomName: "Kim cương",
  },
  {
    id: "rov_mobile_moba",
    name: "Liên Quân Mobile",
    background:
      "https://cdn-gop.garenanow.com/gop/mshop/www/live/assets/AOV-313c6659.jpg",
    icon: "https://cdn-gop.garenanow.com/gop/app/0000/100/055/icon.png",
    denomIcon: "https://cdn-gop.garenanow.com/gop/app/0000/100/055/point.png",
    isEnterId: false,
    denomName: "Quân huy",
  },
  {
    id: "fifa_online_mobile",
    name: "FIFA Online M",
    background:
      "https://cdn-gop.garenanow.com/gop/mshop/www/live/assets/FO4-53e82762.jpg",
    icon: "https://cdn-gop.garenanow.com/gop/app/0000/100/071/icon.png",
    denomIcon: "https://cdn-gop.garenanow.com/gop/app/0000/100/071/point.png",
    isEnterId: false,

    denomName: "MC",
  },
  {
    id: "fifa_online",
    name: "FIFA Online",
    background:
      "https://cdn-gop.garenanow.com/gop/mshop/www/live/assets/FO4-53e82762.jpg",
    icon: "https://cdn-gop.garenanow.com/gop/app/0000/032/836/icon.png",
    denomIcon: "https://cdn-gop.garenanow.com/gop/app/0000/032/836/point.png",
    isEnterId: false,

    denomName: "FC",
  },
  {
    id: "delta_force",
    name: "Delta Force",
    background: "https://cdn-gop.garenanow.com/gop/mshop/www/live/assets/DF-4dc01e48.jpg",
    icon: "https://cdn-gop.garenanow.com/gop/app/0000/100/151/icon.png",
    denomIcon: "https://cdn-gop.garenanow.com/gop/app/0000/100/151/icon.png",
    isEnterId: true,
    denomName: "Delta Coin",
  },
  {
    id: "tranh_hung",
    name: "Cái Thế Tranh Hùng",
    background: "../images/tranh_hung_background.jpg",
    icon: "../images/tranh_hung_logo.jpg",
    denomIcon: "../images/tranh_hung_denom_icon.jpg",
    isEnterId: false,
    denomName: "Vàng",
  },
].map((game) => ({
  ...game,
  denomList: getDenomList(game.id),
}));

const formEnterIDContent = `
<form id="formEnterID" class="mb-4">
  <label
    class="mb-2 flex items-center gap-1 text-[15px]/4 font-medium text-text-title"
    for=":r1f5:"
    >ID đăng nhập<button
      type="button"
      class="rounded-full text-sm outline-current transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2"
    >
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_489_1601)">
          <path
            d="M4.8999 5.39848C4.89981 4.44579 5.67209 3.67344 6.62478 3.67344H7.37471C8.33038 3.67344 9.09977 4.45392 9.09971 5.40371C9.09967 6.05546 8.73195 6.65677 8.14619 6.94967L7.57416 7.23571C7.49793 7.27382 7.44978 7.35173 7.44978 7.43695V7.49844C7.44978 7.78839 7.21473 8.02344 6.92478 8.02344C6.63483 8.02344 6.39978 7.78839 6.39978 7.49844V7.43695C6.39978 6.95403 6.67262 6.51255 7.10456 6.29657L7.6766 6.01053C7.90385 5.8969 8.0497 5.66087 8.04971 5.40365C8.04973 5.0279 7.74459 4.72344 7.37471 4.72344H6.62478C6.25203 4.72344 5.94987 5.02563 5.9499 5.39838C5.94993 5.68833 5.7149 5.9234 5.42495 5.92343C5.135 5.92346 4.89993 5.68843 4.8999 5.39848Z"
            fill="currentColor"
          ></path>
          <path
            d="M6.9999 10.1484C7.3865 10.1484 7.6999 9.83504 7.6999 9.44844C7.6999 9.06184 7.3865 8.74844 6.9999 8.74844C6.6133 8.74844 6.2999 9.06184 6.2999 9.44844C6.2999 9.83504 6.6133 10.1484 6.9999 10.1484Z"
            fill="currentColor"
          ></path>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0.524902 6.99844C0.524902 3.42239 3.42386 0.523438 6.9999 0.523438C10.5759 0.523438 13.4749 3.42239 13.4749 6.99844C13.4749 10.5745 10.5759 13.4734 6.9999 13.4734C3.42386 13.4734 0.524902 10.5745 0.524902 6.99844ZM6.9999 1.57344C4.00376 1.57344 1.5749 4.00229 1.5749 6.99844C1.5749 9.99458 4.00376 12.4234 6.9999 12.4234C9.99605 12.4234 12.4249 9.99458 12.4249 6.99844C12.4249 4.00229 9.99605 1.57344 6.9999 1.57344Z"
            fill="currentColor"
          ></path>
        </g>
        <defs>
          <clipPath>
            <rect width="14" height="14" fill="currentColor"></rect>
          </clipPath>
        </defs>
      </svg></button
  ></label>
  <div class="flex">
    <div class="relative grow">
      <input
        id="inputPlayerId"
        class="form-input w-full px-4 ltr:rounded-r-none ltr:border-r-0 rtl:rounded-l-none rtl:border-l-0"
        type="text"
        autocomplete="off"
        placeholder="ID người chơi"
        value=""
      />
      <div
        style="
          position: fixed;
          top: 1px;
          left: 1px;
          width: 1px;
          height: 0px;
          padding: 0px;
          margin: -1px;
          overflow: hidden;
          clip: rect(0px, 0px, 0px, 0px);
          white-space: nowrap;
          border-width: 0px;
          display: none;
        "
      ></div>
    </div>
    <button
      id="login-button"
      class="shrink-0 rounded-md bg-primary-red px-5 py-[15px] text-sm/none font-bold text-white transition-colors hover:bg-primary-red-hover focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 rounded-s-none"
      type="button"
    >
      Đăng nhập
    </button>
  </div>
</form>
<!--<div
  class="flex items-center gap-4 text-xs/normal text-text-secondary md:text-sm/[22px]"
>
  <span class="me-auto">Hoặc đăng nhập bằng các phương thức sau</span
  ><a
    class="shrink-0 rounded-full p-1.5 transition-opacity hover:opacity-70 bg-[#006AFC]"
    href="https://authgop.garena.com/universal/oauth?client_id=10017&amp;redirect_uri=https%3A%2F%2Ftermgame.com%2F%3Fapp%3D100130&amp;response_type=token&amp;platform=3&amp;locale=th-TH&amp;theme=light"
    ><img
      class="h-5 w-5 brightness-0 invert"
      src="https://cdn-gop.garenanow.com/gop/mshop/www/live/assets/ic-fb-485c92b0.svg"
      alt="Facebook logo" /></a
  ><a
    class="shrink-0 rounded-full p-1.5 transition-opacity hover:opacity-70 outline outline-1 -outline-offset-1 outline-line bg-white"
    href="https://authgop.garena.com/universal/oauth?client_id=10017&amp;redirect_uri=https%3A%2F%2Ftermgame.com%2F%3Fapp%3D100130&amp;response_type=token&amp;platform=8&amp;locale=th-TH&amp;theme=light"
    ><img
      class="h-5 w-5"
      src="https://cdn-gop.garenanow.com/gop/mshop/www/live/assets/ic-google-d2ceaa95.svg"
      alt="Google logo"
  /></a>
</div>-->`;

const textLoginContent = `
  <div class="flex items-center gap-4 text-xs/normal text-text-secondary md:text-sm/[22px]">
    <span class="me-auto">Đăng nhập bằng tài khoản Garena</span>
    <a id="login-button-garena" href="../login.php" class="shrink-0 rounded-full p-1.5 transition-opacity hover:opacity-70 outline outline-1 -outline-offset-1 outline-line bg-white">
      <img class="h-5 w-5" src="https://cdn-gop.garenanow.com/gop/mshop/www/live/assets/ic-garena-2fce3e76.svg" alt="Garena logo" />
    </a>
  </div>
`;

function getDenomList(gameId) {
  switch (gameId) {
    case "garena_undawn":
    case "garena_moonlight":
    case "fifa_online":
        return fifaDenomList;
    case "fifa_online_mobile":
        return fifamDenomList;
    case "call_of_duty":
    case "speed_drifters":
    case "black_clover_m":
      return defaultDenomList;
    case "free_fire":
      return freeFireDenomList;
    case "rov_mobile_moba":
      return rovMobileMobaDenomList;
    case "nap_so":
        return soDenomList;
    case "tranh_hung":
        return ctthDenomList;
    case "delta_force":
        return deltaForceDenomList;
    default:
      return defaultDenomList;
  }
}

export {
  defaultDenomList,
  soDenomList,
  formEnterIDContent,
  freeFireDenomList,
  gameData,
  rovMobileMobaDenomList,
  textLoginContent,
  fifaDenomList,
  fifamDenomList,
  ctthDenomList,
  deltaForceDenomList,
};
