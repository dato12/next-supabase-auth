'use client';

import {useState} from "react";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const { signIn } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            // Create user with Supabase Auth
            await signIn(email, password); // just call it

            router.push('/');

        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[100vh]">
            <form onSubmit={handleSubmit} className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <legend className="fieldset-legend">Login</legend>

                <label className="label">Email</label>
                <input type="email" className="input" placeholder="Email"  value={email} onChange={(e) => setEmail(e.target.value)}/>

                <label className="label">Password</label>
                <input type="password" className="input" placeholder="Password"  value={password} onChange={(e) => setPassword(e.target.value)}/>

                <button className="btn btn-neutral mt-4">Login</button>
            </form>
        </div>
    );
}
