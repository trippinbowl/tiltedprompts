import Image from "next/image";

const features = [
    {
        title: "Shared AI Memory",
        description: "Persistent storage that allows all your AI agents to learn, adapt, and recall context across different sessions and platforms effortlessly.",
        image: "gond_memory_1772136213407.png" // We will update this with actual copied filenames
    },
    {
        title: "Voice Interfaces",
        description: "Next-gen speech recognition built directly into your workflow, allowing you to command and converse with your AI infra organically.",
        image: "gond_voice_1772136228224.png"
    },
    {
        title: "Developer Tooling",
        description: "A robust set of SDKs and unified APIs to construct your own custom AI pipelines without worrying about boilerplate.",
        image: "gond_tools_1772136245145.png"
    }
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-white border-y border-[#E28743]/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-sm font-mono tracking-widest uppercase text-[#C84C31] mb-4">Core Attributes</h2>
                    <h3 className="text-4xl font-serif text-[#1C1C1A]">Everything you need to scale AI</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-16">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="w-48 h-48 mb-8 relative rounded-full overflow-hidden border-2 border-[#FAF9F6] shadow-xl group-hover:scale-105 transition-transform duration-500">
                                {/* Fallback color if image doesn't load */}
                                <div className="absolute inset-0 bg-[#FAF9F6]" />
                                <Image
                                    src={`/indian-art-icons/${feature.image}`}
                                    alt={feature.title}
                                    fill
                                    className="object-cover relative z-10 mix-blend-multiply"
                                />
                            </div>
                            <h4 className="text-2xl font-serif text-[#1C1C1A] mb-4">{feature.title}</h4>
                            <p className="text-[#1C1C1A]/70 leading-relaxed font-light">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
