import { createRoot } from 'react-dom/client';
import { AddOnCard } from './components/AddOnCard/AddOnCard';
import { ADD_ON_CARD_PROPS } from './components/AddOnCard/AddOnCard.props';

const en = { title: 'Lounge access', description: 'Three hours in the Skyline lounge before departure.', price: '$29.99', originalPrice: '$37.49', badgeLabel: '20% off' };
const ar = { title: 'دخول الصالة', description: 'ثلاث ساعات في صالة سكاي لاين قبل المغادرة.', price: '110 د.إ', originalPrice: '137 د.إ', badgeLabel: 'خصم ٢٠٪' };

function Matrix() {
  const cards = [];
  for (const direction of ADD_ON_CARD_PROPS.direction) for (const state of ADD_ON_CARD_PROPS.state) for (const discount of [false, true]) {
    const copy = direction === 'rtl' ? ar : en;
    const cta = state === 'selected' ? (direction === 'rtl' ? 'تمت الإضافة' : 'Added') : direction === 'rtl' ? 'إضافة' : 'Add';
    cards.push(<AddOnCard key={`${direction}-${state}-${discount}`} state={state} direction={direction} discount={discount} ctaLabel={cta} {...copy} />);
  }
  cards.push(
    <AddOnCard
      key="no-description"
      state="default"
      direction="ltr"
      showDescription={false}
      title="Extra bag"
      price="$60.00"
      ctaLabel="Add"
    />,
  );
  return (<><h1>Add-on Card, every state and direction, plus the two booleans</h1><div className="grid">{cards}</div></>);
}
createRoot(document.getElementById('root')!).render(<Matrix />);
