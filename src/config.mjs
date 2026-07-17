import { existsSync, readFileSync } from "node:fs";

export function loadDotEnv(path = ".env") {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].trim();
  }
}

export function readConfig(env = process.env) {
  const config = {
    secretKey: env.XPAYR_SECRET_KEY || "",
    baseUrl: (env.XPAYR_BASE_URL || "https://xpayr.com/api/v1").replace(/\/+$/, ""),
    network: env.XPAYR_NETWORK || "tron-mainnet",
    productName: env.PRODUCT_NAME || "Developer Access",
    productPrice: env.PRODUCT_PRICE || "19.90",
    port: Number(env.PORT || 3000),
  };
  if (!/^https:\/\//.test(config.baseUrl)) throw new Error("XPAYR_BASE_URL must use HTTPS");
  if (!/^\d+(?:\.\d{1,8})?$/.test(config.productPrice) || Number(config.productPrice) <= 0) {
    throw new Error("PRODUCT_PRICE must be a positive decimal string");
  }
  return config;
}
