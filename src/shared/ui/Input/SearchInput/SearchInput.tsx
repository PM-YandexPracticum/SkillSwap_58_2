import { FormEvent } from "react";
import { Input } from "../Input";
import { InputProps } from "../../../types/index";
import styles from "./SearchInput.module.css";
import Search from "../../../assets/icons/Search.svg?react";

interface SearchInputProps extends Omit<
    InputProps,
    'type' | 'clear' | 'label' | 'helperText' | 'leftIcon' | 'rightIcon' | 'error' | 'errorMessage'> {
        onSearch: (query: string) => void;
    }

export const SearchInput = ({
    value,
    onChange,
    onSearch,
    placeholder = 'Искать навык',
    className = '',
}: SearchInputProps) => {

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const trimmedQuery = value.trim();
        if (trimmedQuery === '') return;
        onSearch(trimmedQuery);
    };

    return (
        <form onSubmit={handleSubmit} className={`${styles.form} ${className}`}>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type="text"
        containerClassName={styles.searchContainer}
        leftIcon={
          <button type="submit" aria-label="Искать" className={styles.searchButton}>
            <Search />
          </button>

        }
        
        rightIcon={
          value.length > 0 ? (
            <button 
              type="button" 
              onClick={() => onChange('')} 
              aria-label="Очистить поле"
              className={styles.clearButton}
            >
              ×
            </button>
          ) : null
        }
      />
    </form>
    )
}