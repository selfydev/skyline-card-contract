import figma from '@figma/code-connect';
import { AddOnCard } from './AddOnCard';

figma.connect(AddOnCard, 'https://www.figma.com/design/6vexI8lNMxoY1RJyX1oAZC/Skyline?node-id=70-400', {
  props: {
    state: figma.enum('State', { Default: 'default', Selected: 'selected', Disabled: 'disabled' }),
    direction: figma.enum('Direction', { LTR: 'ltr', RTL: 'rtl' }),
    discount: figma.boolean('Discount'),
    showDescription: figma.boolean('Show description'),
    title: figma.string('Title'),
    description: figma.string('Description'),
    price: figma.string('Price'),
    originalPrice: figma.string('Original price'),
    badgeLabel: figma.string('Badge label'),
    ctaLabel: figma.string('CTA label'),
    media: figma.instance('Media'),
  },
  example: (p) => (
    <AddOnCard state={p.state} direction={p.direction} discount={p.discount} showDescription={p.showDescription} title={p.title} description={p.description} price={p.price} originalPrice={p.originalPrice} badgeLabel={p.badgeLabel} ctaLabel={p.ctaLabel} media={p.media} />
  ),
});
