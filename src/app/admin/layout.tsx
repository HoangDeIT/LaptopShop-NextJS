import SideBar from "@/component/layout/admin/sidebar";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/auth";

const AdminLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<number>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/orders/count-pending-order`, method: "GET",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        }
    }
    )
    const resProfile = await sendRequest<IBackendRes<IUser>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user`, method: "GET",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
    })

    return (
        <>
            <SideBar pendingCount={res.data} profile={resProfile?.data}>

                {children}
            </SideBar>
        </>
    )
}
export default AdminLayout;