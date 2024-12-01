"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        name
      });

      if (result?.error) {
        // Handle signup error (e.g., user already exists)
        setError(result.error);
        console.error(result.error);
        return;
      }

      // Redirect to signin or directly to shop
      router.push("/auth/signin");
    } catch (error) {
      console.error("Signup error:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  };

  return (
    <AuthForm
      type="signup"
      onSubmit={handleSubmit}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      name={name}
      setName={setName}
      error={error}
    />
  );
}