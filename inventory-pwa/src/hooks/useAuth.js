// Sure, here's the contents for the file: /inventory-pwa/inventory-pwa/src/hooks/useAuth.js

import { useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabase';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const { setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user || null);
    setLoading(false);

    const { data: subscription } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser]);

  const signIn = async (email, password) => {
    setLoading(true);
    const { user, error } = await supabase.auth.signIn({ email, password });
    setLoading(false);
    return { user, error };
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  return { signIn, signOut, loading };
};