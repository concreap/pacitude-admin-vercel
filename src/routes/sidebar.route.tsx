import React from "react";
import { IRoute } from "../utils/interfaces.util";

const sidebarRoutes: Array<IRoute> = [
    {
        name: 'dashboard',
        title: 'Dashboard',
        url: '/dashboard',
        iconName: 'layout-left',
        action: 'navigate',
        isAuth: true,
        params: [],
        content: { collapsed: false, backButton: false }
    },
    {
        name: 'users',
        title: 'Users',
        iconName: 'user',
        url: '/users',
        action: 'open-secondary',
        isAuth: true,
        params: [],
        content: { collapsed: false },
        subroutes: [
            {
                name: 'all-users',
                title: 'All Users',
                iconName: 'user',
                url: '/all-users',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'talents',
                title: 'Talents',
                iconName: 'user',
                url: '/talents',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'businesses',
                title: 'Businesses',
                iconName: 'user',
                url: '/businesses',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'divider',
                url: '/',
                isAuth: true,
                params: [],
                content: {}
            },
            {
                name: 'admins',
                title: 'Admins',
                iconName: 'user',
                url: '/admins',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false, backButton: true }
            }
        ]
    },
    {
        name: 'core',
        title: 'Core',
        iconName: 'send',
        url: '/core',
        action: 'open-secondary',
        isAuth: true,
        params: [],
        content: { collapsed: false },
        subroutes: [
            {
                name: 'industries',
                title: 'Industries',
                iconName: 'star',
                url: '/industries',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'careers',
                title: 'Careers',
                iconName: 'shopping-bag',
                url: '/careers',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'fields',
                title: 'Fields',
                iconName: 'sidebar-expand',
                url: '/fields',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'skills',
                title: 'Skills',
                iconName: 'single-tap-gesture',
                url: '/skills',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'divider',
                url: '/',
                isAuth: true,
                params: [],
                content: {}
            },
            {
                name: 'questions',
                title: 'Questions',
                iconName: 'chat-remove',
                url: '/questions',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'topics',
                title: 'Topics',
                iconName: 'flash',
                url: '/topics',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false, backButton: true }
            }
        ],
        inroutes: [
            {
                route: 'core',
                parent: 'industries',
                name: 'industry-details',
                title: 'Industry Details',
                iconName: 'flash',
                url: '/industries',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            },
            {
                route: 'core',
                parent: 'industries',
                name: 'create-industry',
                title: 'Create Industry',
                iconName: 'flash',
                url: '/create',
                action: 'navigate',
                isAuth: true,
                content: { collapsed: false, backButton: true }
            },
            {
                route: 'core',
                parent: 'industries',
                name: 'edit-industry',
                title: 'Edit Industry',
                iconName: 'flash',
                url: '/edit',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            },
            {
                route: 'core',
                parent: 'careers',
                name: 'career-details',
                title: 'Career Details',
                iconName: 'flash',
                url: '/careers',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            },
            {
                route: 'core',
                parent: 'careers',
                name: 'create-career',
                title: 'Create Career',
                iconName: 'flash',
                url: '/create',
                action: 'navigate',
                isAuth: true,
                content: { collapsed: false, backButton: true }
            },
            {
                route: 'core',
                parent: 'careers',
                name: 'edit-career',
                title: 'Edit Career',
                iconName: 'flash',
                url: '/edit',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            },
            {
                route: 'core',
                parent: 'fields',
                name: 'field-details',
                title: 'Field Details',
                iconName: 'flash',
                url: '/fields',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            },
            {
                route: 'core',
                parent: 'fields',
                name: 'create-field',
                title: 'Create Field',
                iconName: 'flash',
                url: '/create',
                action: 'navigate',
                isAuth: true,
                content: { collapsed: false, backButton: true }
            },
            {
                route: 'core',
                parent: 'fields',
                name: 'edit-field',
                title: 'Edit Field',
                iconName: 'flash',
                url: '/edit',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            },
            {
                route: 'core',
                parent: 'skills',
                name: 'slill-details',
                title: 'Skill Details',
                iconName: 'flash',
                url: '/skills',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            },
            {
                route: 'core',
                parent: 'skills',
                name: 'create-skill',
                title: 'Create Skill',
                iconName: 'flash',
                url: '/create',
                action: 'navigate',
                isAuth: true,
                content: { collapsed: false, backButton: true }
            },
            {
                route: 'core',
                parent: 'skills',
                name: 'edit-skill',
                title: 'Edit Skill',
                iconName: 'flash',
                url: '/edit',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            },
            {
                route: 'core',
                parent: 'topics',
                name: 'topic-details',
                title: 'Topic Details',
                iconName: 'flash',
                url: '/topics',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            },
            {
                route: 'core',
                parent: 'topics',
                name: 'create-topic',
                title: 'Create Topic',
                iconName: 'flash',
                url: '/create',
                action: 'navigate',
                isAuth: true,
                content: { collapsed: false, backButton: true }
            },
            {
                route: 'core',
                parent: 'topics',
                name: 'edit-topic',
                title: 'Edit Topic',
                iconName: 'flash',
                url: '/edit',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            },
            {
                route: 'core',
                parent: 'questions',
                name: 'question-details',
                title: 'Question Details',
                iconName: 'flash',
                url: '/questions',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            },
            {
                route: 'core',
                parent: 'questions',
                name: 'create-question',
                title: 'Create Questions',
                iconName: 'flash',
                url: '/create',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { collapsed: false, backButton: true }
            }
        ]
    },
    {
        name: 'assessments',
        title: 'Assessments',
        url: '/assessments',
        iconName: 'chat-bubble',
        action: 'navigate',
        isAuth: true,
        params: [],
        content: { collapsed: false, backButton: true }
    },
    {
        name: 'payments',
        title: 'Payments',
        iconName: 'credit-card',
        url: '/payments',
        action: 'open-secondary',
        isAuth: true,
        params: [],
        content: { collapsed: false },
        subroutes: [
            {
                name: 'transactions',
                title: 'Transactions',
                iconName: 'star',
                url: '/transactions',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'subscriptions',
                title: 'Subscriptions',
                iconName: 'shopping-bag',
                url: '/subscriptions',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'divider',
                url: '/',
                isAuth: true,
                params: [],
                content: {}
            }
        ]
    },
    {
        name: 'divider',
        url: '/',
        isAuth: true,
        params: [],
        content: {}
    },
    {
        name: 'account',
        title: 'Account',
        iconName: 'layout-left',
        url: '/account',
        action: 'open-secondary',
        isAuth: true,
        params: [],
        content: { collapsed: false },
        subroutes: [
            {
                name: 'profile',
                title: 'Profile',
                iconName: 'user',
                url: '/profile',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'preferences',
                title: 'Preferences',
                iconName: 'user',
                url: '/preferences',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            },
            {
                name: 'divider',
                url: '/',
                isAuth: true,
                params: [],
                content: {}
            },
            {
                name: 'billing',
                title: 'Billing',
                iconName: 'user',
                url: '/billing',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { collapsed: false, backButton: true }
            }
        ]
    },
    {
        name: 'settings',
        title: 'Settings',
        iconName: 'layout-left',
        url: '/settings',
        action: 'navigate',
        isAuth: true,
        params: [],
        content: { collapsed: false, backButton: true }
    },
    {
        name: 'feedbacks',
        title: 'Feedbacks',
        iconName: 'layout-left',
        url: '/feedbacks',
        action: 'navigate',
        isAuth: true,
        params: [],
        content: { collapsed: false, backButton: true }
    },
    {
        name: 'referrals',
        title: 'Referrals',
        iconName: 'gift',
        url: '/referrals',
        action: 'navigate',
        isAuth: true,
        params: [],
        content: { collapsed: false, backButton: true }
    },
]

export default sidebarRoutes;