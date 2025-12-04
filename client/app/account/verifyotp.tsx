import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import BackButton from "../components/BackButton";

const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const token = location.state?.token || "";

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30); // 30s countdown for resend

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const otpCode = otp.join("");
    console.log("Sending to backend : ", { email, otp: otpCode });
    if (otpCode.length < 6) {
      setError("Please enter the complete 6-digit code");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/dinehub/api/auth/verify/register-otp?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otpCode: otpCode }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Success! Go to login
        alert("Email verified successfully!");
        navigate("/login");
      } else {
        setError(data.message || "Invalid OTP code");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 px-6 py-6 flex flex-col">
      <BackButton />

      <div className="mt-8 mb-8 text-center">
        <h1 className="text-3xl font-extrabold mb-2 text-gray-900">
          Verify Email
        </h1>
        <p className="text-gray-500 font-medium">
          Please enter the code we sent to <br />
          <span className="text-gray-900 font-bold">
            {email || "your email"}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* OTP Inputs */}
        <div className="flex justify-between gap-2">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-16 h-18 border border-gray-200 rounded-xl text-center text-2xl font-bold focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition bg-gray-50"
            />
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {/* Resend Timer */}
        <div className="text-center text-sm font-medium text-gray-500">
          Didn't receive the code?{" "}
          {timer > 0 ? (
            <span className="text-gray-400">
              Resend in 00:{timer < 10 ? `0${timer}` : timer}
            </span>
          ) : (
            <button
              type="button"
              className="text-red-600 font-bold hover:underline"
              onClick={() => {
                setTimer(30);
                alert("Code resent!"); // Implement resend API here later
              }}
            >
              Resend Code
            </button>
          )}
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="hover:cursor-pointer w-full bg-red-600 text-white font-bold py-4 rounded-2xl hover:bg-red-700 transition shadow-lg shadow-red-100 active:scale-[0.98] mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
