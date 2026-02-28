function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatCurrency(number) {
  let formatted = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
  return formatted.replace(" $", "đ");
}

function formatCurrencyNoUnit(value) {
  return formatCurrency(value).replace("đ", "");
}

function isJsonString(str) {
  if (str === null || str === undefined || typeof str !== 'string') {
    return false;
  }
  
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

export {
  capitalizeFirstLetter,
  formatCurrency,
  formatCurrencyNoUnit,
  isJsonString,
};
