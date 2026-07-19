/**
 * 全量技法表:基础七技法 + 古籍调研产出的八个进阶技法(共 15)。
 * 网关与 UI 统一从这里查表。
 */
import { READING_SKILLS, type ReadingSkill } from './skills.js';
import { ADVANCED_SKILLS } from './skills-advanced.js';

export const ALL_SKILLS: Record<string, ReadingSkill> = {
  ...READING_SKILLS,
  ...(ADVANCED_SKILLS as Record<string, ReadingSkill>),
};
