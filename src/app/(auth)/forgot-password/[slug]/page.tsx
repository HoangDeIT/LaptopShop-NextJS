import ResetPassword from "@/component/auth/reset.password"
import { sendRequest } from "@/utils/api"
import { redirect } from "next/navigation"

const ResetPasswordPage = async (
    {
        params,
    }: {
        params: Promise<{ slug: string }>
    }
) => {
    const slug = (await params).slug
    const res = await sendRequest<IBackendRes<boolean>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code/${slug}`,
        method: "POST",
    })
    console.log(res)
    //@ts-ignore
    if (!res.data.success) {
        redirect("/login")
    }
    return (
        <>
            <ResetPassword code={slug} />
        </>
    )
}
export default ResetPasswordPage