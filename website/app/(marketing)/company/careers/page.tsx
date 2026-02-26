export default function CareersPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
            <h1 className="text-5xl md:text-7xl font-display font-black mb-6">Careers</h1>
            <p className="text-xl text-muted-foreground text-center max-w-2xl mb-8">
                We are a lean, capital-efficient, founder-led team. We hire contract specialists strictly when revenue justifies it. Check back later or follow us on X for open positions.
            </p>
            <div className="p-8 rounded-3xl border border-dashed border-border bg-secondary/20 text-center">
                <p className="font-mono text-sm text-muted-foreground">No open positions at this time. (0)</p>
            </div>
        </div>
    );
}
