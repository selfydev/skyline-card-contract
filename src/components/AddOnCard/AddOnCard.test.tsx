import { render, screen } from '@testing-library/react';
import { AddOnCard } from './AddOnCard';

const base = { state: 'default' as const, direction: 'ltr' as const, title: 'Lounge access', description: 'Three hours before departure.', price: '$29.99', ctaLabel: 'Add' };

describe('AddOnCard', () => {
  it('sets dir on the root from direction', () => {
    const { container } = render(<AddOnCard {...base} direction="rtl" />);
    expect(container.firstElementChild).toHaveAttribute('dir', 'rtl');
  });
  it('exposes state as a data attribute for styling', () => {
    const { container } = render(<AddOnCard {...base} state="selected" />);
    expect(container.firstElementChild).toHaveAttribute('data-state', 'selected');
  });
  it('hides the description when showDescription is false', () => {
    render(<AddOnCard {...base} showDescription={false} />);
    expect(screen.queryByText('Three hours before departure.')).not.toBeInTheDocument();
  });
  it('shows badge and original price only when discount is true', () => {
    const { rerender } = render(<AddOnCard {...base} originalPrice="$37.49" badgeLabel="20% off" />);
    expect(screen.queryByText('20% off')).not.toBeInTheDocument();
    rerender(<AddOnCard {...base} discount originalPrice="$37.49" badgeLabel="20% off" />);
    expect(screen.getByText('20% off')).toBeInTheDocument();
    expect(screen.getByText('$37.49')).toHaveAttribute('aria-label', 'Original price $37.49');
  });
  it('disables the CTA when state is disabled', () => {
    render(<AddOnCard {...base} state="disabled" ctaLabel="Sold out" />);
    expect(screen.getByRole('button', { name: 'Sold out' })).toBeDisabled();
  });
  it('renders the media slot', () => {
    render(<AddOnCard {...base} media={<img alt="Lounge" src="x.jpg" />} />);
    expect(screen.getByAltText('Lounge')).toBeInTheDocument();
  });
  it('renders the default selected label when selected', () => {
    render(<AddOnCard {...base} state="selected" />);
    expect(screen.getByRole('button', { name: '✓ Added' })).toBeInTheDocument();
  });
  it('renders a custom selected label when passed', () => {
    render(<AddOnCard {...base} state="selected" selectedLabel="In your trip" />);
    expect(screen.getByRole('button', { name: 'In your trip' })).toBeInTheDocument();
  });
  it('still renders ctaLabel when the card is not selected', () => {
    render(<AddOnCard {...base} selectedLabel="✓ Added" />);
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });
});
