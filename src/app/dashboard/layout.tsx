import Navbar from "./Navbar/page";
import NavBarItem from "./Navbar/topNavbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section>
            <div className=" sticky top-0 z-50  flex justify-between">
                <div className="xl:w-60 "> <Navbar />  </div>
                <div className="w-screen sticky top-0 z-50"> <NavBarItem />{children} </div>
            </div>
        </section>
    )
}