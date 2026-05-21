import React, { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane, FaUserAlt } from "react-icons/fa";
import { useNotification } from "../common/context/NotificationContext";

const InfoTile = ({ icon, label, value, tone }) => (
  <div className="card-pop">
    <div className={`w-11 h-11 rounded-2xl grid place-items-center ${tone}`}>{icon}</div>
    <div className="text-[11px] uppercase tracking-wider text-gray-500 mt-3">{label}</div>
    <div className="font-display font-bold text-brand-purpleDeep">{value}</div>
  </div>
);

const Contact = () => {
  const { showSuccess } = useNotification();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e) => {
    e.preventDefault();
    showSuccess("Thanks! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-candy-gradient text-white p-6 sm:p-10 shadow-popPink">
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/15 blur-2xl" />
          <h1 className="relative font-display text-3xl sm:text-4xl font-bold">Talk to us</h1>
          <p className="relative text-white/90 mt-2 max-w-md">
            Questions, feedback, or partnership ideas? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
          <InfoTile icon={<FaEnvelope />} label="Email" value="support@bigwin.app" tone="bg-purple-100 text-brand-purpleDeep" />
          <InfoTile icon={<FaPhoneAlt />} label="Call" value="+91 90000 00000" tone="bg-emerald-100 text-emerald-700" />
          <InfoTile icon={<FaMapMarkerAlt />} label="Find us" value="Bengaluru, India" tone="bg-orange-100 text-orange-700" />
        </div>

        <form onSubmit={submit} className="card-pop mt-6 space-y-4">
          <h2 className="font-display font-bold text-brand-purpleDeep text-lg">Send a message</h2>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Name</label>
            <div className="relative">
              <FaUserAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple/60" />
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="input-fancy pl-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple/60" />
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="input-fancy pl-11"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Message</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="What's on your mind?"
              className="input-fancy resize-none"
            />
          </div>

          <button type="submit" className="btn-primary inline-flex items-center gap-2">
            <FaPaperPlane /> Send message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
