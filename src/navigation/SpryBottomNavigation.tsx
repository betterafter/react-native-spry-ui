import ToggleNavigation, {
  type IconComponent,
} from './ToggleNavigation/ToggleNavigation';

export default function SpryBottomNavigation({
  navigationType,
  items,
  value,
  onChange,
}: {
  navigationType: 'toggle' | 'tabs';
  items: {
    key: string;
    label: string;
    icon: IconComponent;
    onPress: () => void;
  }[];
  value: number;
  onChange: (value: number) => void;
}) {
  switch (navigationType) {
    case 'toggle':
      return (
        <ToggleNavigation items={items} value={value} onChange={onChange} />
      );
    default:
      return null;
  }
}
