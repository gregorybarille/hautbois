import { LucideIcon } from 'lucide-react';

interface MenuCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export const MenuCard = ({ title, description, icon: Icon, onClick }: MenuCardProps) => {
  return (
    <div
      onClick={onClick}
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
    >
      <div className="card-body items-center text-center">
        <Icon className="w-16 h-16 mb-4 text-primary" />
        <h2 className="card-title text-2xl">{title}</h2>
        <p className="text-base-content/70">{description}</p>
      </div>
    </div>
  );
};
