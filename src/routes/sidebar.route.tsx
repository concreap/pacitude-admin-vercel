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
        content: { sidebar: true }
    },
    {
        name: 'users',
        title: 'Users',
        iconName: 'user',
        url: '/users',
        action: 'open-secondary',
        isAuth: true,
        params: [],
        content: { sidebar: true },
        subroutes: [
            {
                name: 'all-users',
                title: 'All Users',
                iconName: 'user',
                url: '/all-users',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { sidebar: true, backButton: true }
            },
            {
                name: 'talents',
                title: 'Talents',
                iconName: 'user',
                url: '/talents',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { sidebar: true, backButton: true }
            },
            {
                name: 'businesses',
                title: 'Businesses',
                iconName: 'user',
                url: '/businesses',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { sidebar: true, backButton: true }
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
                content: { sidebar: true, backButton: true }
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
        content: { sidebar: true },
        subroutes: [
            {
                name: 'industries',
                title: 'Industries',
                iconName: 'star',
                url: '/industries',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { sidebar: true, backButton: true }
            },
            {
                name: 'careers',
                title: 'Careers',
                iconName: 'shopping-bag',
                url: '/careers',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { sidebar: true, backButton: true }
            },
            {
                name: 'fields',
                title: 'Fields',
                iconName: 'sidebar-expand',
                url: '/fields',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { sidebar: true, backButton: true }
            },
            {
                name: 'skills',
                title: 'Skills',
                iconName: 'single-tap-gesture',
                url: '/skills',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { sidebar: true, backButton: true }
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
                content: { sidebar: true, backButton: true }
            },
            {
                name: 'topics',
                title: 'Topics',
                iconName: 'flash',
                url: '/topics',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { sidebar: true, backButton: true }
            }
        ],
        inroutes: [
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
                content: { sidebar: true, backButton: true }
            },
            {
                route: 'core',
                parent: 'questions',
                name: 'ai-questions',
                title: 'Generate Questions',
                iconName: 'flash',
                url: '/ai-questions',
                action: 'navigate',
                isAuth: true,
                params: [],
                content: { sidebar: true, backButton: true }
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
        content: { sidebar: true, backButton: true }
    },
    {
        name: 'payments',
        title: 'Payments',
        iconName: 'credit-card',
        url: '/payments',
        action: 'open-secondary',
        isAuth: true,
        params: [],
        content: { sidebar: true },
        subroutes: [
            {
                name: 'transactions',
                title: 'Transactions',
                iconName: 'star',
                url: '/transactions',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { sidebar: true, backButton: true }
            },
            {
                name: 'subscriptions',
                title: 'Subscriptions',
                iconName: 'shopping-bag',
                url: '/subscriptions',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { sidebar: true, backButton: true }
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
        content: { sidebar: true },
        subroutes: [
            {
                name: 'profile',
                title: 'Profile',
                iconName: 'user',
                url: '/profile',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { sidebar: true, backButton: true }
            },
            {
                name: 'preferences',
                title: 'Preferences',
                iconName: 'user',
                url: '/preferences',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { sidebar: true, backButton: true }
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
                content: { sidebar: true, backButton: true }
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
        content: { sidebar: true, backButton: true }
    },
    {
        name: 'feedbacks',
        title: 'Feedbacks',
        iconName: 'layout-left',
        url: '/feedbacks',
        action: 'navigate',
        isAuth: true,
        params: [],
        content: { sidebar: true, backButton: true }
    },
    {
        name: 'referrals',
        title: 'Referrals',
        iconName: 'gift',
        url: '/referrals',
        action: 'navigate',
        isAuth: true,
        params: [],
        content: { sidebar: true, backButton: true }
    },
]

export default sidebarRoutes;