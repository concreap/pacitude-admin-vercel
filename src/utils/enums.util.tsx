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