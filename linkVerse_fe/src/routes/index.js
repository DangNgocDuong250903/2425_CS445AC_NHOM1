import { Admin, ChatPage, GroupPage, NotFoundPage, ProfilePage, ReplyPage, SavedsPage, SettingPage } from "~/pages";

export const route = [
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
        element: SettingPage,
    },
    {
        path: '/saveds',
        element: SavedsPage,
    },
    // {
    //     path: '/verify',
    //     element: SavedsPage,
    // },
]
