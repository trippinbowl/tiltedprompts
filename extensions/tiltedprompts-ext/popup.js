/**
 * TiltedPrompts Chrome Extension – Popup Script
 *
 * Features:
 * - Fetch bundles from API or use built-in free prompts
 * - Search and filter prompts
 * - Copy to clipboard
 * - Pro license verification via Gumroad
 */

// ---- Built-in Free Prompts (always available, no API needed) ----
const FREE_PROMPTS = [
  {
    title: "Instagram Reel Hook Generator",
    description: "Creates scroll-stopping opening lines for Reels",
    prompt_text: "You are an Instagram content strategist for Indian D2C brands. Generate 5 scroll-stopping opening hooks for a Reel about [PRODUCT/TOPIC]. Each hook should be under 10 words, use curiosity or shock value, and feel natural in Indian English or Hinglish. Format: numbered list with the hook and a brief note on why it works.",
    use_case: "Creating Instagram Reels that grab attention in the first 1-2 seconds",
    tags: ["instagram", "social"]
  },
  {
    title: "WhatsApp Broadcast Sale Message",
    description: "Generate a personal, non-spammy sale announcement for WhatsApp",
    prompt_text: "Write a WhatsApp broadcast message for [BRAND NAME]'s flash sale on [PRODUCT CATEGORY]. The sale is [X]% off for [DURATION]. Include: a friendly greeting, urgency without being pushy, a clear CTA with a link placeholder [LINK], and 2-3 relevant emojis. Keep it under 150 words. Tone: like a friend sharing a genuine deal.",
    use_case: "Sending sale announcements via WhatsApp Business",
    tags: ["whatsapp", "sales"]
  },
  {
    title: "Sales Follow-up Email",
    description: "Write a warm follow-up email for leads who didn't convert",
    prompt_text: "Write a follow-up email from [BRAND] to a lead who [VISITED/DOWNLOADED/ATTENDED] but hasn't purchased [PRODUCT]. Include: a value reminder, address one common objection, and a soft CTA. Under 100 words, helpful tone. For Indian B2B/B2C context.",
    use_case: "Converting warm leads to customers with email follow-ups",
    tags: ["email", "sales"]
  }
];

// ---- State ----
let state = {
  apiUrl: "http://localhost:5000",
  licenseKey: "",
  isPro: false,
  allPrompts: [...FREE_PROMPTS],
  filteredPrompts: [...FREE_PROMPTS],
  bundles: [],
};

// ---- DOM Elements ----
const elements = {};

document.addEventListener("DOMContentLoaded", async () => {
  // Cache DOM elements
  elements.bundleList = document.getElementById("bundleList");
  elements.promptDetail = document.getElementById("promptDetail");
  elements.searchInput = document.getElementById("searchInput");
  elements.categoryFilter = document.getElementById("categoryFilter");
  elements.settingsPanel = document.getElementById("settingsPanel");
  elements.apiUrl = document.getElementById("apiUrl");
  elements.licenseKey = document.getElementById("licenseKey");
  elements.licenseStatus = document.getElementById("licenseStatus");
  elements.proStatus = document.getElementById("proStatus");

  // Load saved settings
  const saved = await chrome.storage.local.get(["apiUrl", "licenseKey", "isPro"]);
  if (saved.apiUrl) state.apiUrl = saved.apiUrl;
  if (saved.licenseKey) state.licenseKey = saved.licenseKey;
  if (saved.isPro) state.isPro = saved.isPro;

  elements.apiUrl.value = state.apiUrl;
  elements.licenseKey.value = state.licenseKey;
  if (state.isPro) elements.proStatus.classList.remove("hidden");

  // Event listeners
  document.getElementById("settingsBtn").addEventListener("click", toggleSettings);
  document.getElementById("saveSettings").addEventListener("click", saveSettings);
  document.getElementById("verifyLicense").addEventListener("click", verifyLicense);
  document.getElementById("refreshBtn").addEventListener("click", loadBundles);
  document.getElementById("backBtn").addEventListener("click", showList);
  document.getElementById("copyBtn").addEventListener("click", copyPrompt);
  elements.searchInput.addEventListener("input", filterPrompts);
  elements.categoryFilter.addEventListener("change", filterPrompts);

  // Load bundles
  await loadBundles();
});

// ---- Settings ----
function toggleSettings() {
  elements.settingsPanel.classList.toggle("hidden");
}

async function saveSettings() {
  state.apiUrl = elements.apiUrl.value.trim() || "http://localhost:5000";
  state.licenseKey = elements.licenseKey.value.trim();
  await chrome.storage.local.set({ apiUrl: state.apiUrl, licenseKey: state.licenseKey });
  elements.settingsPanel.classList.add("hidden");
  loadBundles();
}

