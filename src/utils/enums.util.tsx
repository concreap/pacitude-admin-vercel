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

export enum UIView {
    FORM = 'form',
    MESSAGE = 'message'
}

export enum UserEnumType{
    SUPER = 'superadmin',
    ADMIN = 'admin',
    BUSINESS = 'business',
    TALENT = 'talent',
    USER = 'user'
}
export enum PasswordType{
    SELF = 'self',
    GENERATED = 'generated',
    SELF_CHANGED = 'self-changed'
}

export enum FileLinks {
    TOPIC_CSV = 'https://docs.google.com/spreadsheets/d/1kJxsETglcWDsRSlHyO7MQEcJHBn9tHiUWnNKW4p1myQ/edit?usp=sharing'
}

export enum LevelEnum{
    DEFAULT = 'default',
    NOVICE = 'novice',
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced',
    PROFESSIONAL = 'professional',
    LEADER = 'leader',
    EXPERT = 'expert'
}

export enum TimeHandleEnum {
    SECONDS = 'second',
    MINUTE = 'minute',
    HOUR = 'hour'
}

export enum DifficultyEnum {
    RANDOM = 'random',
    EASY = 'easy',
    NORMAL = 'normal',
    HARD = 'hard',
    DIFFICULT = 'difficult'
}

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