import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import DetailProduct from "@/component/layout/user/detail/detail.product"
import OrderPage from "@/component/layout/user/order/order.page";
import TestOrder from "@/component/layout/user/order/test.order";
import { sendRequest } from "@/utils/api"
import { getServerSession } from "next-auth";

export default async function Page(
    { searchParams }: { searchParams: Promise<{ cartsId: number[], productId: number }> }
) {
    const session = await getServerSession(authOptions);
    const cartsID = (await searchParams).cartsId
    const productID = (await searchParams).productId
    let isCart = false
    console.log(productID)
    let res;
    if (cartsID || !productID) {
        res = await sendRequest<IBackendRes<ICart[]>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart/get-cart`, method: "GET",
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
            queryParams: {
                id: cartsID
            }
        })
        isCart = true
    } else {
        res = await sendRequest<IBackendRes<ICart[]>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart/buy-now`, method: "GET",

            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            }, queryParams: {
                productID: productID
            }
        })
    }

    const carts = res.data

    //  return <OrderPage carts={carts} />
    return <TestOrder cart={carts} isCart={isCart} />
}