"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/Hook/auth/useUserAuth";
import { loginUser } from "@/Hook/auth/AuthDataHub";
import LogedInGurd from "@/Components/Gurd/LogedInGurd";

export default function LoginPage() {
  const router = useRouter();
  const {  setAuth } = useUserAuth();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!emailOrPhone.trim() || !password) {
      setErrorMsg("Please enter your email or phone and password.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await loginUser({
        emailOrPhone: emailOrPhone.trim(),
        password,
      });

      if (response?.data?.token && response?.data?.admin) {
        await setAuth({
          user: response.data.admin,
          tokens: {
            accessToken: response.data.token,
          },
        });
        router.replace("/");
      } else {
        setErrorMsg(response?.message || "Login failed. Please check your credentials.");
      }
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: { message?: any; error?: string } };
        message?: string;
      };
      const serverMessage =
        errorObj?.response?.data?.message ||
        errorObj?.response?.data?.error ||
        errorObj?.message ||
        "Login failed. Please try again.";
      setErrorMsg(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };



  return (
   <LogedInGurd>
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 mb-3 font-bold text-2xl shadow-inner">
            NA
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Admin Portal Login
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access the admin dashboard
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="emailOrPhone"
                className="block text-sm font-medium text-gray-700"
              >
                Email or Phone Number
              </label>
              <input
                id="emailOrPhone"
                name="emailOrPhone"
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="muksitul44@gmail.com / 01617182171"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Logging in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
   </LogedInGurd>
  );
}
