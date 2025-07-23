"use client";
import { Mail, Lock, LoaderCircleIcon, Eye, EyeOff } from "lucide-react";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/axiosInstance";
import DefaultCheckbox from "@/components/form/form-elements/DefaultCheckbox";

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
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
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if user is already authenticated
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        // First check localStorage for user data
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          setCheckingAuth(false);
          return;
        }

        // Verify token with backend
        await apiRequest("GET", "/auth/verify");
        
        // If we reach here, user is authenticated
        toast.info("You are already logged in. Redirecting to dashboard...");
        router.push("/admin/dashboard");
      } catch (error) {
        // Token is invalid or expired, clear localStorage and allow login
        localStorage.removeItem('user');
        setCheckingAuth(false);
      }
    };

    checkExistingAuth();
  }, [router]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setErr({});
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }

  // In your AdminLogin component, update the handleSubmit function:
async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const errors: LoginFormError = {};
  if (!form.email.trim()) errors.email = "Email is required";
  if (!form.password.trim()) errors.password = "Password is required";

  if (Object.keys(errors).length) {
    setErr(errors);
    return;
  }

  setIsLoading(true);

  try {
    const data = await apiRequest("POST", "/auth/refresh/login", {
      email: form.email,
      password: form.password,
      rememberMe: form.rememberMe,
    });
    
    
    // Store user data in localStorage for the Header component to use
    localStorage.setItem('user', JSON.stringify(data.user));
    
    toast.success("Login successful!");
    router.push("/admin/dashboard");
  } catch {
    toast.error("Login failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
}

  // Show loading spinner while checking authentication
  if (checkingAuth) {
    return (
      <div className="h-screen w-screen inset-0 z-50 absolute bg-[url('/background/login_bg.png')] bg-cover bg-center">
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md m-10">
            <div className="text-center">
              <LoaderCircleIcon className="mx-auto mb-4 animate-spin text-blue-600" size={40} />
              <h2 className="text-xl font-semibold text-gray-800">Checking authentication...</h2>
              <p className="text-gray-600 mt-2">Please wait while we verify your session.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen inset-0 z-50 absolute bg-[url('/background/login_bg.png')] bg-cover bg-center ">
      <div className=" min-h-screen flex items-center justify-center ">
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {err.password && (
                <p className="mt-1 text-sm text-red-600">{err.password}</p>
              )}
            </div>

            <DefaultCheckbox
              label="Remember me"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
              className="mt-4"
            />

            {err.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{err.general}</p>
              </div>
            )}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-blue-500  transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
