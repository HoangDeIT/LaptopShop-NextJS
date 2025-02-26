export { }

declare global {

    interface IRequest {
        url: string;
        method: string;
        body?: { [key: string]: any } | FormData;
        queryParams?: any;
        useCredentials?: boolean;
        headers?: any;
        nextOption?: any;
    }

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            page: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }
    interface IRegister {

        id: number,
        userName: string,
        address: string,
        email: string,
        createdAt: string,
        createdBy: string

    }
    interface IUser {
        id: number;
        userName: string;       // Ví dụ: Admin
        email: string;          // Ví dụ: hoangde@gmail.com
        role: 'ADMIN' | 'USER'; // Nếu chỉ có 2 loại role, nếu nhiều hơn bạn có thể dùng string
        type: 'SYSTEM' | 'GOOGLE' | 'GITHUB'; // Giới hạn các giá trị hợp lệ, hoặc dùng string
        image: string | null;   // Nếu không có hình thì null
        createdAt: string;      // Ví dụ: 2025-02-13T15:10:11.109666Z
        updatedAt: string | null;
        createdBy: string;      // Ví dụ: Admin
        updatedBy: string | null;
        carts: ICart[]
    }
    interface IMeta {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    }
    interface IFactory {
        id: number,
        name: string,
        image: string,
        country: string,
        products: [],
        createdAt: string,
        updatedAt: string,
        createdBy: string,
        updatedBy: string,
        // deleted: false,
        // deletedAt: null
    }
    interface IProductImage {
        id: number;
        image: string;
        createdAt: string | null;
        updatedAt: string | null;
        createdBy: string | null;
        updatedBy: string | null;
        deleted: boolean;
        deletedAt: string | null;
    }

    interface IFactory {
        id: number;
        name: string;
        image: string;
        country: string;
        products: IProduct[];
        createdAt: string;
        updatedAt: string;
        createdBy: string;
        updatedBy: string;
        deleted: boolean;
        deletedAt: string | null;
    }

    interface IProduct {
        id: number;
        name: string;
        price: number;
        images: IProductImage[];
        mainImage: string;
        detailDesc: string;
        shortDesc: string;
        quantity: number;
        sold: number;
        factory: IFactory;
        type: string;
        cpu: string;
        rom: number;
        ram: number;
        screen: number;
        os: string;
        gpu: string;
        createdAt: string | null;
        updatedAt: string | null;
        createdBy: string | null;
        updatedBy: string | null;
        deleted: boolean;
        deletedAt: string | null;
    }

    interface ICart {
        id: number;
        quantity: number;
        product: IProduct;
    }
}