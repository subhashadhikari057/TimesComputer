'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back(); // Go to the last visited page
    } else {
      router.push('/'); // Fallback to homepage
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 text-white text-center px-6">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-6">Oops! Page not found.</p>
      <p className="mb-8 max-w-md">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <button
        onClick={handleGoBack}
        className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-5 py-3 rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
      >
        <ArrowLeft size={18} />
        Go Back
      </button>
    </div>
  );
}
