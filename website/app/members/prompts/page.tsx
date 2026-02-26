import { createClient } from '@/utils/supabase/server';
import AssetCard from "../components/AssetCard";
import PageStatsBar from "../components/PageStatsBar";

export const revalidate = 0;

export default async function PromptsLibrary() {
    const supabase = await createClient();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekAgoISO = oneWeekAgo.toISOString();

    // Fetch prompt bundles + counts in parallel
    const [
        { data: assets, error },
        { count: totalCount },
        { count: newCount },
    ] = await Promise.all([
        supabase
            .from('library_assets')
            .select('*')
            .eq('asset_type', 'prompt_bundle')
            .order('created_at', { ascending: false }),
        supabase
            .from('library_assets')
            .select('*', { count: 'exact', head: true })
            .eq('asset_type', 'prompt_bundle'),
        supabase
            .from('library_assets')
            .select('*', { count: 'exact', head: true })
            .eq('asset_type', 'prompt_bundle')
            .gte('created_at', weekAgoISO),
    ]);

    const displayAssets = assets && assets.length > 0 ? assets : [];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
                <h1 className="text-3xl font-display font-bold mb-2">Prompts Library</h1>
                <p className="text-muted-foreground">Expertly crafted marketing copy, strategies, and meta-prompts.</p>
            </div>

            <PageStatsBar
                totalCount={totalCount ?? 0}
                newThisWeek={newCount ?? 0}
                label="prompts"
            />

            {error && (
                <div className="p-4 mb-6 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl">
                    Error loading prompts: {error.message}
                </div>
            )}

            {!error && displayAssets.length === 0 && (
                <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-secondary/5">
                    <h3 className="text-xl font-bold mb-2">No Prompts Found</h3>
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
