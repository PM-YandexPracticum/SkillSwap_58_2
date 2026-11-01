import styles from "./SkillLabel.module.css";

interface SkillLabelProps {
    label?: string;
    count?: number;
    color?: string;
    className?: string;
    onClick?: () => void;
}

const countColor = '#E8ECF7';

export const SkillLabel = ({
    label,
    count,
    color = countColor,
    className = '',
    onClick,
}: SkillLabelProps) => {
    
    const content = count !== undefined ? `+${count}` : label;

    if (!content) return null;

    const Component = onClick ? 'button' : 'span';

    return (
        <Component
        className={`${styles.label} ${className}`}
        style={{backgroundColor: color}}
        onClick={onClick}
        aria-label={count !== undefined ? `Еще ${count} навыков` : `Навык: ${label}`}
        >
            {content}
        </Component>
    )
}