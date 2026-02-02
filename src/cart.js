import { API_BASE } from "./api.js";

const CART_TOKEN_KEY = "cartToken";

export function getCartToken() {
  return localStorage.getItem(CART_TOKEN_KEY);
}

export async function ensureCartToken() {
  let token = localStorage.getItem(CART_TOKEN_KEY);
  if (token) return token;

  const res = await fetch(`${API_BASE}/cart/start`, {
    method: "POST",
  });

  const data = await res.json();
  if (!data.ok) throw new Error("Failed to start cart");

  localStorage.setItem(CART_TOKEN_KEY, data.cartToken);
  return data.cartToken;
}

export async function startCart() {
  return ensureCartToken();
}

export async function estimateTotals(cart, shipping) {
  const cartToken = await ensureCartToken();

  const res = await fetch(`${API_BASE}/paypal/estimate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${cartToken}`,
    },
    body: JSON.stringify({
      items: cart.items,
      shipping,
      currency: "USD",
    }),
  });

  const data = await res.json();

  if (!data.ok) {
    throw new Error(data.error || "Estimate failed");
  }

  return data.totals;
}

export async function createPayPalOrder(cart) {
  const cartToken = localStorage.getItem(CART_TOKEN_KEY);

  console.log("CART TOKEN:", cartToken);

  if (!cartToken) {
    throw new Error("No cart token found before checkout");
  }

  const res = await fetch(`${API_BASE}/paypal/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${cartToken}`
    },
    body: JSON.stringify(cart),
  });

  const data = await res.json();

  if (!res.ok || !data.approveUrl) {
    console.error("Order error:", data);
    throw new Error("PayPal order creation failed");
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
