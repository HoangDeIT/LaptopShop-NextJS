import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import CartPage from "@/component/layout/user/cart/cart.page";
import DetailProduct from "@/component/layout/user/detail/detail.product"
import { sendRequest } from "@/utils/api"
import { getServerSession } from "next-auth";

export default async function Page() {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<IUser>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user`, method: "GET",
        nextOption: {
            next: { tags: ['get-user'] }
        },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
    })
    const carts = res.data?.carts
    return <CartPage carts={carts} />
}