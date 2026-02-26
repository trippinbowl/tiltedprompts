/**
 * TiltedPrompts – Content Script
 *
 * Injected into WhatsApp Web, Gmail, LinkedIn, Instagram, Google Docs.
 * Adds a small floating button that opens a prompt picker overlay.
 */

(() => {
    // Avoid double injection
    if (document.getElementById("tp-fab")) return;

    const FREE_PROMPTS = [
        {
            title: "Instagram Reel Hook",
            text: "Generate 5 scroll-stopping opening hooks for a Reel about [TOPIC]. Each under 10 words, using curiosity or shock value, natural in Indian English/Hinglish.",
        },
        {
            title: "WhatsApp Sale Message",
            text: "Write a WhatsApp broadcast message for [BRAND]'s flash sale on [CATEGORY]. [X]% off for [DURATION]. Friendly greeting, urgency, CTA with [LINK]. Under 150 words.",
        },
        {
            title: "Follow-up Email",
            text: "Write a follow-up email from [BRAND] to a lead who hasn't bought [PRODUCT]. Value reminder, address one objection, soft CTA. Under 100 words.",
        },
        {
            title: "LinkedIn Post",
            text: "Write a LinkedIn post for [COMPANY] sharing [INSIGHT/MILESTONE]. Hook line, 3-4 short paragraphs, soft CTA, 3-5 hashtags. Knowledgeable but approachable. Under 200 words.",
        },
        {
            title: "Product Description",
            text: "Write a product description for [PRODUCT] on [PLATFORM]. Benefit-driven title, 5 bullet points with features AND benefits, SEO paragraph, 5 keywords. Indian buyer context.",
        },
    ];

    // ---- Create FAB Button ----
    const fab = document.createElement("div");
    fab.id = "tp-fab";
    fab.innerHTML = "⚡";
    fab.title = "TiltedPrompts – Quick Prompts";
    document.body.appendChild(fab);

    // ---- Create Overlay ----
    const overlay = document.createElement("div");
    overlay.id = "tp-overlay";
    overlay.classList.add("tp-hidden");

    overlay.innerHTML = `
    <div class="tp-panel">
      <div class="tp-panel-header">
        <span class="tp-panel-title">⚡ tiltedprompts</span>
        <button class="tp-close-btn">✕</button>
      </div>
      <div class="tp-prompt-list">
        ${FREE_PROMPTS.map((p, i) => `
          <div class="tp-prompt-card" data-index="${i}">
            <div class="tp-prompt-name">${p.title}</div>
            <div class="tp-prompt-preview">${p.text.substring(0, 60)}...</div>
          </div>
        `).join("")}
      </div>
      <div class="tp-footer">
        <a href="https://tiltedprompts.gumroad.com" target="_blank">Get full prompt packs →</a>
      </div>
    </div>
  `;
    document.body.appendChild(overlay);

    // ---- Event Handlers ----
    fab.addEventListener("click", () => {
        overlay.classList.toggle("tp-hidden");
    });

    overlay.querySelector(".tp-close-btn").addEventListener("click", () => {
        overlay.classList.add("tp-hidden");
    });

    overlay.querySelectorAll(".tp-prompt-card").forEach((card) => {
        card.addEventListener("click", () => {
            const idx = parseInt(card.dataset.index);
            const prompt = FREE_PROMPTS[idx];

            // Copy to clipboard
            navigator.clipboard.writeText(prompt.text).then(() => {
                card.style.borderColor = "#00b894";
                card.querySelector(".tp-prompt-preview").textContent = "✅ Copied to clipboard!";
                setTimeout(() => {
                    card.style.borderColor = "transparent";
                    card.querySelector(".tp-prompt-preview").textContent = prompt.text.substring(0, 60) + "...";
                }, 2000);
            });

            // Also try to insert into active textarea
            const activeEl = document.activeElement;
            if (activeEl && (activeEl.tagName === "TEXTAREA" || activeEl.contentEditable === "true" || activeEl.tagName === "INPUT")) {
                if (activeEl.tagName === "TEXTAREA" || activeEl.tagName === "INPUT") {
                    activeEl.value = prompt.text;
                    activeEl.dispatchEvent(new Event("input", { bubbles: true }));
                } else {
                    activeEl.textContent = prompt.text;
                    activeEl.dispatchEvent(new Event("input", { bubbles: true }));
                }
            }
        });
    });
})();
