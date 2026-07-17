export function buildPaymentPayload({ amount, network, orderId, productName }) {
  if (!/^\d+(?:\.\d{1,8})?$/.test(String(amount)) || Number(amount) <= 0) throw new TypeError("Invalid amount");
  if (!/^[a-z0-9-]{2,64}$/.test(network)) throw new TypeError("Invalid network");
  if (!orderId) throw new TypeError("orderId is required");
  return {
    amount: String(amount),
    currency: "USDT",
    network,
    order_id: orderId,
    description: productName,
    metadata: { integration: "accept-usdt-payments-example" },
  };
}

export async function createPayment(config, payload, fetchImpl = globalThis.fetch) {
  if (!config.secretKey) throw new Error("XPAYR_SECRET_KEY is required");
  const response = await fetchImpl(`${config.baseUrl}/payments`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${config.secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20_000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error?.message || `XPayr returned ${response.status}`);
  if (!data?.id || !/^https:\/\/xpayr\.com\//.test(data.payment_url || "")) {
    throw new Error("XPayr returned an invalid payment session");
  }
  return { payment_id: data.id, payment_url: data.payment_url, status: data.status };
}
