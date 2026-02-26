"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import AssetCard from "./AssetCard";

export default function InteractiveAssetGrid({ initialAssets }: { initialAssets: any[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("Newest");
    const [priceFilter, setPriceFilter] = useState("All");

    const filteredAssets = useMemo(() => {
        let result = [...initialAssets];

        // 1. Search Filter
        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase();
            result = result.filter(asset =>
                asset.title.toLowerCase().includes(query) ||
                asset.description.toLowerCase().includes(query)
            );
        }

        // 2. Price Filter
        if (priceFilter === "Free (Open)") {
            result = result.filter(asset => !asset.is_premium);
        } else if (priceFilter === "Paid (Pro)") {
            result = result.filter(asset => asset.is_premium);
        }

        // 3. Sorting
        if (sortBy === "Bestseller" || sortBy === "Top Rated") {
            // Simulated sorting for placeholder UI since we don't have sales/ratings data
            result.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            // "Newest" is default, assuming initialAssets is already sorted by created_at desc
            // But we ensure it here just in case filtering messed up order
            result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }

        return result;
    }, [initialAssets, searchQuery, sortBy, priceFilter]);

    return (
        <>
            {/* Search and Filter */}
            <div className="flex flex-col xl:flex-row items-center gap-4 mb-8">
                <div className="relative flex-1 w-full max-w-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search prompts, workflows, and templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-secondary/30 focus:border-primary outline-none transition"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-border bg-secondary/30 outline-none transition focus:border-primary text-sm flex-1 sm:flex-none cursor-pointer"
                    >
                        <option>Newest</option>
                        <option>Bestseller</option>
                        <option>Top Rated</option>
                    </select>
                    <select
                        className="px-4 py-3 rounded-xl border border-border bg-secondary/30 outline-none transition focus:border-primary text-sm flex-1 sm:flex-none cursor-pointer"
                    >
                        <option>Region: All</option>
                        <option>Region: India (Local)</option>
                        <option>Region: Global</option>
                    </select>
                    <select
                        className="px-4 py-3 rounded-xl border border-border bg-secondary/30 outline-none transition focus:border-primary text-sm flex-1 sm:flex-none cursor-pointer"
                    >
                        <option>Language: All</option>
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Hinglish</option>
                    </select>
                    <select
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-border bg-secondary/30 outline-none transition focus:border-primary text-sm flex-1 sm:flex-none cursor-pointer"
                    >
                        <option>Price: All</option>
                        <option>Paid (Pro)</option>
                        <option>Free (Open)</option>
                    </select>
                </div>
            </div>

            {/* Empty State after Filtering */}
            {filteredAssets.length === 0 && (
                <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-secondary/5 mt-8">
                    <h3 className="text-xl font-bold mb-2">No matches found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your search or filters.</p>
                    <button
                        onClick={() => { setSearchQuery(""); setPriceFilter("All"); }}
                        className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Dynamic Resource Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssets.map((asset) => (
                    <AssetCard key={asset.id} asset={asset} />
                ))}
            </div>
        </>
    );
}
