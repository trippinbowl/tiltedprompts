import { createClient } from '@/utils/supabase/server';
import AssetCard from "../components/AssetCard";
import PageStatsBar from "../components/PageStatsBar";

export const revalidate = 0;

export default async function AgentsLibrary() {
    const supabase = await createClient();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekAgoISO = oneWeekAgo.toISOString();

    const [
        { data: assets, error },
        { count: totalCount },
        { count: newCount },
    ] = await Promise.all([
        supabase
            .from('library_assets')
            .select('*')
            .in('asset_type', ['gpt_config', 'voice_agent'])
            .order('created_at', { ascending: false }),
        supabase
            .from('library_assets')
            .select('*', { count: 'exact', head: true })
            .in('asset_type', ['gpt_config', 'voice_agent']),
        supabase
            .from('library_assets')
            .select('*', { count: 'exact', head: true })
            .in('asset_type', ['gpt_config', 'voice_agent'])
            .gte('created_at', weekAgoISO),
    ]);

    const displayAssets = assets && assets.length > 0 ? assets : [];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
                <h1 className="text-3xl font-display font-bold mb-2">AI Agents</h1>
                <p className="text-muted-foreground">Pre-configured GPT configs, voice agents, and custom AI personalities.</p>
            </div>

            <PageStatsBar
                totalCount={totalCount ?? 0}
                newThisWeek={newCount ?? 0}
                label="agents"
            />

            {error && (
                <div className="p-4 mb-6 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl">
                    Error loading agents: {error.message}
                </div>
            )}

            {!error && displayAssets.length === 0 && (
                <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-secondary/5">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <span className="text-3xl">&#x1F916;</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">AI Agents Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        We're building pre-configured GPT agents and voice AI systems.
                        Check back soon or upgrade to Pro to get early access.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayAssets.map((asset) => (
                    <AssetCard key={asset.id} asset={asset} />
                ))}
            </div>
        </div>
    );
}
