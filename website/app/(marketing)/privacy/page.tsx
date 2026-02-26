export default function PrivacyPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 bg-background">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight mb-4">Privacy Policy</h1>
                    <p className="text-muted-foreground">Last updated: February 27, 2026</p>
                </div>

                <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-headings:text-foreground">
                    <div className="p-6 mb-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 not-prose">
                        <h2 className="text-xl font-bold text-emerald-400 mb-2">The Local-First Guarantee</h2>
                        <p className="text-emerald-400/80 leading-relaxed">
                            For users of the <strong>TiltedVoice</strong> Desktop Application: Your audio data never leaves your device. We use faster-whisper to process all speech-to-text directly on your local CPU or GPU. We do not store, transit, analyze, or have any access to what you dictate.
                        </p>
                    </div>

                    <h2>1. Information We Collect</h2>
                    <p>
                        We only collect information that you explicitly provide to us when creating an account for our cloud-based tools (TiltedMCP, the Laboratory integrations). This includes:
                    </p>
                    <ul>
                        <li>Account information (email address, password)</li>
                        <li>Payment information (processed securely via Stripe)</li>
                        <li>Technical support inquiries</li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to operate our cloud services, process transactions, send necessary account notifications, and improve our infrastructure. We do not sell your personal data to third parties.
                    </p>

                    <h2>3. TiltedVani and Third-Party Providers</h2>
                    <p>
                        If you utilize <strong>TiltedVani</strong> (our Hindi transcription service), audio bytes are sent to our infrastructure and processed via our partners (e.g., Sarvam AI). In these specific cloud-assisted workflows, audio is processed ephemerally to generate the Devanagari output and is not stored for training purposes without explicit opt-in.
                    </p>

                    <h2>4. Data Security</h2>
                    <p>
                        We implement strict, industry-standard security measures (including end-to-end encryption for API transit and secure Supabase database instances) to maintain the safety of your personal information.
                    </p>

                    <h2>5. Your Rights</h2>
                    <p>
                        You have the right to access, correct, or delete your personal data at any time through your dashboard. If you wish to completely wipe your account from our servers, you may request account deletion at any time.
                    </p>

                    <hr className="my-12 border-border" />
                    <p className="text-sm">
                        If you have any questions about this Privacy Policy or our Local-First Guarantee, please contact us at privacy@tiltedprompts.com
                    </p>
                </div>
            </div>
        </div>
    );
}
