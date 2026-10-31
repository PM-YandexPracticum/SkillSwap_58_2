import Logo from '../../assets/icons/Logo.svg?react';
import styles from './Logotype.module.css';

interface LogoProps {
    className?: string;
    onClick?: () => void;
}

export const Logotype = ({
    className='',
    onClick,
}: LogoProps) => {

    const Component = onClick ? 'button' : 'div';

    return (
        <Component
            className={`${styles.logo} ${className}`}
            onClick={onClick}
            aria-label="Логотип сайта 'SkillSwap' - переход на главную"
        >
            <Logo/>
            <span className={styles.text}>SkillSwap</span>
        </Component>
    )
}