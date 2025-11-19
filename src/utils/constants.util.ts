import { DifficultyEnum, LevelEnum, TaskFieldEnum } from "./enums.util";

export const RESOURCE_TYPES = [
    'default',
    'user',
    'users',
    'talent',
    'talents',
    'business',
    'businesses',
    'industry',
    'industries',
    'career',
    'careers',
    'field',
    'fields',
    'skill',
    'skills',
    'topic',
    'topics',
    'question',
    'questions',
    'transacton',
    'transactions',
    'subscription',
    'subscriptions',
    'assessment',
    'assessments',
    'task',
    'tasks'
] as const;

export const ACTION_TYPES = [
    'add', 'remove', 'update', 'create', 'delete', 'generate', 'enable', 'disable', 'attach', 'detach'
] as const;

export const LEVELS: Array<typeof LevelEnum[keyof typeof LevelEnum]> = [
    'novice', 'beginner', 'intermediate', 'advanced', 'professional'
]
export const DIFFICULTIES: Array<typeof DifficultyEnum[keyof typeof DifficultyEnum]> = [
    'difficult', 'easy', 'hard', "normal", 'random'
]
export const TASK_FIELDS: Array<typeof TaskFieldEnum[keyof typeof TaskFieldEnum]> = [
    'objectives', 'outcomes', 'requirements', 'instructions', 'deliverables', 'skills', 'resources', 'rubrics'
]