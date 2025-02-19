"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { getUser } from "@/services/authService";
import { User } from "@supabase/supabase-js";
import { utilisateurs } from "@prisma/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  utilisateur: utilisateurs | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [utilisateur, setUtilisateur] = useState<utilisateurs | null>(null);


  
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const currentUser = await getUser();
      setUser(currentUser);
      setLoading(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.email) {
        try {
          const response = await fetch(`/api/users?email=${user.email}`);
          const data = await response.json();
          setUtilisateur(data);
        } catch (error) {
        }
      }
    };
    if (user) {
      fetchUserRole();
    }
  }, [user]);
  return (
    <AuthContext.Provider value={{ user, loading , utilisateur}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};