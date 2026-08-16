import React from 'react';
import * as Icons from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  color?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5', color }) => {
  const IconComponent = (Icons as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>)[name] || Icons.CircleDot;
  return <IconComponent className={className} style={{ color }} />;
};

