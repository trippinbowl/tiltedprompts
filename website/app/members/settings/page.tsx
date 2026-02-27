import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { User, Mail, ShieldAlert, Sparkles, Upload, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import UpgradeButton from "../assets/components/UpgradeButton";

export const revalidate = 0; // Fresh fetch every time

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch the tier from the profiles table
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    const isPro = profile?.tier === 'pro' || profile?.tier === 'agency';

    return (
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold mb-2 text-foreground">Settings & Profile</h1>
                <p className="text-muted-foreground">Manage your account preferences, billing, and profile details.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="col-span-1 lg:col-span-2 space-y-8">
                    {/* General Info */}
                    <div className="p-6 md:p-8 rounded-2xl border border-border/50 bg-background shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-surface border-2 border-primary/20 flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:border-primary/50 transition-colors group relative overflow-hidden">
                                    <span className="font-bold text-xl group-hover:opacity-0 transition-opacity text-foreground">
                                        {user.email?.substring(0, 2).toUpperCase()}
                                    </span>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Upload className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-foreground mb-1">Profile Picture</h3>
                                    <p className="text-xs text-muted-foreground mb-3">JPG, GIF or PNG. 1MB max.</p>
                                    <button className="text-xs font-semibold px-3 py-1.5 rounded-md bg-secondary/50 hover:bg-secondary text-foreground transition-colors border border-border/50">
                                        Upload Image
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Jon Doe"
                                        className="w-full px-4 py-2 bg-surface border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="w-full pl-9 pr-4 py-2 bg-white/[0.02] border border-border/50 rounded-lg text-sm text-muted-foreground cursor-not-allowed opacity-70"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-sm">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Email Preferences */}
                    <div className="p-6 md:p-8 rounded-2xl border border-border/50 bg-background shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText className="w-5 h-5 text-purple-400" />
                            <h2 className="text-lg font-semibold text-foreground">Email Preferences</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: "Product Updates", desc: "Receive news about the latest features and updates." },
                                { title: "Weekly Newsletters", desc: "Get curated AI news, new prompts, and agency tips." },
                                { title: "Billing & Account", desc: "Important notifications regarding your subscription (cannot be disabled)." }
                            ].map((pref, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.04] bg-surface/30">
                                    <div className="max-w-[80%]">
                                        <p className="text-sm font-medium text-foreground">{pref.title}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{pref.desc}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={i !== 1} disabled={i === 2} />
                                        <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary opacity-90 peer-disabled:opacity-50"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="p-6 md:p-8 rounded-2xl border border-red-500/20 bg-background shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldAlert className="w-5 h-5 text-red-500" />
                            <h2 className="text-lg font-semibold text-red-500">Danger Zone</h2>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6">
                            Permanently delete your account and all associated data. This action cannot be undone. You will immediately lose access to all premium tier assets if subscribed.
                        </p>
                        <button className="px-5 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white text-sm font-semibold rounded-lg transition-all">
                            Delete Account
                        </button>
                    </div>

                </div>

                {/* Right Sidebar - Billing / Pro Tier */}
                <div className="col-span-1 space-y-6">
                    <div className={`p-6 rounded-2xl border shadow-sm relative overflow-hidden ${isPro ? 'bg-gradient-to-b from-purple-500/10 to-transparent border-purple-500/30' : 'bg-surface/50 border-border/50'}`}>
                        {/* Shimmer effect for pro highlight */}
                        {!isPro && <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent bg-[length:200%_auto]" />}

                        <div className="flex gap-3 mb-4 items-center">
                            <Sparkles className={`w-6 h-6 ${isPro ? 'text-purple-400' : 'text-muted-foreground'}`} />
                            <h2 className="text-lg font-bold text-foreground">
                                {isPro ? 'Pro Subscription' : 'Upgrade to Pro'}
                            </h2>
                        </div>

                        {isPro ? (
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    You are currently on the <strong className="text-purple-400">Pro Tier</strong>. You have unlimited access to all premium assets, prompts, and code templates.
                                </p>
                                <div className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.06] flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground block">Status</span>
                                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">Active</span>
                                </div>
                                <button className="w-full py-2.5 text-xs font-semibold text-muted-foreground border border-white/[0.08] hover:bg-white/[0.03] hover:text-foreground rounded-lg transition-all">
                                    Manage Billing
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6 relative z-10">
                                <p className="text-sm text-foreground leading-relaxed">
                                    Unlock the full potential of your AI agency. Skip the wait and get instant access.
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        "Unlimited Premium Prompts",
                                        "Advanced OpenClaw Skills",
                                        "Prioritized Voice Synthesis",
                                        "Commercial Use Rights"
                                    ].map((feat, idx) => (
                                        <li key={idx} className="flex gap-2 items-center text-sm text-muted-foreground">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                                <div className="pt-2">
                                    {/* Piggybacking the existing Razorpay/Stripe Upgrade button here */}
                                    <UpgradeButton />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
