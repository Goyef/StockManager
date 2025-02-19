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
  password: string,
  nom: string,
  prenom: string
): Promise<boolean> => {
  if (!email || !password || !nom || !prenom) return false;

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Erreur lors de la création dans Supabase:", error);
      return false;
    }

    if (data.user) {
      try {
        const response = await fetch("/api/utilisateurs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            nom,
            prenom,
          }),
        });

        const result = await response.json();

        if (!result.success) {
          return false;
        }

        return true;
      } catch (error) {
        console.error(
          "Erreur lors de la création dans la base de données:",
          error
        );
      }
    }

    return false;
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return false;
  }
};


export const getUser = async (): Promise<User | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return user;
};
