import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";

export function LanguageToggle() {
  const { language, setLanguage } = useI18n();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "hi" : "en")}
    >
      {language === "en" ? "हिंदी" : "English"}
    </Button>
  );
}
