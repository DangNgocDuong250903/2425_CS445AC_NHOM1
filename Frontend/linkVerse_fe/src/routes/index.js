import { Admin, GroupPage, HomePage, LoginPage, NotFoundPage, ProfilePage, RegisterPage, ResetPasswordPage } from "~/pages";

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
        path: '/admin',
        element: Admin,
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

export {
    route1,
    route2
}