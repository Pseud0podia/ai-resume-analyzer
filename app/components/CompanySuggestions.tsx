import React from "react";

interface Props {
  companies: string[];
  isPaid: boolean;
  onPayClick: () => void;
}

const CompanySuggestions: React.FC<Props> = ({ companies, isPaid, onPayClick }) => (
  <div className="relative my-8 rounded-2xl shadow bg-white p-10 w-full my-auto h-auto flex flex-col">
    {/* Heading at the top */}
    <h3 className="text-3xl font-bold mb-4">Companies Interested In Your Skillset</h3>
    <div className={isPaid ? "" : "paywall-blur"}>
      <ul className="flex flex-wrap gap-4">
        {companies.map((c) => (
          <li
            key={c}
            className="bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 px-4 py-2 rounded-xl font-semibold shadow-sm"
          >
            {c}
          </li>
        ))}
      </ul>
    </div>
    {!isPaid && (
      <div className="paywall-overlay flex flex-col items-center justify-start">
        <img
          src="/icons/lock.svg"
          alt="Locked"
          className="w-10 h-10 mb-2 opacity-80"
        />
        <span className="mb-2 font-semibold text-gray-700">
          Unlock company suggestions
        </span>
        <span className="mb-4 text-sm text-gray-500 text-center max-w-xs">
          Pay to see which companies match your skillset!
        </span>
        <button className="primary-button w-auto" onClick={onPayClick}>
          Unlock Now
        </button>
      </div>
    )}
  </div>
);

export default CompanySuggestions;