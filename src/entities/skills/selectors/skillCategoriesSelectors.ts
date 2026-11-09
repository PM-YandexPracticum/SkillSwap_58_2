import { RootState } from "@/store";

export const selectSkillCategories = (state: RootState) => state.skillCategories.skillCategories;
export const selectLoading = (state: RootState) => state.skillCategories.loading;
