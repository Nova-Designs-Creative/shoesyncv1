"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import logoLogin from "./Images/shoesync logo.png"; // Ensure this path is correct
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    console.log("Session Status:", status);
    if (status === "authenticated") {
      router?.push("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        console.error("Sign in error:", result.error); // Log error to console
        alert("Wrong email and password");
        setError("Invalid email or password");
      } else {
        // Clear the input fields on successful login
        router?.push("/dashboard");
      }
    } catch (err) {
      console.error("Unexpected error:", err); // Log unexpected error to console
      setError("An unexpected error occurred. Please try again.");
    }
  };

  if (status === "loading") {
    return (
      <div>
        <p className="text-white text-3xl">Loading...</p>
      </div>
    ); // Optional loading indicator
  }

  if (status === "authenticated") {
    return null; // Prevent any flash of the login form
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-teal-800 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 opacity-30"
          animate={{
            scale: [1, 1.2, 1.1, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 p-8 rounded-lg shadow-2xl w-full max-w-md relative z-10"
      >
        <div className="flex justify-center mb-8">
          <Image
            src={logoLogin}
            alt="Admin Logo"
            width={50}
            height={50}
            className="rounded-full bg-gray-800 p-2"
          />
        </div>
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-800 text-white border-gray-700 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-800 text-white border-gray-700 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
          >
            Sign In
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
