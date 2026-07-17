import assert from "node:assert/strict";
import test from "node:test";
import { buildPaymentPayload, createPayment } from "../src/payment.mjs";

test("builds a server-side USDT payload", () => {
  assert.deepEqual(buildPaymentPayload({ amount: "19.90", network: "tron-mainnet", orderId: "order-1", productName: "Access" }), {
    amount: "19.90", currency: "USDT", network: "tron-mainnet", order_id: "order-1", description: "Access", metadata: { integration: "accept-usdt-payments-example" },
  });
});

test("keeps credentials in the server request and returns a narrow session", async () => {
  const calls = [];
  const result = await createPayment({ secretKey: "sk_test_fixture", baseUrl: "https://xpayr.com/api/v1" }, { amount: "1", currency: "USDT" }, async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify({ id: "ps_fixture", payment_url: "https://xpayr.com/pay/ps_fixture", status: "pending" }), { status: 201 });
  });
  assert.equal(calls[0].options.headers.Authorization, "Bearer sk_test_fixture");
  assert.deepEqual(result, { payment_id: "ps_fixture", payment_url: "https://xpayr.com/pay/ps_fixture", status: "pending" });
});

test("rejects an untrusted checkout URL", async () => {
  await assert.rejects(() => createPayment({ secretKey: "test", baseUrl: "https://xpayr.com/api/v1" }, {}, async () => new Response(JSON.stringify({ id: "ps_1", payment_url: "https://evil.example/pay" }), { status: 201 })), /invalid payment session/);
});
