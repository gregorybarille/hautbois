import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

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
    <button
      type="button"
      onClick={onClick}
      className="group text-left focus:outline-none"
    >
      <Card className="h-full items-center gap-4 p-6 text-center transition-colors duration-200 group-hover:border-primary/40 group-hover:bg-muted/40 group-focus-visible:border-primary sm:p-8">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
          <Icon className="size-8" />
        </span>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </Card>
    </button>
  );
};
