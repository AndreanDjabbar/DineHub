import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { BackButton, Button } from "~/components";
import { useRequest } from "~/hooks";

const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || (location.state as any)?.email || "";
  const token = queryParams.get("token") || (location.state as any)?.token || "";

  const {
    makeRequest: verifyToken,
    isError: isTokenError,
    error: tokenError,
  } = useRequest();

  const {
    makeRequest: verifyOtp,
    isSuccess: isOtpSuccess,
    isError: isOtpError,
    error: otpError,
    isLoading: isOtpLoading,
  } = useRequest();

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);

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

    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    await verifyOtp({
      method: "POST",
      url: `http://localhost:4000/dinehub/api/auth/verify/register-otp?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
      payload: {
        otpCode: otpCode
      }
    });
  };

  useEffect(() => {
    const verifyRegisterToken = async () => {
      if (!email || !token) {
        alert("Missing email or token. Please sign up again.");
        navigate("/signup");
        return;
      }
      await verifyToken({
        method: "POST",
        url: `http://localhost:4000/dinehub/api/auth/verify/register-token?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
      });
    }
    verifyRegisterToken();
  }, []);

  useEffect(() => {
    if (isTokenError) {
      const errorMessage = tokenError?.data?.message || "Token verification failed";
      alert(errorMessage);
      navigate("/signup");
    }
  }, [isTokenError, tokenError]);

  useEffect(() => {
    if (isOtpSuccess) {
      alert("Email verified successfully!");
      navigate("/login");
    }
  }, [isOtpSuccess, navigate]);

  useEffect(() => {
    if (isOtpError) {
      const errorMessage = otpError?.data?.message || "Invalid OTP code";
      console.error("OTP verification failed:", errorMessage);
      setError(errorMessage);
      const msg = errorMessage.toLowerCase();
      if (msg.includes("expired")) {
        alert("Your OTP has expired. Please sign up again.");
        navigate("/signup");
      } else {
        alert(errorMessage);
      }
    }
  }, [isOtpError, otpError, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 px-6 py-6 flex flex-col">
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
              className="w-16 h-18 border-3 border-gray-300 rounded-xl text-center text-2xl font-bold focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition bg-gray-50"
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

        <Button
          type="submit"
          disabled={isOtpLoading}
          isLoadingText="Verifying..."
          isLoading={isOtpLoading}
          text="Verify"
        />
      </form>
    </div>
  );
};

export default VerifyOtp;
