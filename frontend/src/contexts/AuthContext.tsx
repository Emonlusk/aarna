"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { auth } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
    user: User | null;
    login: (userId: string, pin: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await auth.me();
                setUser(response.data);
            } catch (error) {
                // Not authenticated
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (userId: string, pin: string): Promise<boolean> => {
        try {
            const response = await auth.login({ user_id: userId, pin });
            setUser(response.data.user);
            toast({
                title: "Welcome back!",
                description: `Logged in as ${response.data.user.name}`,
            });
            return true;
        } catch (error: any) {
            console.error("Login failed:", error);
            toast({
                title: "Login Failed",
                description: error.response?.data?.error || "Invalid PIN",
                variant: "destructive",
            });
            return false;
        }
    };

    const logout = async () => {
        try {
            await auth.logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser(null);
            window.location.href = '/';
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
