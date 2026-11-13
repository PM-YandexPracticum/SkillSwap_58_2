// ─── Skill ───────────────────────────────────────────────
export type SkillType = 'teach' | 'learn'

export interface Skill {
  id: string
  title: string
  description: string
  type: SkillType
  category: string
  tags: string[]
  imageUrl: string | null
  authorId: string
  createdAt: string
}

// ─── User ────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  createdAt: string
}

// ─── Request ─────────────────────────────────────────────
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'inProgress' | 'done'

export interface SwapRequest {
  id: string
  skillId: string
  fromUserId: string
  toUserId: string
  status: RequestStatus
  createdAt: string
  updatedAt: string
}

// ─── Auth ────────────────────────────────────────────────
export interface AuthUser {
  id: string
  name: string
  email: string
  avatar?: string
  birthDate?: string
  gender?: 'not_specified' | 'male' | 'female'
  city?: string
  bio?: string
  token: string
}

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  clear?: boolean;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  disabled?: boolean;
}

// ─── Skill category (public/db/skills.json) ──────────────
export interface SkillCategory {
  id: number
  category: string
  color: string
  icon: string
  subcategories: string[]
}

// ─── City (public/db/cities.json) ────────────────────────
export interface City {
  id: string
  name: string
}

// ─── User profile (public/db/users.json) ─────────────────
export interface TeachSkill {
  name: string
  category: string
  subcategory: string
  description: string
  images: string[]
}

export interface UserProfile {
  id: number
  name: string
  avatar: string
  birth_date: string
  gender: string
  city: string
  likes: number
  date_created: string
  bio: string
  can_teach: TeachSkill
  want_to_learn: string[]
}