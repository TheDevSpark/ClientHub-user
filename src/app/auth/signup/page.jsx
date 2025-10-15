"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    const toastId = toast.loading("Creating your account...");

   const { data, error: signUpError } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${location.origin}/auth/signin`,
    data: {
      full_name: name,
      phone_number: phone,
    },
  },
});
console.log(`Email: '${email}'`);

// Outside the options object
console.log("SIGNUP ERROR:", signUpError);

    if (signUpError) {
      toast.dismiss(toastId);
      toast.error(signUpError.message);
      setLoading(false);
      return;
    }

    // 2️⃣ Insert into profiles table (only if user exists)
    const user = data?.user;
    if (user) {
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          full_name: name,
          phone_number: phone,
          role: "client",
          created_at: new Date().toISOString(),
        },
      ]);

      if (insertError) {
        console.error("Error inserting profile:", insertError.message);
        toast.dismiss(toastId);
        toast.error("Failed to save profile details.");
        setLoading(false);
        return;
      }
    }

    // 3️⃣ Reset form and show success message
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");

    toast.dismiss(toastId);
    toast.success(
      "✅ Sign up successful! Please check your email to verify your account."
    );
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-xl border border-gray-100 rounded-2xl p-8 w-full max-w-sm">
        <h2 className="text-center text-2xl font-bold mb-2 text-gray-900">
          Create Client Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Sign up to your dedicated ClientHub account
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-4 focus:ring-indigo-100"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-4 focus:ring-indigo-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="tel"
            placeholder="Phone (Optional)"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-4 focus:ring-indigo-100"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-4 focus:ring-indigo-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-4 focus:ring-indigo-100"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <p className="text-center">
            Already have an account
            <Link href="/auth/signin" className="text-blue-600 mx-1">
              Sign In
            </Link>
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
