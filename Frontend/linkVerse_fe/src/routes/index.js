import { Admin, ChatPage, FriendPage, GroupPage, HomePage, LoginPage, NotFoundPage, ProfilePage, RegisterPage, ReplyPage, SettingPage } from "~/pages";

export const route = [
    {
        path: '/:username',
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
