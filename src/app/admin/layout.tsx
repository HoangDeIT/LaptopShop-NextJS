import SideBar from "@/component/layout/admin/sidebar";

const AdminLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    return (
        <>
            <SideBar>

                {children}
            </SideBar>
        </>
    )
}
export default AdminLayout;