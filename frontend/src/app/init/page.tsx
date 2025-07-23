'use client';
import axios from "@/lib/axiosInstance";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EyeOff, Eye, Loader } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SuperAdminInit() {
  const [loading, setLoading] = useState(true);
  const [superAdminExists, setSuperAdminExists] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/init');
        const data = res.data.message;
        setSuperAdminExists(data);
      } catch {
        toast.error("Failed to fetch data. Try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <main className="h-screen grid place-content-center">
        <Loader className="h-20 w-20 text-muted-foreground animate-spin" />
      </main>
    );
  }

  if (!superAdminExists) {
    return <SignUpForm />;
  }

  if (superAdminExists) {
    redirect('/not-found');
    return null;
  }
}

function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setIsSubmitting(true);
      await axios.post("/init", { name, email, password });
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      toast.success("Signup successful.");
      router.push('/admin/login');
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="max-w-md mx-auto mt-10 space-y-4 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Sign Up as Super Admin</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        type="text"
        placeholder="Name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <input
        type="email"
        placeholder="Email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button
          type="button"
          className="absolute right-2.5 top-2.5 align-middle cursor-pointer text-muted-foreground"
          onClick={() => setShowPassword(prev => !prev)}
        >
          {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
        </button>
      </div>

      <div className="relative">
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm Password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button
          type="button"
          className="absolute right-2.5 top-2.5 align-middle cursor-pointer text-muted-foreground"
          onClick={() => setShowConfirm(prev => !prev)}
        >
          {showConfirm ? <EyeOff size={22} /> : <Eye size={22} />}
        </button>
      </div>

      <Button
        variant="secondary"
        className="text-white w-full flex items-center justify-center gap-2"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ?
          <>
            <Loader className="animate-spin" />
            Signing Up...
          </>
          :
          "Sign Up"
        }
      </Button>

    </form>
  );
}
