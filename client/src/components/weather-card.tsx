import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2, CloudRain, Thermometer, Droplets } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";

type WeatherData = {
  temperature: number;
  humidity: number;
  rainfall: number;
};

export function WeatherCard() {
  const { t } = useI18n();
  const { data: weather, isLoading } = useQuery<WeatherData>({
    queryKey: ["/api/weather"],
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudRain className="h-5 w-5" />
          {t("currentWeather")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center">
          <Thermometer className="h-8 w-8 mb-2" />
          <div className="text-lg font-semibold">{weather.temperature}°C</div>
          <div className="text-sm text-muted-foreground">{t("temperature")}</div>
        </div>
        <div className="flex flex-col items-center">
          <Droplets className="h-8 w-8 mb-2" />
          <div className="text-lg font-semibold">{weather.humidity}%</div>
          <div className="text-sm text-muted-foreground">{t("humidity")}</div>
        </div>
        <div className="flex flex-col items-center">
          <CloudRain className="h-8 w-8 mb-2" />
          <div className="text-lg font-semibold">{weather.rainfall}mm</div>
          <div className="text-sm text-muted-foreground">{t("rainfall")}</div>
        </div>
      </CardContent>
    </Card>
  );
}