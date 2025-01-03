
import { Admin, ChatPage, GroupPage, NotFoundPage, ProfilePage, ReplyPage, SavedsPage, SearchPage, SettingPage, VerifyPage } from "~/pages";
import Dashboard from "~/pages/AdminPage/Dashboard";
import Group from "~/pages/AdminPage/Group/Group";
import Post from "~/pages/AdminPage/Post/Post";
import Customer from "~/pages/AdminPage/User/Customer";

export const route = [
    {
        path: '/profile/:id',
        element: ProfilePage,
    },
    // {
    //     path: '/admin',
    //     element: Admin,
    //     isPrivate: true
    // },
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
    {
        path: '/verify-email',
        element: VerifyPage,
    },
    {
        path: '/search',
        element: SearchPage,
    }
]

export const routeAdmin = [
    {
        path: '/admin',
        element: Dashboard,
        isPrivate: true
    },
    {
        path: '/customers',
        element: Customer
    },
    {
        path: '/post',
        element: Post
    },
    {
        path: '/groupadmin',
        element: Group
    },

]
