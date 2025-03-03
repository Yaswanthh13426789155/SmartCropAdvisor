import { WeatherCard } from "@/components/weather-card";
import { CropRecommendations } from "@/components/crop-recommendations";
import { LanguageToggle } from "@/components/language-toggle";
import { useI18n } from "@/hooks/use-i18n";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function HomePage() {
  const { t } = useI18n();
  const { user, logoutMutation } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("welcome")}</h1>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{t("welcomeUser")}</h2>
              <span className="font-medium">{user?.name}</span>
            </div>
            <WeatherCard />
          </div>
          <div>
            <CropRecommendations />
          </div>
        </div>
      </main>
    </div>
  );
}
