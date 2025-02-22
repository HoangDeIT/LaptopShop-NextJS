import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import ManageFactory from "@/component/layout/admin/factory/manage.factory";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";
const ManageFactoryPage = async () => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<IModelPaginate<IFactory>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/factory`, method: "GET",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['get-factory'] }
        }
    })
    const data = res.data?.result
    return (
        <>

            <ManageFactory data={data} />
        </>
    )
}
export default ManageFactoryPage