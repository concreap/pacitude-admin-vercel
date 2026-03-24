export enum CurrencyType{
    NGN = 'NGN',
    USD = 'USD'
}
export enum HeaderType {
    IDEMPOTENT = 'x-idempotent-key'
}
export enum CookieKeyType {
    XHIT = 'x-hit'
}

export const UserEnum = {
    SUPER: 'superadmin',
    ADMIN: 'admin',
    BUSINESS: 'business',
    TALENT: 'talent',
    USER: 'user'
} as const
export enum PasswordType{
    SELF = 'self',
    GENERATED = 'generated',
    SELF_CHANGED = 'self-changed'
}

export enum FileLinks {
    TOPIC_CSV = 'https://docs.google.com/spreadsheets/d/1kJxsETglcWDsRSlHyO7MQEcJHBn9tHiUWnNKW4p1myQ/edit?usp=sharing'
}

export const LevelEnum = {
    DEFAULT: 'default',
    NOVICE: 'novice',
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced',
    PROFESSIONAL: 'professional',
    LEADER: 'leader',
    EXPERT: 'expert'
} as const

export enum TimeHandleEnum {
    SECONDS = 'second',
    MINUTE = 'minute',
    HOUR = 'hour'
}

export const DifficultyEnum = {
    RANDOM: 'random',
    EASY: 'easy',
    NORMAL: 'normal',
    HARD: 'hard',
    DIFFICULT: 'difficult'
} as const

export enum QuestionTypeEnum {
    TRIVIAL = 'trivial',
    PRACTICAL = 'practical',
    GENERAL = 'general'
}

export enum coreTypeEnum {
    CAREER = 'career',
    FIELD = 'field',
    SKILL = 'skill',
    TOPIC = 'topic',
    INDUSTRY = 'industry'
}

export const StatusEnum = {
    PENDING: 'pending',
    INPROGRESS: 'in-progress',
    OVERDUE: 'overdue',
    PROCESSING: 'processing',
    ONGOING: 'ongoing',
    SUCCESSFUL: 'successful',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
    PAID: 'paid',
    CANCELLED: 'cancelled',
    SUBMITTED: 'submitted',
    REVIEWED: 'reviewed',
    ABANDONED: 'abandoned',
    ACCEPTED: 'accepted',
    DECLINED: 'declined',
    DEFAULTED: 'defaulted',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    DRAFT: 'draft',
    GENERATING: 'generating'
} as const

export const ActionEnum = {
    GENERATE: 'generate',
    CREATE: 'create',
    DELETE: 'delete',
    UPDATE: 'update',
    ENABLE: 'enable',
    DISABLE: 'disable',
    ATTACH: 'attach',
    DETACH: 'detach',
    ADD: 'add',
    REMOVE: 'remove',
} as const

export const TaskTypeEnum = {
    TEMPLATE: 'template',
    ASSIGNED: 'assigned'
} as const

export const TaskFieldEnum = {
    OBJECTIVES: 'objectives',
    INSTRUCTIONS: 'instructions',
    DELIVERABLES: 'deliverables',
    RESOURCES: 'resources',
    OUTCOMES: 'outcomes',
    REQUIREMENTS: 'requirements',
    RUBRICS: 'rubrics',
    SKILLS: 'skills',
    GUIDELINES: 'guidelines',
} as const

export const UIViewEnum = {
    FORM: 'form',
    MESSAGE: 'message',
    BROWSE: 'browse-file',
    FILE_SELECTED: 'file-selected',
    UPLOADED: 'uploaded',
    UPLOAD_ERROR: 'upload-error'
} as const

export const UIEnum = {
    NEW: 'new',
    OLD: 'old',
} as const

export const EditTaskEnum = {
    DETAILS: 'details',
    ...TaskFieldEnum,
} as const

export const UploadFormatEnum = {
    BASE64: 'base64',
    RAW_FILE: 'rawfile'
} as const

export const DurationEnum = {
    DAY: 'day',
    DAYS: 'days',
    WEEK: 'week',
    WEEKS: 'weeks'
} as const