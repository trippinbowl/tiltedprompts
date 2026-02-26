import { Search } from "lucide-react";
import { createClient } from '@/utils/supabase/server';
import AssetCard from "./components/AssetCard";
import DashboardStats, { buildCategoryStats } from "./components/DashboardStats";
import InteractiveAssetGrid from "./components/InteractiveAssetGrid";

export const revalidate = 0; // Ensure data is always fresh in development

export default async function MembersDashboard() {
    const supabase = await createClient();

    // Date 7 days ago for "new this week" counts
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekAgoISO = oneWeekAgo.toISOString();

    // Fetch the 6 most recent library assets for the Hub
    const { data: assets, error } = await supabase
        .from('library_assets')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

    // Fetch counts per category — total and new this week
    const [
        { count: promptsTotal },
        { count: promptsNew },
        { count: skillsTotal },
        { count: skillsNew },
        { count: workflowsTotal },
        { count: workflowsNew },
        { count: agentsTotal },
        { count: agentsNew },
        { count: codeTotal },
        { count: codeNew },
    ] = await Promise.all([
        supabase.from('library_assets').select('*', { count: 'exact', head: true }).eq('asset_type', 'prompt_bundle'),
        supabase.from('library_assets').select('*', { count: 'exact', head: true }).eq('asset_type', 'prompt_bundle').gte('created_at', weekAgoISO),
        supabase.from('library_assets').select('*', { count: 'exact', head: true }).eq('asset_type', 'openclaw_skill'),
        supabase.from('library_assets').select('*', { count: 'exact', head: true }).eq('asset_type', 'openclaw_skill').gte('created_at', weekAgoISO),
        supabase.from('library_assets').select('*', { count: 'exact', head: true }).eq('asset_type', 'n8n_workflow'),
        supabase.from('library_assets').select('*', { count: 'exact', head: true }).eq('asset_type', 'n8n_workflow').gte('created_at', weekAgoISO),
        supabase.from('library_assets').select('*', { count: 'exact', head: true }).in('asset_type', ['gpt_config', 'voice_agent']),
        supabase.from('library_assets').select('*', { count: 'exact', head: true }).in('asset_type', ['gpt_config', 'voice_agent']).gte('created_at', weekAgoISO),
        supabase.from('library_assets').select('*', { count: 'exact', head: true }).eq('asset_type', 'code_template'),
        supabase.from('library_assets').select('*', { count: 'exact', head: true }).eq('asset_type', 'code_template').gte('created_at', weekAgoISO),
    ]);

    const categoryStats = buildCategoryStats({
        prompts: promptsTotal ?? 0,
        promptsNew: promptsNew ?? 0,
        skills: skillsTotal ?? 0,
        skillsNew: skillsNew ?? 0,
        workflows: workflowsTotal ?? 0,
        workflowsNew: workflowsNew ?? 0,
        agents: agentsTotal ?? 0,
        agentsNew: agentsNew ?? 0,
        code: codeTotal ?? 0,
        codeNew: codeNew ?? 0,
    });

    const displayAssets = assets && assets.length > 0 ? assets : [];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
                <h1 className="text-3xl font-display font-bold mb-2 text-black dark:text-white">Dashboard Hub</h1>
                <p className="text-muted-foreground">Welcome back. Here are the newest additions to the catalog across all categories.</p>
            </div>

            {/* Category stats overview */}
            <DashboardStats stats={categoryStats} />

            {/* Interactive Search and Asset Grid */}
            {!error && displayAssets.length > 0 && (
                <InteractiveAssetGrid initialAssets={displayAssets} />
            )}
        </div >
    );
}
