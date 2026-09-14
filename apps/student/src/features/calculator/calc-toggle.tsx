import { Calculator as CalculatorIcon } from '@cbt/shared';

interface CalcToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function CalcToggle({ isOpen, onToggle }: CalcToggleProps) {
  return (
    <button
      type="button"
      className={`btn btn-sm ${isOpen ? 'btn-primary' : 'btn-outline'}`}
      onClick={onToggle}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
      title={isOpen ? 'Hide Calculator' : 'Open Scientific Calculator'}
    >
      <CalculatorIcon weight="duotone" size={16} />
      <span>Calculator</span>
    </button>
  );
}
