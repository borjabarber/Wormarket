import Image from 'next/image';
import type { ReactNode } from 'react';

import { Button } from '../button/button';
import { RarityBadge, type Rarity } from './rarity-badge';

export type ListingCardProps = {
  dimensionName: string;
  href: string;
  imageAlt?: string;
  imageUrl?: string;
  price: string;
  rarity: Rarity;
  secondaryAction?: ReactNode;
  sellerName?: string;
  title: string;
};

export function ListingCard({
  dimensionName,
  href,
  imageAlt,
  imageUrl,
  price,
  rarity,
  secondaryAction,
  sellerName,
  title,
}: ListingCardProps) {
  return (
    <article className="wm-listing-card">
      <a className="wm-listing-media" href={href} aria-label={`Ver ${title}`}>
        {imageUrl ? (
          <Image
            alt={imageAlt ?? title}
            height={480}
            sizes="(max-width: 760px) 100vw, (max-width: 1180px) 33vw, 360px"
            src={imageUrl}
            unoptimized
            width={640}
          />
        ) : (
          <div aria-hidden="true" className="wm-listing-placeholder">
            <span />
          </div>
        )}
      </a>

      <div className="wm-listing-body">
        <RarityBadge rarity={rarity} />
        <h3>{title}</h3>
        <p>{dimensionName}</p>
        {sellerName ? <p className="wm-listing-seller">Vende {sellerName}</p> : null}
      </div>

      <div className="wm-listing-footer">
        <strong>{price}</strong>
        <div className="wm-listing-actions">
          {secondaryAction}
          <Button href={href} size="sm" variant="secondary">
            Ver objeto
          </Button>
        </div>
      </div>
    </article>
  );
}
