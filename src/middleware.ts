
import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: "/login"
    },
    callbacks: {
        authorized({ req, token }) {
            // Nếu không có token, tức người dùng chưa đăng nhập
            if (!token?.access_token) return false;

            const { pathname } = req.nextUrl;

            // Nếu truy cập trang admin, chỉ cho phép người dùng có role ADMIN
            if (pathname.startsWith("/admin")) {
                return token.user.role === "ADMIN";
            }

            // Nếu truy cập trang product, cho phép cả ADMIN và USER
            if (pathname.startsWith("/product")) {
                return token.user.role === "ADMIN" || token.user.role === "USER";
            }

            // Các trang khác cho phép truy cập nếu đã đăng nhập
            return true;
        },
    },
}
)


export const config = {
    matcher: ["/admin/:path*", "/product/:path*"],
};
