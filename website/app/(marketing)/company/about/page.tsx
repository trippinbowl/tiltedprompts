import { Building2, Code, Zap } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-display font-black mb-8 text-center">
                    Our <span className="text-primary">Thesis</span>
                </h1>

                <div className="prose prose-invert prose-lg mx-auto mb-20 text-muted-foreground">
                    <p className="lead text-2xl font-light text-foreground mb-8">
                        AI-assisted development has created a new class of builder—technical directors who orchestrate autonomous agents to ship software at unprecedented velocity.
                    </p>
                    <p>
                        These builders need hardened infrastructure, not prototypes. TiltedPrompts exists to serve them. We are a product-led AI agency built for the builder economy. The company operates at the intersection of AI infrastructure and developer tooling, delivering production-grade products that compress the distance between human intent and functional architecture.
                    </p>
                    <p>
                        Reference implementations are for learning. TiltedPrompts ships tools for deploying. Agentic systems should behave like agentic systems, and they need a foundation that is engineered for autonomy, not manual human meddling.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-8 border border-border rounded-3xl bg-secondary/20">
                        <Building2 className="w-8 h-8 mx-auto mb-4 text-primary" />
                        <h3 className="font-bold text-xl mb-2">Builder-First</h3>
                        <p className="text-muted-foreground text-sm">Every product decision filters through one question: does this make the builder faster?</p>
                    </div>
                    <div className="p-8 border border-border rounded-3xl bg-secondary/20">
                        <ShieldCheck className="w-8 h-8 mx-auto mb-4 text-accent" />
                        <h3 className="font-bold text-xl mb-2">Production-Grade</h3>
                        <p className="text-muted-foreground text-sm">We don't ship toys. We ship benchmarked, hardened infrastructure.</p>
                    </div>
                    <div className="p-8 border border-border rounded-3xl bg-secondary/20">
                        <Zap className="w-8 h-8 mx-auto mb-4 text-accent-2" />
                        <h3 className="font-bold text-xl mb-2">Autonomous Arch.</h3>
                        <p className="text-muted-foreground text-sm">Systems designed to operate with minimal human intervention once configured.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Ensure lucide icon is correct
import { ShieldCheck } from "lucide-react";
