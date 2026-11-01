import styles from "./SkillLabel.module.css";

interface SkillLabelProps {
    label?: string;
    count?: number;
    color?: string;
    className?: string;
}

const countColor = '#E8ECF7';

export const SkillLabel = ({
    label,
    count,
    color = countColor,
    className = '',
}: SkillLabelProps) => {
    
    const content = count !== undefined ? `+${count}` : label;

    if (!content) return null;

    return (
        <span
        className={`${styles.label} ${className}`}
        style={{backgroundColor: color}}
        >
            {content}
        </span>
    )
}