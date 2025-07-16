'use client';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export default function LoadingSpinner({ fullScreen = true }: LoadingSpinnerProps) {
  const containerClasses = fullScreen 
    ? "flex items-center justify-center min-h-screen"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClasses}>
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
} 