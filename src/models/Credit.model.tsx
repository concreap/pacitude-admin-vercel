import Business from "./Business.model"
import Plan from "./Plan.model"
import Subscription from "./Subscription.model"
import User from "./User.model"

export interface Credit{
    code: string,
    slug: string,
    currency: string,
    months: {
        total: number,
        remaining: number
    },
    consumedAt: {
        next: string | Date | null,
        last?: string | Date | null
    },
    startAt: string | Date | null,
    expiresAt: string | Date | null,
    value: number,
    rules: {
        mode: string,
        exhaust: string
    },
    status: string,
    ledger: Array<ICreditLedgerEntry>,
    
    business: Business | any,
    subscription: Subscription | any,
    plan: Plan | any,
    createdBy?: User | any,
    updatedBy?: User | any,

    createdAt: string,
    updatedAt: string,
    _version: number,
    _id: string,
    id: string,
}

export interface ICreditLedgerEntry {
    type: string,
    months: number,
    note?: string,
    actor?: User | any,
    renewalRef?: string,
    at: string | Date | number
}