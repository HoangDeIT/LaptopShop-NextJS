"use server"
import { revalidateTag } from "next/cache"

export const revalidateName = async (revalidateName: "get-user") => {
    revalidateTag(revalidateName);
}