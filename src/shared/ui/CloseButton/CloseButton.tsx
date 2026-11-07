import React from 'react';
import CrossIcon from '../../assets/icons/Cross.svg?react';
import styles from './CloseButton.module.css';

export interface CloseButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  text?: string;
}

export const CloseButton: React.FC<CloseButtonProps> = ({ 
  text = 'Закрыть', 
  className, 
  ...props 
}) => {
  return (
    <button 
      type="button" 
      className={`${styles.button} ${className || ''}`.trim()} 
      {...props}
    >
      <span className={styles.text}>{text}</span>
      <CrossIcon className={styles.icon} />
    </button>
  );
};