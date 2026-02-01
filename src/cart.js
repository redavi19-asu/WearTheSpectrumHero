import { API_BASE } from "./api.js";

const CART_TOKEN_KEY = "cartToken";

export function getCartToken() {
  return localStorage.getItem(CART_TOKEN_KEY);
}

export async function startCart() {
  const res = await fetch(`${API_BASE}/cart/start`, {
    method: "POST",
  });

  const data = await res.json();

  if (!data.ok) {
    throw new Error("Failed to start cart");
  }

  localStorage.setItem(CART_TOKEN_KEY, data.cartToken);
  return data.cartToken;
}

export async function estimateTotals(cart, shipping) {
  const cartToken = getCartToken();
  if (!cartToken) throw new Error("Missing cart token");

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

export async function createPayPalOrder(cart, shipping, totals) {
  const cartToken = getCartToken();
  if (!cartToken) throw new Error("Missing cart token");

  const res = await fetch(`${API_BASE}/paypal/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${cartToken}`,
    },
    body: JSON.stringify({
      items: cart.items,
      shipping,
      totals,
      currency: "USD",
    }),
  });

  const data = await res.json();

  if (!data.ok || !data.approveUrl) {
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
