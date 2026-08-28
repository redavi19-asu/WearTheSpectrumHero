import { Link } from "react-router-dom";

const wrap = { minHeight: "100vh", background: "#000", color: "#f5f5f5", padding: "72px 20px" };
const inner = { width: "min(820px, 100%)", margin: "0 auto", lineHeight: 1.7 };
const muted = { color: "rgba(255,255,255,.68)" };
const linkStyle = { color: "#8fc5ff" };

function LegalPage({ title, children }) {
  return (
    <main style={wrap}>
      <article style={inner}>
        <Link to="/" style={linkStyle}>← Back to Wear the Spectrum Hero</Link>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 60px)", marginBottom: 8 }}>{title}</h1>
        <p style={muted}>Last updated: August 28, 2026</p>
        {children}
      </article>
    </main>
  );
}

export function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <p>Wear the Spectrum Hero respects your privacy. This notice explains the information that may be processed when you browse the site, use the cart, place an order, or contact us.</p>
      <h2>Information we may process</h2>
      <p>Depending on how you use the store, information may include contact and order information you provide, product and cart selections, transaction-related information, and limited technical information needed to operate and secure the website.</p>
      <h2>How information is used</h2>
      <p>We use information to operate the storefront, maintain your cart, process and fulfill purchases, provide customer support, prevent fraud and abuse, and maintain site security.</p>
      <h2>Payments and fulfillment</h2>
      <p>Payment and merchandise-fulfillment providers may process information necessary to complete your purchase and deliver your order. Payment-card credentials are handled by the applicable payment provider rather than being intentionally stored by this storefront.</p>
      <h2>Sharing</h2>
      <p>We do not sell personal information. Information may be shared with service providers only as reasonably necessary to provide store functions such as payment processing, order fulfillment, hosting, security, and customer support, or when required by law.</p>
      <h2>Your privacy choices</h2>
      <p>You may contact us to ask about personal information associated with you or to request correction or deletion where applicable. Additional rights may apply based on where you live.</p>
      <h2>Data security and retention</h2>
      <p>We use reasonable safeguards appropriate to the information processed. Information should be retained only as long as reasonably needed for the purposes described here, including legitimate business, tax, fraud-prevention, dispute, and legal obligations.</p>
      <h2>Children</h2>
      <p>The store is intended for general audiences and is not designed to knowingly collect personal information directly from children.</p>
      <h2>Changes</h2>
      <p>We may update this policy as the store, service providers, or legal requirements change. The date above identifies the latest revision.</p>
      <p style={muted}>Before public launch, add the business contact email and mailing/contact information you want customers to use for privacy requests.</p>
    </LegalPage>
  );
}

export function Terms() {
  return (
    <LegalPage title="Terms & Conditions">
      <p>By using Wear the Spectrum Hero, you agree to use the site and store lawfully and to provide accurate information when placing an order.</p>
      <h2>Products</h2>
      <p>We try to present product colors, artwork, sizing, descriptions, availability, and pricing accurately. Screen colors and made-to-order production may result in reasonable variations.</p>
      <h2>Orders and payment</h2>
      <p>An order may be subject to payment authorization, product availability, fraud screening, and fulfillment acceptance. We may cancel or refund an order when fulfillment is not possible or an obvious pricing or listing error occurs.</p>
      <h2>Intellectual property</h2>
      <p>Unless otherwise stated, the Wear the Spectrum Hero name, original artwork, site design, written content, and brand materials may not be copied or commercially reused without permission.</p>
      <h2>Site availability</h2>
      <p>We may update, suspend, or change portions of the site as needed for maintenance, security, product changes, or improvements.</p>
      <h2>Contact</h2>
      <p style={muted}>Before public launch, add the business contact information you want customers to use for order and legal questions.</p>
    </LegalPage>
  );
}

export function ShippingReturns() {
  return (
    <LegalPage title="Shipping & Returns">
      <p>Many Wear the Spectrum Hero items are produced on demand. Production begins after an order is accepted, and delivery time includes both production and carrier transit time.</p>
      <h2>Shipping</h2>
      <p>Estimated delivery windows are estimates rather than guarantees. Carrier delays, address issues, weather, and production demand can affect delivery.</p>
      <h2>Incorrect, damaged, or defective items</h2>
      <p>If an item arrives damaged, defective, misprinted, or materially different from the order, contact us promptly with the order details and clear photos so the issue can be reviewed with the fulfillment provider.</p>
      <h2>Size and preference returns</h2>
      <p>Because made-to-order return rules can depend on the fulfillment provider and product, the final exchange/return window and eligibility will be stated here once the store's fulfillment provider is finalized.</p>
      <h2>Address problems</h2>
      <p>Customers are responsible for providing a complete and accurate delivery address. Additional charges may apply if an order must be reproduced or reshipped because an incorrect address was supplied.</p>
      <p style={muted}>This page intentionally leaves the final made-to-order return window open until the store's fulfillment provider is finalized, so the site does not promise a policy the provider cannot support.</p>
    </LegalPage>
  );
}
