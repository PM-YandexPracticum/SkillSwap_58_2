import type { Skill, SkillCategory } from '@/shared/types'

import { fetchMockData } from './fetchMockData'

export async function fetchSkills(): Promise<Skill[]> {
  return fetchMockData<Skill[]>('skills.json', 'Не удалось загрузить навыки')
}

export async function fetchSkillById(id: string): Promise<Skill | undefined> {
  const skills = await fetchSkills()
  return skills.find((skill) => skill.id === id)
}

export async function fetchSkillCategories(): Promise<SkillCategory[]> {
  return fetchMockData<SkillCategory[]>('skills.json', 'Не удалось загрузить категории навыков')
}