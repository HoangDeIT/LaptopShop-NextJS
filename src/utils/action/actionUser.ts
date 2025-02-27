"use server"

import { getServerSession } from "next-auth"
import { sendRequest } from "../api"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth"
const getUser = async (queryString?: Object): Promise<IBackendRes<IModelPaginate<IUser>>> => {
    const session = await getServerSession(authOptions);
    const resUser = await sendRequest<IBackendRes<IModelPaginate<IUser>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/user`, method: "GET",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['get-user'] }
        }, queryParams:
            queryString

    })
    console.log(resUser)
    return resUser
}
const getCart = async (): Promise<ICart[]> => {
    const session = await getServerSession(authOptions);
    const resCart = await sendRequest<IBackendRes<IUser>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user`, method: "GET",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['get-cart'] }
        }

    })

    if (resCart?.data) {
        return resCart?.data.carts
    } else {
        // You can either return an empty object or throw an error
        return [];
    }
}
const addCartQuantity = async (id: number): Promise<ICart[]> => {
    const session = await getServerSession(authOptions);
    const resCart = await sendRequest<IBackendRes<IUser>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart/add`, method: "POST",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        }, queryParams: {
            id
        }
    })

    if (resCart?.data) {
        return resCart?.data.carts
    } else {
        // You can either return an empty object or throw an error
        return [];
    }
}
const subCartQuantity = async (id: number): Promise<ICart[]> => {
    const session = await getServerSession(authOptions);
    const resCart = await sendRequest<IBackendRes<IUser>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart/sub`, method: "POST",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        }, queryParams: {
            id
        }
    })

    if (resCart?.data) {
        return resCart?.data.carts
    } else {
        // You can either return an empty object or throw an error
        return [];
    }
}
const deleteCart = async (id: number): Promise<ICart[]> => {
    const session = await getServerSession(authOptions);
    const resCart = await sendRequest<IBackendRes<IUser>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart/delete`, method: "POST",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        }, queryParams: {
            id
        }
    })

    if (resCart?.data) {
        return resCart?.data.carts
    } else {
        // You can either return an empty object or throw an error
        return [];
    }
}
const addCart = async (id: number): Promise<ICart[]> => {
    const session = await getServerSession(authOptions);
    const formData = new FormData();
    formData.append("id", id.toString())
    formData.append("quantity", "1");
    const resCart = await sendRequest<IBackendRes<IUser>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart`, method: "POST",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        body: formData
    })

    if (resCart?.data) {
        return resCart?.data.carts
    } else {
        // You can either return an empty object or throw an error
        return [];
    }
}
export { getUser, getCart, addCartQuantity, subCartQuantity, deleteCart, addCart };