import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../services/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session = supabase.auth.session();
        setUser(session?.user ?? null);
        setLoading(false);

        const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            if (authListener?.subscription) authListener.subscription.unsubscribe();
        };
    }, []);

    const login = async (email, password) => {
        const { user, error } = await supabase.auth.signIn({ email, password });
        if (error) throw error;
        setUser(user);
    };

    const register = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setUser(data?.user ?? null);
        return data;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};