import { Admin, ChatPage, GroupPage, NotFoundPage, ProfilePage, ReplyPage, SavedsPage, SettingPage } from "~/pages";

export const route = [
    {
        path: '/:id',
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
    },
    {
        path: '/saveds',
        element: SavedsPage
    },
]
