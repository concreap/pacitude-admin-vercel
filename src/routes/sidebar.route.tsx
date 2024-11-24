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
        name: 'assessments',
        title: 'Assessments',
        url: '/assessments',
        iconName: 'layout-left',
        action: 'navigate',
        isAuth: true,
        params: [],
        content: { sidebar: true }
    },
    {
        name: 'tasks',
        title: 'Tasks',
        iconName: 'layout-left',
        url: '/tasks',
        action: 'navigate',
        isAuth: true,
        params: [],
        content: { sidebar: true }
    },
    {
        name: 'leaderboard',
        title: 'Leaderboard',
        iconName: 'layout-left',
        url: '/leaderboard',
        action: 'navigate',
        isAuth: true,
        params: [],
        content: { sidebar: true }
    },
    {
        name: 'billing',
        title: 'Billing',
        iconName: 'layout-left',
        url: '/billing',
        action: 'navigate',
        isAuth: true,
        params: [],
        content: { sidebar: true }
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
                content: { sidebar: true }
            },
            {
                name: 'preferences',
                title: 'Preferences',
                iconName: 'user',
                url: '/preferences',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { sidebar: true }
            },
            {
                name: 'billing',
                title: 'Billing',
                iconName: 'user',
                url: '/billing',
                action: 'navigate',
                isAuth: true,
                params: [{ type: 'url', name: 'id' }],
                content: { sidebar: true }
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
        content: { sidebar: true }
    },
    {
        name: 'feedback',
        title: 'Feedback',
        iconName: 'layout-left',
        url: '/feedback',
        action: 'navigate',
        isAuth: true,
        params: [],
        content: { sidebar: true }
    },
    {
        name: 'referral',
        title: 'Referral',
        iconName: 'gift',
        url: '/referral',
        action: 'navigate',
        isAuth: true,
        params: [],
        content: { sidebar: true }
    },
]

export default sidebarRoutes;