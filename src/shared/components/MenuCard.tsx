import { LucideIcon } from "lucide-react";
import { Card } from "./ui/Card";

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
    <Card onClick={onClick} hover className="cursor-pointer" noBody>
      <div className="card-body items-center text-center">
        <Icon className="w-16 h-16 mb-4 text-primary" />
        <h2 className="card-title text-2xl">{title}</h2>
        <p className="text-base-content/70">{description}</p>
      </div>
    </Card>
  );
};
