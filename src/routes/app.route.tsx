import React from "react";
import { IRoute } from "../utils/interfaces.util";

const appRoutes: Array<IRoute> = [

    {
        name: '/',
        url: '/',
        isAuth: false,
        params: [],
        content: {}
    },

    {
        name: 'components',
        url: '/components',
        isAuth: false,
        params: [],
        content: {}
    },

    {
        name: 'login',
        url: '/login',
        isAuth: false,
        params: [],
        content: {}
    },

    {
        name: 'reset-password',
        url: '/reset-password',
        isAuth: false,
        params: [],
        content: {}
    },

]

export default appRoutes;