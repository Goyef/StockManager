"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { signupUserByEmailAndPassword } from "@/services/authService";

export default function SignUp() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { register, handleSubmit, watch } = useForm();

  const email = watch("email");
  const password = watch("password");

  const onSubmit = async (data: any) => {
    setLoading(true);
    const result = await signupUserByEmailAndPassword(
      data.email,
      data.password
    );

    setLoading(false);

    if (result) {
      setDialogOpen(true);
    } else {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'inscription",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <MailCheck
                    className="h-8 w-8 text-green-600"
                    aria-hidden="true"
                  />
                </div>
                <span className="mt-2 text-center">Inscription réussie</span>
              </div>
            </AlertDialogTitle>

            <AlertDialogDescription>
              <span className="mt-2 text-center block">
                Un email de confirmation a été envoyé à votre adresse.
                <br />
                Veuillez vérifier votre boîte mail pour confirmer votre
                inscription.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-2 flex justify-center">
            <AlertDialogAction
              className="w-full"
              onClick={() => (window.location.href = "/")}
            >
              Retour
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Inscription</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email", { required: true })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password", { required: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  type="text"
                  placeholder=""
                  {...register("name", { required: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prenom">Prenom</Label>
                <Input
                  id="prenom"
                  type="text"
                  placeholder=""
                  {...register("prenom", { required: true })}
                />
              </div>

              {loading ? (
                <Button className="w-full" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!email || !password}
                >
                  Créer votre compte
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
