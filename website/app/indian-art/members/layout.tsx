import { Sidebar } from "@/components/indian-art/sidebar";

export default function MembersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex-1 flex w-full relative z-10">
            <Sidebar />
            <div className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto w-full max-w-[1400px] mx-auto">
                {children}
            </div>
        </div>
    );
}
