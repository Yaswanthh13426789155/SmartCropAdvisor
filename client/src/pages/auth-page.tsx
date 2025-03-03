import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/hooks/use-i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { useLocation } from "wouter";
import { LanguageToggle } from "@/components/language-toggle";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const { t } = useI18n();
  const [, setLocation] = useLocation();

  // Redirect if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex flex-col justify-center p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t("welcome")}</h1>
          <LanguageToggle />
        </div>

        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">{t("login")}</TabsTrigger>
            <TabsTrigger value="register">{t("register")}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden md:block bg-gradient-to-br from-primary/10 to-primary/30 p-8">
        <div className="h-full flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-4">{t("appDescription")}</h2>
          <p className="text-lg text-muted-foreground">
            {t("appBenefits")}
          </p>
        </div>
      </div>
    </div>
  );
}

type LoginFormData = Pick<InsertUser, "username" | "password">;

function LoginForm() {
  const { loginMutation } = useAuth();
  const { t } = useI18n();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(insertUserSchema.pick({ username: true, password: true })),
  });

  const onSubmit = form.handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">{t("username")}</Label>
        <Input id="username" {...form.register("username")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("password")}</Label>
        <Input id="password" type="password" {...form.register("password")} />
      </div>

      <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          t("login")
        )}
      </Button>
    </form>
  );
}

function RegisterForm() {
  const { registerMutation } = useAuth();
  const { t } = useI18n();

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
  });

  const onSubmit = form.handleSubmit((data) => {
    registerMutation.mutate(data);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="register-username">{t("username")}</Label>
        <Input id="register-username" {...form.register("username")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">{t("password")}</Label>
        <Input id="register-password" type="password" {...form.register("password")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">{t("fullName")}</Label>
        <Input id="name" {...form.register("name")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">{t("location")}</Label>
        <Input id="location" {...form.register("location")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="landSize">{t("landSize")}</Label>
        <Input 
          id="landSize" 
          type="number" 
          {...form.register("landSize", { valueAsNumber: true })} 
        />
      </div>

      <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          t("register")
        )}
      </Button>
    </form>
  );
}