import type { ComponentType } from 'react';

export type IconComponent = ComponentType<{
  size?: number;
  color?: string;
}>;

export interface ToggleNavigationItem {
  key: string;
  label: string;
  unselectedIcon: React.ReactNode;
  selectedIcon: React.ReactNode;
  onPress?: () => void;
}

export interface ToggleNavigationProps {
  items: ToggleNavigationItem[];
  value: number;
  onChange: (value: number) => void;
}

export type LabelWidths = Record<number, number>;
