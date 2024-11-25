import { Admin, ChatPage, FriendPage, GroupPage, HomePage, LoginPage, NotFoundPage, ProfilePage, RegisterPage, ResetPasswordPage } from "~/pages";

export const route = [
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
        isPrivate: true
    },
    {
        path: '/group/:id',
        element: GroupPage,
    },
    {
        path: '/friend/:id',
        element: FriendPage,
    },
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
    },
    {
        path: '/chat',
        element: ChatPage,
    }
]
