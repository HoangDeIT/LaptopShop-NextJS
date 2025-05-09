import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import ManageFactory from "@/component/layout/admin/factory/manage.factory";
import ManageProduct from "@/component/layout/admin/product/manage.product";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
const ManageProductPage = async (
    { searchParams }: { searchParams: Promise<{ filter: string, page: number, size: number, sort: string }> }
) => {
    const session = await getServerSession(authOptions);
    const { filter, page, size, sort } = await searchParams
    const res = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/product`, method: "GET",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        queryParams: {
            filter,
            page,
            size,
            sort
        },
        nextOption: {
            next: { tags: ['get-product'] }
        }
    })
    const resFactory = await sendRequest<IBackendRes<IModelPaginate<IFactory>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/factory`, method: "GET",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['get-factory'] }
        }
    })
    const data = res.data?.result
    const meta = res.data?.meta
    const factories = resFactory.data?.result

    return (
        <>
            <ManageProduct products={data} meta={meta} factories={factories} />

        </>
    )
}
export default ManageProductPage