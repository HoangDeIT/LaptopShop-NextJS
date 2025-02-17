import ResponsiveAppBar from "@/component/layout/header"

const UserLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <>
            <ResponsiveAppBar />
            {children}
        </>
    )
}
export default UserLayout;