import { LucideIcon } from "lucide-react";
import { Card } from "./ui/Card";
import { Box, Text, Title } from "@mantine/core";

interface MenuCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export const MenuCard = ({
  title,
  description,
  icon: Icon,
  onClick,
}: MenuCardProps) => {
  return (
    <Card onClick={onClick} hover noPadding style={{ cursor: "pointer" }}>
      <Box p="xl" style={{ textAlign: "center" }}>
        <Icon
          style={{
            width: 64,
            height: 64,
            marginBottom: 16,
            marginLeft: "auto",
            marginRight: "auto",
            color: "var(--mantine-color-blue-6)",
          }}
        />
        <Title order={2} mb="sm">
          {title}
        </Title>
        <Text c="dimmed">{description}</Text>
      </Box>
    </Card>
  );
};
