/**
 * 全量技法表:基础七技法 + 八个进阶技法 + 八字两技法 + 群盘三技法 + 星座两技法(共 22)。
 * 网关与 UI 统一从这里查表。
 */
import { READING_SKILLS, type ReadingSkill } from './skills.js';
import { ADVANCED_SKILLS } from './skills-advanced.js';
import { BAZI_SKILLS } from './skills-bazi.js';
import { GROUP_SKILLS } from './skills-group.js';
import { ASTRO_SKILLS } from './skills-astro.js';

export const ALL_SKILLS: Record<string, ReadingSkill> = {
  ...READING_SKILLS,
  ...(ADVANCED_SKILLS as Record<string, ReadingSkill>),
  ...(BAZI_SKILLS as Record<string, ReadingSkill>),
  ...(GROUP_SKILLS as Record<string, ReadingSkill>),
  ...(ASTRO_SKILLS as Record<string, ReadingSkill>),
};
