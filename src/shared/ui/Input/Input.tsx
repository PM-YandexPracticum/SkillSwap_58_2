import type { InputProps } from "@/shared/types";
import { useRef } from "react";
import styles from "./Input.module.css"

export const Input = ({
    value,
    onChange,
    placeholder = '',
    type = 'text',
    clear = false,
    error = false,
    className = '',
    searchIcon,
}: InputProps) => {

    const inputRef = useRef<HTMLInputElement>(null);

    const handleClear = () => {
        onChange('');
        inputRef.current?.focus();
    };

    return (
        <div className={`${styles.wrapper} ${className}`}>
            <div className={`${styles.container} ${error ? styles.error : ''}`}>
                {searchIcon && (
                    <span className={styles.iconWrapper}>
                        {searchIcon}
                    </span>
                )}

                <input
                    ref={inputRef}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={styles.input}
                />

                {clear && value.length > 0 && (
                    <button
                    type="button"
                    onClick={handleClear}
                    className={styles.clearButton}
                    aria-label="Очистить поле"
                    >
                       × 
                    </button>
                )}
            </div>
        </div>
    )
}