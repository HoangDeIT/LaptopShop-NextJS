import SlideShow from "@/component/layout/indexLayout/swiper";
import HomePage from "@/component/layout/user/index/home.page";
import { sendRequest } from "@/utils/api";
import { Dashboard } from "@mui/icons-material";

const HomePageSite = async (
    {
        searchParams,
    }: {
        searchParams: Promise<{ filter: string, page: number, size: number, sort: string }>
    }
) => {
    const page = (await searchParams).page
    const filter = (await searchParams).filter
    const res = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/product`, method: "GET",
        nextOption: {
            next: { tags: ['get-product'] }
        },
        queryParams: {
            size: 10,
            page,
            filter
        }
    })
    const resFactory = await sendRequest<IBackendRes<IModelPaginate<IFactory>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/factory`, method: "GET",
        nextOption: {
            next: { tags: ['get-factory'] }
        }
    })
    const data = res.data?.result
    const meta = res.data?.meta
    const factories = resFactory.data?.result
    return (
        <HomePage factories={factories} data={data} meta={meta} />
    )
}
export default HomePageSite;