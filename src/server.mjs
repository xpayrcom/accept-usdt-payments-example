import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createServer as createHttpServer } from "node:http";
import { fileURLToPath } from "node:url";
import { loadDotEnv, readConfig } from "./config.mjs";
import { buildPaymentPayload, createPayment } from "./payment.mjs";

const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));
const assetTypes = { "/": ["index.html", "text/html; charset=utf-8"], "/app.js": ["app.js", "text/javascript; charset=utf-8"], "/styles.css": ["styles.css", "text/css; charset=utf-8"] };

function securityHeaders(response) {
  response.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("X-Content-Type-Options", "nosniff");
}

export function createServer(config, fetchImpl = globalThis.fetch) {
  return createHttpServer(async (request, response) => {
    securityHeaders(response);
    if (request.method === "GET" && assetTypes[request.url]) {
      const [file, type] = assetTypes[request.url];
      response.writeHead(200, { "Content-Type": type }).end(await readFile(`${publicDirectory}${file}`));
      return;
    }
    if (request.method === "GET" && request.url === "/api/product") {
      response.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" }).end(JSON.stringify({ name: config.productName, price: config.productPrice, currency: "USDT", network: config.network }));
      return;
    }
    if (request.method === "POST" && request.url === "/api/checkout") {
      try {
        const payload = buildPaymentPayload({ amount: config.productPrice, network: config.network, orderId: `demo_${randomUUID()}`, productName: config.productName });
        const session = await createPayment(config, payload, fetchImpl);
        response.writeHead(201, { "Content-Type": "application/json", "Cache-Control": "no-store" }).end(JSON.stringify(session));
      } catch (error) {
        response.writeHead(502, { "Content-Type": "application/json", "Cache-Control": "no-store" }).end(JSON.stringify({ error: error.message }));
      }
      return;
    }
    response.writeHead(404, { "Content-Type": "application/json" }).end('{"error":"Not found"}');
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  loadDotEnv();
  const config = readConfig();
  createServer(config).listen(config.port, "127.0.0.1", () => console.log(`USDT example: http://127.0.0.1:${config.port}`));
}
