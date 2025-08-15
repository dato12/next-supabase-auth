'use client';

import {useEffect, useState} from 'react';
import { useAuth } from '@/context/AuthContext';
import {useRouter} from "next/navigation";

export default function SignupPage() {
    const { signUp, user, loading } = useAuth();
    const router = useRouter();

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    // Feedback state
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && user) {
            router.push('/'); // Already logged in → go home
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (password !== repeatPassword) {
            setError('Passwords do not match!');
            return;
        }

        try {
            // Create user with Supabase Auth
            try {
                await signUp(email, password); // just call it
                setMessage('Check your email for confirmation!');
            } catch (err: any) {
                setError(err.message);
            }

            setMessage('Account created! Check your email for confirmation.');

            // Optionally, reset form
            setName('');
            setEmail('');
            setPassword('');
            setRepeatPassword('');
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        }
    };

    return (
        <div className="flex justify-center items-center w-full min-h-screen p-5">
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <legend className="fieldset-legend">Sign Up</legend>

                <label className="label" htmlFor="name">Name</label>
                <input id="name" type="text" className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>

                <label className="label" htmlFor="email">Email</label>
                <input id="email" type="email" className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>

                <label className="label" htmlFor="password">Password</label>
                <input id="password" type="password" className="input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>

                <label className="label" htmlFor="repeat_password">Repeat Password</label>
                <input id="repeat_password" type="password" className="input" placeholder="Repeat Password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)}/>

                <button className="btn btn-neutral mt-4" onClick={(e) => handleSubmit(e)}>Sign Up</button>

                {/* Error message */}
                {error && (
                    <div role="alert" className="alert alert-error mb-4 mt-6">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {/* Success message */}
                {message && (
                    <div role="alert" className="alert alert-success mb-4 mt-6">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>{message}</span>
                    </div>
                )}
            </fieldset>
        </div>
    );
}
