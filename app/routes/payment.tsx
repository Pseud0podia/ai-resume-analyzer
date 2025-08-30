import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";

const Payment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [amount, setAmount] = useState(0);

  // Calculate price only once
  const [price] = useState(() => Math.floor(Math.random() * 100) + 50);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(`paid:${id}`, "true");
    navigate(`/resume/${id}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Unlock Company Suggestions</h1>
      <p className="mb-2">Price: ₹{price}</p>
      <form
        onSubmit={handlePay}
        className="flex flex-col gap-2 w-full max-w-xs"
      >
        <input
          type="number"
          placeholder="Enter amount"
          onChange={(e) => setAmount(Number(e.target.value))}
          required
          min={price}
          className="pay-input"
        />
        <button className="primary-button" type="submit">
          Pay
        </button>
      </form>
    </main>
  );
};

export default Payment;
