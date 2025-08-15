'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

type User = {
    id: string;
    email: string | null;
    full_name?: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    signUp: (email: string, password: string, name?: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(res => {
            if (res.data.session?.user) {
                const u = res.data.session.user;
                setUser({
                    id: u.id,
                    email: u.email ?? null,
                    full_name: (u.user_metadata as any)?.full_name,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                const u = session.user;
                setUser({
                    id: u.id,
                    email: u.email ?? null,
                    full_name: (u.user_metadata as any)?.full_name,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    const signUp = async (email: string, password: string, name?: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name ?? '',
                },
            },
        });
        if (error) throw error;
    };

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        if (data.user) {
            setUser({
                id: data.user.id,
                email: data.user.email ?? null,
                full_name: (data.user.user_metadata as any)?.full_name,
            });
        }
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
