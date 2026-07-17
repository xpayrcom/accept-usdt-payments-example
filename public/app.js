const button = document.querySelector("#checkout");
const status = document.querySelector("#status");

fetch("/api/product", { headers: { Accept: "application/json" } })
  .then((response) => response.json())
  .then((product) => {
    document.querySelector("#product").textContent = product.name;
    document.querySelector("#amount").textContent = `${product.price} ${product.currency}`;
    document.querySelector("#network").textContent = product.network;
    button.disabled = false;
  })
  .catch(() => { status.textContent = "Product configuration is unavailable."; });

button.addEventListener("click", async () => {
  button.disabled = true;
  status.textContent = "Creating secure checkout...";
  try {
    const response = await fetch("/api/checkout", { method: "POST", headers: { Accept: "application/json" } });
    const session = await response.json();
    if (!response.ok) throw new Error(session.error || "Checkout could not be created");
    window.location.assign(session.payment_url);
  } catch (error) {
    status.textContent = error.message;
    button.disabled = false;
  }
});
