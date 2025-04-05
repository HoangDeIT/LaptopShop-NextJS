import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import ManageFactory from "@/component/layout/admin/factory/manage.factory";
import ManageOrder from "@/component/layout/admin/order/manage.order";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";
const ManageFactoryPage = async (
    { searchParams }: { searchParams: Promise<{ filter: string, page: number, size: number }> }

) => {
    const session = await getServerSession(authOptions);
    const { filter, page, size } = await searchParams
    const res = await sendRequest<IBackendRes<IModelPaginate<IOrder>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/orders`, method: "GET",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        queryParams: {

            filter,
            page,
            size,


        },
        nextOption: {
            next: { tags: ['get-order'] }
        }
    })
    const orders = res.data?.result
    const meta = res.data?.meta
    return (
        <>

            <ManageOrder orders={orders} meta={meta} />
        </>
    )
}
export default ManageFactoryPage