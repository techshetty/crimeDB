"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
const LoginPage = () => {
  const router=useRouter();
  const [load,setLoad]=useState()
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isSignup ? `register` : "login";
      const response = await fetch(`${process.env.NEXT_PUBLIC_BHOST}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({username: formData.username, password: formData.password}),
      });

      const data = await response.json();
      if(data.success) {toast.success(data.message); router.push('/search')}else toast.error(data.message)
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-purple-200">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          {isSignup ? "Sign Up" : "Log In"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                title="CDB"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required={isSignup}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your email"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              title="CDB"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              title="CDB"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 rounded-lg shadow-md hover:opacity-90 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {isSignup ? "Sign Up" : "Log In"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          {isSignup
            ? "Already have an account? "
            : "Don't have an account? "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-500 font-semibold hover:underline"
          >
            {isSignup ? "Log In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
