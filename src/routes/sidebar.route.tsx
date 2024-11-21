import React from "react";
import { IRoute } from "../utils/interfaces.util";

const sidebarRoutes: Array<IRoute> = [
    {
        name: 'dashboard',
        title: 'Dashboard',
        url: '/dashboard',
        iconName: 'layout-left',
        isAuth: true,
        params: [],
        content: {}
    },
    {
        name: 'assessments',
        title: 'Assessments',
        url: '/assessments',
        iconName: 'layout-left',
        isAuth: true,
        params: [],
        content: {}
    },
    {
        name: 'tasks',
        title: 'Tasks',
        iconName: 'layout-left',
        url: '/tasks',
        isAuth: true,
        params: [],
        content: {}
    },
    {
        name: 'leaderboard',
        title: 'Leaderboard',
        iconName: 'layout-left',
        url: '/leaderboard',
        isAuth: true,
        params: [],
        content: {}
    },
    {
        name: 'billing',
        title: 'Billing',
        iconName: 'layout-left',
        url: '/billing',
        isAuth: true,
        params: [],
        content: {}
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
        isAuth: true,
        params: [],
        content: {}
    },
    {
        name: 'settings',
        title: 'Settings',
        iconName: 'layout-left',
        url: '/settings',
        isAuth: true,
        params: [],
        content: {}
    },
    {
        name: 'feedback',
        title: 'Feedback',
        iconName: 'layout-left',
        url: '/feedback',
        isAuth: true,
        params: [],
        content: {}
    },
    {
        name: 'referral',
        title: 'Referral',
        iconName: 'gift',
        url: '/referral',
        isAuth: true,
        params: [],
        content: {}
    },
]

export default sidebarRoutes;