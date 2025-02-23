import Dashboard from "./dashboard"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Dashboard>{children}</Dashboard>
    )
}