export const ADD_ON_CARD_PROPS = {
  state: ['default', 'selected', 'disabled'],
  direction: ['ltr', 'rtl'],
  discount: 'boolean',
  showDescription: 'boolean',
  media: 'slot',
  title: 'text',
  description: 'text',
  price: 'text',
  originalPrice: 'text',
  badgeLabel: 'text',
  ctaLabel: 'text',
} as const;

export type AddOnCardState = (typeof ADD_ON_CARD_PROPS.state)[number];
export type AddOnCardDirection = (typeof ADD_ON_CARD_PROPS.direction)[number];
