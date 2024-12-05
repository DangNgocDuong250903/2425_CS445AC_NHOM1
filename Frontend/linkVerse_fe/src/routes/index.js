import { Admin, ChatPage, FriendPage, GroupPage, HomePage, LoginPage, NotFoundPage, ProfilePage, RegisterPage, ReplyPage, ResetPasswordPage, SettingPage } from "~/pages";

export const route = [
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
    },
    {
        path: '*',
        element: NotFoundPage,
    },
    {
        path: '/post/:id',
        element: ReplyPage,
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
