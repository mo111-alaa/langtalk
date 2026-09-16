"use client";

interface PricingModalProps {
  country: string;
  onClose: () => void;
}

export default function PricingModal({
  country,
  onClose,
}: PricingModalProps) {
  const isEgypt =
    country.trim().toLowerCase() ===
    "egypt";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900">

        <h2 className="text-2xl font-bold dark:text-white">
          Continue practicing
        </h2>

        {isEgypt ? (
          <>
            <p className="mt-4 text-3xl font-bold dark:text-white">
              50 EGP
            </p>

            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Visa / Mastercard
              <br />
              Vodafone Cash /
              Mobile Wallets
            </p>
          </>
        ) : (
          <>
            <p className="mt-4 text-3xl font-bold dark:text-white">
              $5 USD
            </p>

            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Visa / Mastercard
              <br />
              Apple Pay
            </p>
          </>
        )}

        <button
          onClick={onClose}
          className="mt-8 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white"
        >
          Continue
        </button>

      </div>

    </div>
  );
}