import ResponsiveAppBar from "@/component/layout/header"

const UserLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            <div style={{ backgroundColor: "#f5f7fa" }}>
                <ResponsiveAppBar />
                {children}
            </div>
        </>
    )
}
export default UserLayout;