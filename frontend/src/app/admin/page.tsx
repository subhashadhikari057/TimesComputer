'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/admin/login');
    }
  }, [router]);

  return null; // or a loading spinner
}
