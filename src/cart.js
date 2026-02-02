import { API_BASE } from "./api.js";

const CART_TOKEN_KEY = "cartToken";

export function getCartToken() {
  return localStorage.getItem(CART_TOKEN_KEY);
}

async function getOrCreateCartToken() {
  // 🔥 FORCE fresh token to kill all stale HMACs
  localStorage.removeItem(CART_TOKEN_KEY);

  const now = Date.now();
  const tokenPayload = {
    iat: now,
    exp: now + 6 * 60 * 60 * 1000,
    v: 1,
  };

  const res = await fetch(`${API_BASE}/cart/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tokenPayload),
  });
  const data = await res.json();

  if (!data.ok || !data.cartToken) {
    throw new Error("Failed to start cart");
  }

  localStorage.setItem(CART_TOKEN_KEY, data.cartToken);
  return data.cartToken;
}

export async function startCart() {
  return getOrCreateCartToken();
}

export async function estimateTotals(cart, shipping) {
  const token = await getOrCreateCartToken();

  const res = await fetch(`${API_BASE}/paypal/estimate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      items: cart.items,
      shipping,
      currency: "USD",
    }),
  });

  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Estimate failed");

  return data.totals;
}

export async function createPayPalOrder(cartPayload) {
  const token = await getOrCreateCartToken();

  console.log("API_BASE =", API_BASE);
  console.log("USING TOKEN =", token);

  const res = await fetch(`${API_BASE}/paypal/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(cartPayload),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Order failed:", data);
    throw new Error("Order creation failed");
  }

  window.location.href = data.approveUrl;
}

export async function capturePayment(orderId) {
  const cartToken = getCartToken();
  if (!cartToken) throw new Error("Missing cart token");

  const res = await fetch(`${API_BASE}/paypal/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${cartToken}`,
    },
    body: JSON.stringify({ orderId }),
  });

  const data = await res.json();

  if (!data.ok) {
    throw new Error("Payment capture failed");
  }

  return data;
}
