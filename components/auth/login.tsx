'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { authUserByEmailAndPassword } from '@/services/authService';
import { redirectUserAfterLogin } from '@/app/actions';
import { useRouter } from "next/navigation";
import { revalidatePath } from 'next/cache';
import { handleRevalidate } from './actions';

export default function Login() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch } = useForm();

  const email = watch('email');
  const password = watch('password');

  const onSubmit = async (data: any) => {
    setLoading(true);

    const result = await authUserByEmailAndPassword(
      data.email,
      data.password
    );

    setLoading(false);

    if (result) {
      await handleRevalidate();
      router.push("/");
    } else {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la connexion',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Connexion</CardTitle>
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
                  {...register('email', { required: true })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password', { required: true })}
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
                  Connexion
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
