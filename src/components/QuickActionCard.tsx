import { Card } from '@tremor/react';
import { cn } from '../lib/utils';
import { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
}

export default function QuickActionCard({
  title,
  description,
  icon: Icon,
  onClick,
  className,
}: QuickActionCardProps) {
  return (
    <Card 
      className={cn(
        'bg-card text-card-foreground shadow-lg transition-theme cursor-pointer',
        'dark:shadow-none dark:border-border/10',
        'hover:shadow-xl hover:scale-[1.02] transition-all duration-200',
        'group relative overflow-hidden',
        className
      )}
      onClick={onClick}
    >
      <div className="relative z-10">
        <div className="p-2 w-fit rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}