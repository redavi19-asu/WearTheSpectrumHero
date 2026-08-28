import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";

const NOTICE_KEY = "spectrumPrivacyNotice";

export default function PrivacyControls() {
  const location = useLocation();
  const [footerTarget, setFooterTarget] = useState(null);
  const [showNotice, setShowNotice] = useState(() => {
    try {
      return localStorage.getItem(NOTICE_KEY) !== "acknowledged";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    let frame;

    const findFooter = () => {
      const target = document.querySelector(".footer .container");
      setFooterTarget(target || null);
      if (!target) frame = requestAnimationFrame(findFooter);
    };

    findFooter();
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [location.pathname]);

  const acknowledge = () => {
    try {
      localStorage.setItem(NOTICE_KEY, "acknowledged");
    } catch {
      // The notice still closes if browser storage is unavailable.
    }
    setShowNotice(false);
  };

  return (
    <>
      <style>{`
        .footerLegal {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 14px 22px;
          padding: 20px 0 4px;
          color: rgba(255,255,255,.62);
          font-size: 13px;
        }
        .footerLegalLinks {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 18px;
        }
        .footerLegal a,
        .privacyNotice a {
          color: rgba(255,255,255,.82);
          text-decoration: none;
        }
        .footerLegal a:hover,
        .privacyNotice a:hover {
          color: #fff;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .privacyNotice {
          position: fixed;
          left: 50%;
          bottom: max(18px, env(safe-area-inset-bottom));
          transform: translateX(-50%);
          z-index: 2500;
          width: min(760px, calc(100% - 28px));
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 18px;
          align-items: center;
          padding: 16px 18px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 18px;
          background: rgba(8,8,10,.94);
          box-shadow: 0 22px 70px rgba(0,0,0,.55);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }
        .privacyNoticeCopy {
          margin: 0;
          color: rgba(255,255,255,.72);
          font-size: 13px;
          line-height: 1.55;
        }
        .privacyNoticeCopy strong {
          display: block;
          margin-bottom: 3px;
          color: #fff;
          font-size: 14px;
        }
        .privacyNoticeActions {
          display: flex;
          align-items: center;
          gap: 10px;
          white-space: nowrap;
        }
        .privacyNoticeButton {
          appearance: none;
          border: 0;
          border-radius: 999px;
          padding: 10px 15px;
          color: #fff;
          font-weight: 700;
          cursor: pointer;
          background: linear-gradient(90deg,
            rgba(255,59,48,.78),
            rgba(255,149,0,.78),
            rgba(255,214,10,.68),
            rgba(52,199,89,.75),
            rgba(10,132,255,.8)
          );
        }
        .privacyNoticeButton:hover { filter: brightness(1.08); }
        @media (max-width: 640px) {
          .footerLegal { align-items: flex-start; flex-direction: column; }
          .footerLegalLinks { gap: 9px 14px; }
          .privacyNotice {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 15px;
          }
          .privacyNoticeActions {
            justify-content: space-between;
          }
        }
      `}</style>

      {footerTarget && createPortal(
        <div className="footerLegal" aria-label="Store policies">
          <span>© {new Date().getFullYear()} Wear the Spectrum Hero</span>
          <nav className="footerLegalLinks" aria-label="Legal and store policies">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/shipping-returns">Shipping & Returns</Link>
          </nav>
        </div>,
        footerTarget
      )}

      {showNotice && (
        <aside className="privacyNotice" role="dialog" aria-label="Privacy notice">
          <p className="privacyNoticeCopy">
            <strong>Your privacy matters.</strong>
            This storefront uses essential browser storage to keep cart and session features working. Optional analytics or advertising storage is not enabled by this storefront right now. <Link to="/privacy">Read our Privacy Policy</Link>.
          </p>
          <div className="privacyNoticeActions">
            <Link to="/privacy">Privacy details</Link>
            <button className="privacyNoticeButton" type="button" onClick={acknowledge}>
              Got it
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
