import { sendRequest } from "@/utils/api";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

const ActiveAccountPage = async (
    {
        params,
    }: {
        params: Promise<{ slug: string }>
    }
) => {
    const slug = (await params).slug;
    const res = await sendRequest<IBackendRes<boolean>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/active-account/${slug}`,
        method: "POST",
    })
    //@ts-ignore
    if (res.data.success) {

        redirect("/login?active=true")
    } else {
        //@ts-ignore

        redirect("/login?active=false")
    }
}
export default ActiveAccountPage