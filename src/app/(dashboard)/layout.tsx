import { Sidebar, MobileSidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900">
                <Sidebar />
            </div>
            <main className="md:pl-72 pb-10">
                {/* Mobile Header */}
                <div className="flex items-center p-4 md:hidden border-b bg-background/50 backdrop-blur-sm sticky top-0 z-50">
                    <MobileSidebar />
                    <span className="font-bold ml-4">ElevenX</span>
                </div>
                {children}
            </main>
        </div>
    );
}
