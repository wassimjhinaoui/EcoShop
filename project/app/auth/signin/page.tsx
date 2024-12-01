"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password
      });

      console.log("Sign-in result:", result);

      if (result?.ok) {
        router.push("/shop");
      } else {
        // More specific error handling
        setError(result?.error || "Sign-in failed");
        console.error("Signin failed:", result?.error);
      }
    } catch (error) {
      console.error("Signin error:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  };

  return (
    <AuthForm
      type="signin"
      onSubmit={handleSubmit}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      error={error}
    />
  );
}