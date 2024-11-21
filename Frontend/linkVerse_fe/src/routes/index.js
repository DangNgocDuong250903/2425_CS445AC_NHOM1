import React from "react";
import { Admin, GroupPage, HomePage, LoginPage, NotFoundPage, ProfilePage, RegisterPage, ResetPasswordPage } from "~/pages";
import Customer from "~/pages/AdminPage/User/Customer";
import Dashboard from "~/pages/AdminPage/Dashboard";
import Post from "~/pages/AdminPage/Post/Post";

const route1 = [
    {
        path: '/',
        element: HomePage,
    },
    {
        path: '/profile',
        element: ProfilePage,
    },

    {
        path: '/group',
        element: GroupPage,
    }
]

const route2 = [
    {
        path: '*',
        element: NotFoundPage,
    },
    {
        path: '/login',
        element: LoginPage,
    },
    {
        path: '/register',
        element: RegisterPage,
    },
    {
        path: '/reset-password',
        element: ResetPasswordPage,
    }
]
const route3 = [
    {
        path: '/admin',
        element: Dashboard
    },
    {
        path: '/customers',
        element: Customer
    },
    {
        path: '/post',
        element: Post
    },

]

export {
    route1,
    route2,
    route3,
}