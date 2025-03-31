import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import ManageFactory from "@/component/layout/admin/factory/manage.factory";
import ManageOrder from "@/component/layout/admin/order/manage.order";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";
const ManageFactoryPage = async () => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<IModelPaginate<IOrder>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/orders`, method: "GET",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['get-factory'] }
        }
    })
    const orders = res.data?.result
    return (
        <>

            <ManageOrder orders={orders} />
        </>
    )
}
export default ManageFactoryPage