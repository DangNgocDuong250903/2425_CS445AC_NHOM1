import { Admin, FriendPage, GroupPage, HomePage, LoginPage, NotFoundPage, ProfilePage, RegisterPage, ResetPasswordPage } from "~/pages";

const route1 = [
    {
        path: '/',
        element: HomePage,
    },
    {
        path: '/profile/:id',
        element: ProfilePage,
    },
    {
        path: '/admin',
        element: Admin,
    },
    {
        path: '/group/:id',
        element: GroupPage,
    },
    {
        path: '/friend/:id',
        element: FriendPage,
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