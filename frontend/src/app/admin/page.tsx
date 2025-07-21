'use client';
import { redirect } from 'next/navigation';
import { Spinner } from '@geist-ui/core';
import { useAuth } from '@/context/authContext';

export default function AdminPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='h-screen grid place-content-center'>
        <Spinner scale={5} />
      </div>
    );

  }

  if (user) {
    redirect("/admin/dashboard");
  }

  if (!user) {
    redirect("/admin/login");
  }
};

