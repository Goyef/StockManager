import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export const authUserByEmailAndPassword = async (
  email: string,
  password: string
): Promise<boolean> => {

  if (!email || !password) return false;

  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) return false;
  
  return true;
};

export const signupUserByEmailAndPassword = async (
  email: string,
  password: string
): Promise<boolean> => {
  if (!email || !password) return false;

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) return false;
  return true;
};

export const getUser = async (): Promise<User | null> => {

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null;

  return user;
};



