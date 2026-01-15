import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { Box, Container, Title, Text, Alert } from "@mantine/core";
import { Button, Card } from "../../shared/components";

interface ScoreFlashcardsProps {
  onBack: () => void;
}

export const ScoreFlashcards = ({ onBack }: ScoreFlashcardsProps) => {
  const { t } = useTranslation();

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "2rem",
      }}
    >
      <Container size="md">
        <Button
          onClick={onBack}
          variant="subtle"
          leftSection={<ArrowLeft size={20} />}
          mb="xl"
        >
          {t("common.back")}
        </Button>
        <Card>
          <Title order={2} size="2rem" mb="md">
            {t("menu.scoreFlashcards.title")}
          </Title>
          <Text size="lg" mb="xl">
            {t("menu.scoreFlashcards.description")}
          </Text>
          <Alert color="blue" title="Information">
            Fonctionnalité en cours de développement
          </Alert>
        </Card>
      </Container>
    </Box>
  );
};