async function verifyLicense() {
  const key = elements.licenseKey.value.trim();
  if (!key) {
    elements.licenseStatus.textContent = "❌ Enter a license key first";
    elements.licenseStatus.style.color = "#ef4444";
    return;
  }

  elements.licenseStatus.textContent = "Verifying...";
  elements.licenseStatus.style.color = "#94a3b8";

  try {
    const resp = await fetch(`${state.apiUrl}/verify-license`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ license_key: key }),
    });
    const data = await resp.json();

    if (data.valid) {
      state.isPro = true;
      await chrome.storage.local.set({ isPro: true, licenseKey: key });
      elements.licenseStatus.textContent = "✅ Pro unlocked!";
      elements.licenseStatus.style.color = "#00b894";
      elements.proStatus.classList.remove("hidden");
      loadBundles();
    } else {
      elements.licenseStatus.textContent = `❌ ${data.error || "Invalid license"}`;
      elements.licenseStatus.style.color = "#ef4444";
    }
  } catch (e) {
    elements.licenseStatus.textContent = "❌ Could not reach verification server";
    elements.licenseStatus.style.color = "#ef4444";
  }
}

// ---- Load Bundles ----
async function loadBundles() {
  elements.bundleList.innerHTML = '<div class="loading">Loading prompts...</div>';

  // Always start with free prompts
  state.allPrompts = [...FREE_PROMPTS];

  // Try fetching from API
  try {
    const resp = await fetch(`${state.apiUrl}/bundles`);
    const data = await resp.json();

    if (data.bundles && data.bundles.length > 0) {
      state.bundles = data.bundles;

      // Fetch full prompts from each bundle
      for (const bundle of data.bundles) {
        try {
          const bResp = await fetch(`${state.apiUrl}/bundles/${bundle.folder}`);
          const bData = await bResp.json();

          if (bData.bundle && bData.bundle.prompts) {
            const prompts = bData.bundle.prompts.map((p) => ({
              ...p,
              tags: bData.bundle.packaging?.tags || [],
              bundleName: bData.bundle.packaging?.product_name || bundle.product_name,
              isProOnly: !state.isPro, // Lock API prompts unless Pro
            }));

            if (state.isPro) {
              state.allPrompts.push(...prompts);
            }
          }
        } catch (_) { /* skip individual bundle errors */ }
      }
    }
  } catch (_) {
    // API not available, use free prompts only
  }

  state.filteredPrompts = [...state.allPrompts];
  renderPromptList();
}

// ---- Render ----
function renderPromptList() {
  if (state.filteredPrompts.length === 0) {
    elements.bundleList.innerHTML = `
      <div class="empty-state">
        <div class="emoji">🔍</div>
        <p>No prompts found</p>
      </div>`;
    return;
  }

  elements.bundleList.innerHTML = state.filteredPrompts.map((p, i) => `
    <div class="prompt-item" data-index="${i}">
      <div class="p-title">${p.isProOnly ? "🔒 " : ""}${escapeHtml(p.title)}</div>
      <div class="p-usecase">${escapeHtml(p.use_case || "")}</div>
      <div class="meta" style="margin-top: 6px;">
        ${(p.tags || []).slice(0, 3).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
      </div>
    </div>
  `).join("");

  // Add click listeners
  elements.bundleList.querySelectorAll(".prompt-item").forEach((el) => {
    el.addEventListener("click", () => {
      const idx = parseInt(el.dataset.index);
      showPromptDetail(state.filteredPrompts[idx]);
    });
  });
}

function showPromptDetail(prompt) {
  if (prompt.isProOnly) {
    alert("🔒 This prompt is Pro-only. Enter your license key in Settings to unlock!");
    return;
  }

  document.getElementById("promptTitle").textContent = prompt.title;
  document.getElementById("promptDesc").textContent = prompt.description;
  document.getElementById("promptText").textContent = prompt.prompt_text;
  document.getElementById("useCase").textContent = `💡 Use case: ${prompt.use_case || "General"}`;

  elements.bundleList.classList.add("hidden");
  document.querySelector(".search-bar").classList.add("hidden");
  elements.promptDetail.classList.remove("hidden");
}

function showList() {
  elements.promptDetail.classList.add("hidden");
  elements.bundleList.classList.remove("hidden");
  document.querySelector(".search-bar").classList.remove("hidden");
}

// ---- Copy ----
function copyPrompt() {
  const text = document.getElementById("promptText").textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("copyBtn");
    btn.textContent = "✅ Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = "📋 Copy Prompt";
      btn.classList.remove("copied");
    }, 2000);
  });
}

// ---- Filter ----
function filterPrompts() {
  const query = elements.searchInput.value.toLowerCase();
  const category = elements.categoryFilter.value.toLowerCase();

  state.filteredPrompts = state.allPrompts.filter((p) => {
    const matchesQuery = !query ||
      p.title.toLowerCase().includes(query) ||
      (p.description || "").toLowerCase().includes(query) ||
      (p.use_case || "").toLowerCase().includes(query);

    const matchesCategory = !category ||
      (p.tags || []).some(t => t.toLowerCase().includes(category));

    return matchesQuery && matchesCategory;
  });

  renderPromptList();
}

// ---- Helpers ----
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}
