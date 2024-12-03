import { Admin, ChatPage, FriendPage, GroupPage, HomePage, LoginPage, NotFoundPage, ProfilePage, RegisterPage, ReplyPage, ResetPasswordPage, SettingPage } from "~/pages";

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
        path: '/post/:id',
        element: ReplyPage,
    },
    {
        path: '/reset-password',
        element: ResetPasswordPage,
    },
    {
        path: '/chat',
        element: ChatPage,
    },
    {
        path: '/settings',
        element: SettingPage
    }
]
