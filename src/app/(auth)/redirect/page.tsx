import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


const RedirectPage = async () => {
    const session = await getServerSession(authOptions);
    if (session?.access_token) {
        console.log(session)
        if (session.user.role === "ADMIN") {
            redirect("/admin");
        } else if (session.user.role === "USER") {
            redirect("/");
        } else {
            redirect("/login")
        }
    }
}
export default RedirectPage