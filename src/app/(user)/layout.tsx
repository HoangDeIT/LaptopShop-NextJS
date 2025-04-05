import ResponsiveAppBar from "@/component/layout/header"
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth";

const UserLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<IModelPaginate<IOrder>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`, method: "GET",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
    })
    const resProfile = await sendRequest<IBackendRes<IUser>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user`, method: "GET",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
    })
    console.log(res)
    console.log(resProfile)
    return (
        <>
            <div style={{ backgroundColor: "#f5f7fa" }}>
                <ResponsiveAppBar profile={resProfile?.data} history={res?.data?.result} />
                {children}
            </div>
        </>
    )
}
export default UserLayout;