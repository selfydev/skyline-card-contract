import type { ReactNode } from 'react';
import type { AddOnCardDirection, AddOnCardState } from './AddOnCard.props';
import './AddOnCard.css';

export interface AddOnCardProps {
  state: AddOnCardState;
  direction: AddOnCardDirection;
  title: string;
  price: string;
  ctaLabel: string;
  description?: string;
  showDescription?: boolean;
  discount?: boolean;
  originalPrice?: string;
  badgeLabel?: string;
  media?: ReactNode;
  onSelect?: () => void;
}

export function AddOnCard({ state, direction, title, price, ctaLabel, description, showDescription = true, discount = false, originalPrice, badgeLabel, media, onSelect }: AddOnCardProps) {
  const disabled = state === 'disabled';
  return (
    <article className="addon-card" dir={direction} data-state={state} aria-disabled={disabled || undefined}>
      <div className="addon-card__media">
        {media ?? <div className="addon-card__placeholder" aria-hidden="true" />}
        {discount && badgeLabel ? <span className="addon-card__badge">{badgeLabel}</span> : null}
      </div>
      <div className="addon-card__body">
        <h3 className="addon-card__title">{title}</h3>
        {showDescription && description ? <p className="addon-card__description">{description}</p> : null}
        <div className="addon-card__row">
          <div className="addon-card__prices">
            <span className="addon-card__price">{price}</span>
            {discount && originalPrice ? <s className="addon-card__original" aria-label={`Original price ${originalPrice}`}>{originalPrice}</s> : null}
          </div>
          <button type="button" className="addon-card__cta" data-variant={state === 'selected' ? 'primary' : 'secondary'} disabled={disabled} onClick={onSelect}>
            {ctaLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
