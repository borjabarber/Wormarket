import { classNames } from '../../lib/class-names';

export const rarityValues = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'FORBIDDEN'] as const;

export type Rarity = (typeof rarityValues)[number];

const rarityLabels: Record<Rarity, string> = {
  COMMON: 'Comun',
  RARE: 'Raro',
  EPIC: 'Epico',
  LEGENDARY: 'Legendario',
  FORBIDDEN: 'Prohibido',
};

export type RarityBadgeProps = {
  rarity: Rarity;
};

export function RarityBadge({ rarity }: RarityBadgeProps) {
  return (
    <span className={classNames('wm-rarity-badge', `wm-rarity-${rarity.toLowerCase()}`)}>
      {rarityLabels[rarity]}
    </span>
  );
}
