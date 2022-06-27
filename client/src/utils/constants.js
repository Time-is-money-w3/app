export const LLAMA_TIME_CONTRACT_ADDRESS =
  "0x5A1f011E8F010f8B6Abf81e75Db34866b685ca54";

export const DAI_CONTRACT_ADDRESS =
  "0x5eD8BD53B0c3fa3dEaBd345430B1A3a6A4e8BD7C";

export const ConvertDAIPreciseToReadable = (BigNumber) =>
  +BigNumber.toString() / 1000000000000000000;

export const ConvertDAIReadableToPrecise = (DAI) =>
  BigInt(DAI) * BigInt(1000000000000000000);

export const setWithExpiry = (key, value, ttl) => {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);

    return null;
  }
  return item.value;
};

export const LLAMA_MEET_API_URL = "https://localhost:8001";
