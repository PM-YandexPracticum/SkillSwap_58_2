import { useMemo } from "react";
import { Avatar } from "../Avatar";
import { LikeComponent } from "../Like/Like";
import styles from './UserInfo.module.css'

export interface UserInfoProps {
    avatar?: string;
    name?: string;
    city?: string;
    birth_date?: string;
    likes?: number;
    isLiked?: boolean;
    showLikes?: boolean;
    onLikeChange?: (isLiked: boolean) => void;
}

const pluralizeYears = (age: number): string => {
  const lastTwo = age % 100;
  const lastOne = age% 10;
  if (lastTwo >= 11 && lastTwo <= 14) return 'лет';
  if (lastOne == 1) return 'год';
  if (lastOne >= 2 && lastOne <=4) return 'года';
  return 'лет';
}

const getAgeString = (birthDate: string): string => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff == 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return `${age} ${pluralizeYears(age)}`
}

const useAge = (birthDate: string) => {
  return useMemo(() => {
    const age = getAgeString(birthDate);
    return age;
  }, [birthDate])
}

export const UserInfo: React.FC<UserInfoProps> = ({
    avatar = "",
    name="",
    city = "",
    birth_date = '2000-01-01',
    likes = 0,
    isLiked = false,
    showLikes = true,
    onLikeChange
}) => {
    return (
      <div className={styles.userinfo}>
        <Avatar src={avatar} alt={name}/>
        <div className={styles.personalinfo}>
          <span className={styles.name}>{name}</span>
          <span>{city}, {useAge(birth_date)}</span>
        </div>
        {showLikes && <LikeComponent counter={likes} isLiked={isLiked} onChange={(_, liked) => onLikeChange?.(liked)}/>}
      </div>
    )
}