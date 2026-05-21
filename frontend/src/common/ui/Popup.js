import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { useLayout } from "../context/LayoutContext";
import { FaTimes } from "react-icons/fa";

const Popup = () => {
  const { popup, closePopup } = useLayout();

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape") closePopup(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closePopup]);

  useEffect(() => {
    if (popup) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [popup]);

  if (!popup) return null;
  const { title, body } = popup;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-purple-900/45 backdrop-blur-sm p-0 sm:p-4"
      onClick={closePopup}
    >
      <div
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-soft border border-purple-100 animate-bounceIn overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-brand-gradient text-white">
          <h2 className="font-display text-lg font-bold">{title}</h2>
          <button
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 grid place-items-center transition active:scale-90"
            onClick={closePopup}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
        <div className="px-5 py-5">{body}</div>
      </div>
    </div>,
    document.body
  );
};

export default Popup;
