import { Login, NotFound, Register, ResetPassword } from "~/pages";

export const routes = [
    {
        element: Register,
        path: '/register'
    },
    {
        element: Login,
        path: '/login'
    },
    {
        element: ResetPassword,
        path: '/reset-password'
    },
    {
        element: NotFound,
        path: '*'
    }
]