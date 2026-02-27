'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export type Tier = 'free' | 'pro' | 'agency';

type TierContextType = {
    tier: Tier | null;
    loading: boolean;
    refreshTier: () => Promise<void>;
};

const UserTierContext = createContext<TierContextType>({
    tier: null,
    loading: true,
    refreshTier: async () => { },
});

export function UserTierProvider({ children }: { children: React.ReactNode }) {
    const [tier, setTier] = useState<Tier | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchTier = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setTier(null);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('tier')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error("Error fetching user tier:", error);
                setTier('free'); // Graceful fallback
            } else if (data) {
                setTier(data.tier as Tier);
            }
        } catch (error) {
            console.error("Unexpected error fetching tier:", error);
            setTier('free');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTier();

        // Listen for auth state changes (e.g., login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            fetchTier();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <UserTierContext.Provider value={{ tier, loading, refreshTier: fetchTier }}>
            {children}
        </UserTierContext.Provider>
    );
}

export function useUserTier() {
    return useContext(UserTierContext);
}
