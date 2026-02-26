import PageStatsBar from "../components/PageStatsBar";

export default function ExtensionsLibrary() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
                <h1 className="text-3xl font-display font-bold mb-2">Chrome Extensions</h1>
                <p className="text-muted-foreground">Browser extensions that supercharge your workflow.</p>
            </div>

            <PageStatsBar
                totalCount={0}
                newThisWeek={0}
                label="extensions"
            />

            <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-secondary/5">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center">
                    <span className="text-3xl">&#x1F9E9;</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Chrome Extensions Coming Soon</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    We're packaging powerful browser extensions for prompt injection,
                    content extraction, and automation. Stay tuned.
                </p>
            </div>
        </div>
    );
}
