'use client';

import { useAuth } from '@/context/AuthContext';

export default function Home() {
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Loading...</p>; // Or a spinner
    }

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            {user ? (
                <p>You are logged in as <strong>{user.email}</strong></p>
            ) : (
                <p>You are not logged in.</p>
            )}
        </div>
    );
}
