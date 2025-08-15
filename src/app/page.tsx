'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();

    if (loading) {
        return <p>Loading...</p>;
    }

    const handleLogout = async () => {
        await signOut();
        router.push('/login');
    };

    return (
        <div
            className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            {user ? (
                <>
                    <p>You are logged in as <strong>{user.email}</strong></p>
                    <button className="btn btn-neutral" onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <p>You are not logged in.</p>
            )}

        </div>
    );
}
