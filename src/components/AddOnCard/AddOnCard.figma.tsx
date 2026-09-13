import figma from '@figma/code-connect';
import { AddOnCard } from './AddOnCard';

figma.connect(AddOnCard, 'https://www.figma.com/design/qpH64wRvJjZXUcGzND7ceU/Skyline-Air-design-system?node-id=70-400', {
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
    selectedLabel: figma.string('Selected label'),
    media: figma.instance('Media'),
  },
  example: (p) => (
    <AddOnCard state={p.state} direction={p.direction} discount={p.discount} showDescription={p.showDescription} title={p.title} description={p.description} price={p.price} originalPrice={p.originalPrice} badgeLabel={p.badgeLabel} ctaLabel={p.ctaLabel} selectedLabel={p.selectedLabel} media={p.media} />
  ),
});
