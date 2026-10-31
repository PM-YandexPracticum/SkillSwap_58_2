import CrossIcon from '../../assets/icons/Cross.svg?react';
import styles from './FilterLabel.module.css';

export interface FilterLabelProps {
  text: string;
  onRemove?: (text: string) => void;
  className?: string;
}

export function FilterLabel({ text, onRemove, className }: FilterLabelProps) {
  const classNames = [styles.label, className].filter(Boolean).join(' ');

  const handleRemove = () => {
    onRemove?.(text);
  };

  return (
    <div className={classNames}>
      <span>{text}</span>
      <button
        type="button"
        className={styles.cross}
        onClick={handleRemove}
        aria-label={`Удалить фильтр ${text}`}
      >
        <CrossIcon />
      </button>
    </div>
  );
}