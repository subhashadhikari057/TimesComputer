"use client";
import { Mail, Lock, LoaderCircleIcon } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LoginForm {
  email: string;
  password: string;
}

interface LoginFormError {
  email?: string;
  password?: string;
  general?: string;
}

export default function AdminLogin() {
  const router = useRouter();
  const [err, setErr] = useState<LoginFormError>({});
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setErr({});
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const errors: LoginFormError = {};
    if (!form.email.trim()) errors.email = "Email is required";
    if (!form.password.trim()) errors.password = "Password is required";

    if (Object.keys(errors).length) {
      setErr(errors);
      return;
    }

    setIsLoading(true);
    // Simulate login API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Login successful!");
      // Redirect to admin dashboard
      router.push("/admin/dashboard");
    }, 2000);
  }

  return (
    <div className="h-screen w-screen inset-0 z-50 absolute">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md m-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Admin Panel
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Enter your email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {err.email && (
                <p className="mt-1 text-sm text-red-600">{err.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="password"
                  placeholder="Enter your password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {err.password && (
                <p className="mt-1 text-sm text-red-600">{err.password}</p>
              )}
            </div>
            {err.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{err.general}</p>
              </div>
            )}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <LoaderCircleIcon className="mr-2 animate-spin" size={18} />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
