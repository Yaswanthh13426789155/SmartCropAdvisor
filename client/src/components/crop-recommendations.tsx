import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, Leaf } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { queryClient } from "@/lib/queryClient";
import { Crop } from "@shared/schema";

type Recommendation = {
  cropId: number;
  confidence: number;
  notes: string;
  notesHi: string;
  crop: Crop;
};

export function CropRecommendations() {
  const { language, t } = useI18n();

  const { data: recommendations, isLoading } = useQuery<Recommendation[]>({
    queryKey: ["/api/recommendations"],
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to refresh recommendations");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
    },
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

  if (!recommendations) return null;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5" />
          {t("cropRecommendations")}
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refreshMutation.mutate()}
          disabled={refreshMutation.isPending}
        >
          {refreshMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t("refresh")
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <Card key={rec.cropId}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">
                  {language === "en" ? rec.crop.name : rec.crop.nameHi}
                </h3>
                <div className="text-sm text-muted-foreground">
                  {rec.confidence}% {t("confidence")}
                </div>
              </div>
              <p className="text-sm">
                {language === "en" ? rec.notes : rec.notesHi}
              </p>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}