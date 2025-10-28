import React, { useState } from "react";
import "./App.css";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbztJ832MbWkaHhvItlBtIwt5ahqnEjaY-sYhp0yKuLPyZGYSbmXfMd9hxpODi9Uh7YO/exec";

const App: React.FC = () => {
  const [formData, setFormData] = useState({
    date: "",
    typology: "",
    amount: "",
    currency: "EUR",
    paymentMethod: "Debit card",
  });

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    setReceiptFile(f || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    // basic validation
    if (!formData.date || !formData.typology || !formData.amount) {
      setStatus("Please fill required fields (date, typology, amount).");
      setLoading(false);
      return;
    }

    try {
      // Use FormData so Apps Script can receive file uploads like the original Google Form
      const fd = new FormData();
      fd.append("date", formData.date);
      fd.append("typology", formData.typology);
      fd.append("amount", formData.amount);
      fd.append("currency", formData.currency);
      fd.append("paymentMethod", formData.paymentMethod);
      if (receiptFile) fd.append("receipt", receiptFile);

      // Post to Apps Script (uses no-cors so the request always goes through as a form POST — keep the URL updated)
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: fd,
      });

      // Note: when using mode: 'no-cors' response is opaque — we show success optimistically.
      setStatus("✅ Expense saved successfully!");
      setFormData({
        date: "",
        typology: "",
        amount: "",
        currency: "EUR",
        paymentMethod: "Debit card",
      });
      setReceiptFile(null);
    } catch (err) {
      console.error("Save error:", err);
      setStatus("❌ Error saving expense. Check console for details.");
    } finally {
      setLoading(false);
      // clear status after a short time
      setTimeout(() => setStatus(""), 4500);
    }
  };

  return (
    <div className="app-container">
      {/* Logo (Budeoo) */}
      <div className="logo-section">
        <img
          src="https://cdn.shopify.com/s/files/1/0629/5234/1556/files/Budeoo-3.png?v=1761551265"
          alt="Budeoo Logo"
          className="logo"
        />
      </div>

      <h1 className="title">Budeoo Expense Tracker</h1>

      <form className="expense-form" onSubmit={handleSubmit}>
        <label>
          Date
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Typology of Expense
          <select
            name="typology"
            value={formData.typology}
            onChange={handleChange}
            required
          >
            <option value="">Select typology</option>
            <option value="Meal">Meal</option>
            <option value="Hotel">Hotel</option>
            <option value="Transport">Transport</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Amount
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            step="0.01"
          />
        </label>

        <label>
          Currency
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            required
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="TRY">TRY</option>
          </select>
        </label>

        <label>
          Payment Method
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="Debit card">Debit card</option>
            <option value="Credit card">Credit card</option>
            <option value="Cash">Cash</option>
          </select>
        </label>

        <label>
          Upload Receipt (optional)
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
          />
        </label>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Expense"}
        </button>
      </form>

      {status && <p className="status">{status}</p>}
    </div>
  );
};

export default App;
