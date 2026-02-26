import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, Lock, Box, Workflow, Terminal, Cpu, Code2 } from 'lucide-react';
import PromptRenderer from './components/PromptRenderer';
import N8nRenderer from './components/N8nRenderer';
import SkillRenderer from './components/SkillRenderer';
import UpgradeButton from '../components/UpgradeButton';

export const revalidate = 0;

export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const supabase = await createClient();

    // 1. Fetch the asset from the DB
    const { data: asset, error: assetError } = await supabase
        .from('library_assets')
        .select('*')
        .eq('id', resolvedParams.id)
        .single();

    if (assetError || !asset) {
        notFound();
    }

    // 2. Fetch User Profile to check access level
    const { data: authData } = await supabase.auth.getUser();

    // If no user, redirect to login
    if (!authData.user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('tier')
        .eq('id', authData.user.id)
        .single();

    const isPro = profile?.tier === 'pro' || profile?.tier === 'agency';
    const hasAccess = !asset.is_premium || isPro;

    let categoryColor = "text-primary border-primary";
    let categoryBg = "bg-primary/10";
    let Icon = Box;

    switch (asset.asset_type) {
        case 'prompt_bundle':
            categoryColor = "text-blue-500 border-blue-500";
            categoryBg = "bg-blue-500/10";
            Icon = Box;
            break;
        case 'n8n_workflow':
            categoryColor = "text-orange-500 border-orange-500";
            categoryBg = "bg-orange-500/10";
            Icon = Workflow;
            break;
        case 'openclaw_skill':
            categoryColor = "text-emerald-500 border-emerald-500";
            categoryBg = "bg-emerald-500/10";
            Icon = Terminal;
            break;
        case 'gpt_config':
        case 'voice_agent':
            categoryColor = "text-purple-500 border-purple-500";
            categoryBg = "bg-purple-500/10";
            Icon = Cpu;
            break;
        case 'code_template':
            categoryColor = "text-cyan-500 border-cyan-500";
            categoryBg = "bg-cyan-500/10";
            Icon = Code2;
            break;
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pt-4 text-white">

            {/* Header Area */}
            <Link
                href="/members"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10 border border-white rounded-xl mb-10 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Back to {asset.asset_type === 'prompt_bundle' ? 'Prompts' : 'Library'}
            </Link>

            <div className="mb-12">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    {asset.platform && asset.platform.map((p: string) => (
                        <div key={p} className="px-3.5 py-1 rounded-full border-2 border-white text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 fill-white text-white" /> {p}
                        </div>
                    ))}
                    {asset.is_premium && (
                        <div className="px-3.5 py-1 rounded-full bg-yellow-500/20 text-yellow-500 border-2 border-yellow-500/50 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" /> Premium
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-4xl sm:text-5xl font-display font-black text-white leading-tight tracking-tight">
                        {asset.title}
                    </h1>
                </div>

                <div className="flex items-center text-sm font-semibold text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    Created {new Date(asset.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} by {asset.author || 'TiltedPrompts Team'}
                </div>
            </div>

            <hr className="border-[#2a2a2a] mb-12" />

            {/* Access Gate */}
            {!hasAccess ? (
                <div className="p-12 border border-border border-dashed rounded-3xl bg-secondary/5 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                        <Lock className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">This is a Premium Asset</h2>
                    <p className="text-muted-foreground mb-8 max-w-lg">
                        Upgrade your account to the Pro tier to unlock this {asset.asset_type.replace('_', ' ')} and gain access to our entire library of automations.
                    </p>
                    <UpgradeButton />
                </div>
            ) : (
                /* The Dynamic Renderer Content */
                <div className="content-renderer">
                    {asset.asset_type === 'prompt_bundle' && <PromptRenderer content={asset.content} />}
                    {asset.asset_type === 'n8n_workflow' && <N8nRenderer content={asset.content} />}
                    {asset.asset_type === 'openclaw_skill' && <SkillRenderer content={asset.content} />}

                    {/* Fallback for unknown asset types */}
                    {!['prompt_bundle', 'n8n_workflow', 'openclaw_skill'].includes(asset.asset_type) && (
                        <div className="p-6 bg-secondary/10 border border-border rounded-xl">
                            <pre className="text-sm font-mono overflow-auto">{JSON.stringify(asset.content, null, 2)}</pre>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
