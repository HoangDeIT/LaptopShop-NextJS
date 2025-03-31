import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import ManageUser from "@/component/layout/admin/user/manage.user";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
const ManageUserPage = async (
    {
        searchParams,
    }: {
        searchParams: Promise<{ filter: string, page: number, size: number, sort: string }>
    }
) => {
    const filter = (await searchParams).filter;
    let page = (await searchParams).page;
    const sort = (await searchParams).sort;
    let size = (await searchParams).size;
    size = Number(size)
    if (size !== 10 && size !== 25 && size !== 50 && size !== 100) {
        size = 25
    }
    if (page == null) {
        page = 1
    }
    console.log("this is server side")
    const queryString = { page, size, filter, sort };
    const session = await getServerSession(authOptions);
    const res = await sendRequest<IBackendRes<IModelPaginate<IUser>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/user`, method: "GET",
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['get-user'] }
        }, queryParams:
            queryString

    })

    const meta = res.data?.meta
    const user = res.data?.result
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <ManageUser meta={meta} user={user} />
            </Suspense>
        </>
    )
}
export default ManageUserPage