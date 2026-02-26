export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex-1 w-full flex justify-center py-16 px-4 md:px-8 overflow-y-auto">
            <div className="w-full max-w-3xl prose prose-neutral prose-headings:font-serif prose-headings:font-light prose-h1:text-5xl prose-h2:text-3xl prose-p:text-[#1C1C1A]/80 prose-p:font-light prose-p:leading-relaxed prose-a:text-[#C84C31] prose-a:no-underline hover:prose-a:underline">
                {children}
            </div>
        </div>
    );
}
