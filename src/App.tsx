import React, { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    date: "",
    type: "",
    currency: "",
    paymentMethod: "",
    amount: "",
    receipt: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append(
      "data",
      JSON.stringify({
        date: formData.date,
        type: formData.type,
        currency: formData.currency,
        paymentMethod: formData.paymentMethod,
        amount: formData.amount,
      })
    );

    if (formData.receipt) {
      form.append("receipt", formData.receipt);
    }

    try {
      const response = await fetch(
  "https://script.google.com/macros/s/AKfycbwnghHqbjwio_NgbSPSrQmq4P81yl-uLo7Ny-9qzhtWQmYB_Vy45NkS_BbLOJS3xfDP/exec", // your deployed Apps Script URL
  {
    method: "POST",
    body: form,
  }
);


      const result = await response.json();
      console.log("✅ Expense saved:", result);
      alert("Expense saved successfully!");

      setFormData({
        date: "",
        type: "",
        currency: "",
        paymentMethod: "",
        amount: "",
        receipt: null,
      });
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("Error saving expense.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      {/* Logo */}
      <img
  src="https://cdn.shopify.com/s/files/1/0629/5234/1556/files/Budeoo-3.png?v=1761551265"
  alt="Budeoo Logo"
  className="logo"
/>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Budeoo Expense Tracker
      </h1>
      <p className="text-gray-600 mb-8 text-center">
        Add and upload your expenses easily.
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type of Expense
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            required
          >
            <option value="">Select type</option>
            <option value="Meal">Meal</option>
            <option value="Transport">Transport</option>
            <option value="Hotel">Hotel</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Currency
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            value={formData.currency}
            onChange={(e) =>
              setFormData({ ...formData, currency: e.target.value })
            }
            required
          >
            <option value="">Select currency</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="TRY">TRY</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <input
            type="text"
            placeholder="e.g. Card, Cash"
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            value={formData.paymentMethod}
            onChange={(e) =>
              setFormData({ ...formData, paymentMethod: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            placeholder="0.00"
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Receipt (open camera)
          </label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
            onChange={(e) =>
              setFormData({
                ...formData,
                receipt: e.target.files?.[0] || null,
              })
            }
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Save Expense
        </button>
      </form>
    </div>
  );
}

export default App;
