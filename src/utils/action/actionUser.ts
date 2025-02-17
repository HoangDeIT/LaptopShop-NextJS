"use server"

import { getServerSession } from "next-auth"
import { sendRequest } from "../api"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth"
const getUser = async () => {
    const session = await getServerSession(authOptions);
    const resUser = await sendRequest<IBackendRes<IModelPaginate<IUser>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/user`, method: "GET",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['get-user'] }
        },
    })
    console.log(resUser)
    return resUser
}
export { getUser };