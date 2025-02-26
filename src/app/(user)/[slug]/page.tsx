import DetailProduct from "@/component/layout/user/detail/detail.product"
import { sendRequest } from "@/utils/api"

export default async function Page({
    params,
}: {
    params: Promise<{ slug: number }>
}) {
    const slug = (await params).slug
    const res = await sendRequest<IBackendRes<IProduct>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/product/${slug}`, method: "GET",
        nextOption: {
            next: { tags: ['get-product-byid'] }
        },

    })
    const product = res.data
    return <DetailProduct product={product} />
}