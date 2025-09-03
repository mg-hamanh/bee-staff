"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { markEmail } from "@/lib/utils";
import { BeeSpinner } from "../bee-ui/BeeSpinner";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const handleSignInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/man/Dashboard",
    });
  };

  const handleSignInWithEmail = async () => {
    if (!email) return;
    setLoading(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });

    if (error) {
      toast.error(error.message || "Failed to send OTP");
      setLoading(false);
      return;
    }

    toast.success("Verification code sent! Check your email.");
    setOtpSent(true);
    setLoading(false);
  };

  const handleOtpSubmit = async (otpValue: string) => {
    if (otpValue.length !== 6) return;
    setLoading(true);
    const { error } = await authClient.signIn.emailOtp({
      email,
      otp: otpValue,
    });

    if (error) {
      toast.error(error.message || "Failed to verify OTP");
      setLoading(false);
      return;
    }

    router.push("/man/Dashboard");
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });
    if (error) {
      toast.error(error.message || "Failed to resend OTP");
    } else {
      toast.success("Verification code resent!");
    }
    setResendLoading(false);
  };

  return (
    <div>
      <div className="h-screen w-full flex flex-col gap-6 px-4 py-8 lg:p-12">
        <Link href="/" className="text-muted-foreground text-sm">
          <span className="text-lg font-sans">BeeAdmin</span>
        </Link>
        <div className="flex flex-row h-full justify-center items-center">
          <div
            className={`flex flex-col items-center w-full gap-5 ${
              otpSent ? "max-w-sm" : "max-w-xs"
            }`}
          >
            <Image
              src="/identity.png"
              alt="BeeShoes's Logo"
              width={48}
              height={48}
            />
            {otpSent ? (
              <motion.div
                key="otp-form"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center w-full max-w-sm gap-5"
              >
                <h1 className="text-2xl font-bold">Check your email</h1>
                <p className="text-sm text-center text-gray-500">
                  We&apos;ve sent you a passcode.
                  <br />
                  Please check your inbox at {markEmail(email)}.
                </p>
                <InputOTP
                  id="otp"
                  disabled={loading}
                  maxLength={6}
                  inputMode="numeric"
                  pattern="\d*"
                  value={otp}
                  onChange={setOtp}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && otp.length === 6) {
                      handleOtpSubmit(otp);
                    }
                  }}
                  onComplete={handleOtpSubmit}
                >
                  <InputOTPGroup>
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                <Button
                  variant="ghost"
                  className="hover:bg-transparent cursor-pointer text-xs text-gray-500"
                  disabled={resendLoading}
                  onClick={handleResendOtp}
                >
                  {resendLoading ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    "Resend code"
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="email-form"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center w-full max-w-xs gap-5"
              >
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <Button
                  variant="outline"
                  className="w-full h-10 rounded-full cursor-pointer"
                  onClick={handleSignInWithGoogle}
                  type="button"
                >
                  <Image
                    src="/google.svg"
                    alt="Sign in with Google"
                    height={16}
                    width={16}
                  />
                  <span className="text-sm font-semibold ml-2">
                    Sign in with Google
                  </span>
                </Button>
                <span className="text-sm text-gray-500">or</span>
                <Input
                  id="email"
                  type="email"
                  aria-label="Email address"
                  placeholder="Enter email"
                  className="h-12 mb-4 rounded-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSignInWithEmail();
                    }
                  }}
                  autoComplete="email"
                />
                <Button
                  disabled={!email || loading}
                  className="h-12 w-full rounded-full cursor-pointer"
                  onClick={handleSignInWithEmail}
                  type="button"
                >
                  {loading ? <BeeSpinner /> : "Continue"}
                </Button>
                <p className="text-xs text-center text-gray-500">
                  By continuing, you agree to our{" "}
                  <Link href="/terms" className="text-blue-500 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-500 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
