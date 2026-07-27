import { app } from "../../scripts/app.js";

const RAW_PROMPT_KEY = "__raw_prompt__";

// ---------------------------------------------------------------------------
// Minimal, hand-drawn flat line icons (no external library / no network
// request — everything is inline SVG using currentColor).
// ---------------------------------------------------------------------------
const ICONS = {
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  trash: '<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/>',
  copy: '<rect x="9" y="9" width="11" height="11"/><path d="M5 15V5h11"/>',
  cut: '<circle cx="6" cy="6" r="2.3"/><circle cx="6" cy="18" r="2.3"/><line x1="20" y1="4" x2="8.5" y2="15.5"/><line x1="8.5" y1="8.5" x2="20" y2="20"/>',
  paste: '<rect x="6" y="4" width="12" height="17"/><rect x="9" y="2" width="6" height="4"/>',
  move: '<line x1="4" y1="12" x2="17" y2="12"/><path d="M12 6l6 6-6 6"/>',
  edit: '<path d="M4 20l4-1 11-11-3-3-11 11-1 4z"/>',
  image: '<rect x="3" y="4" width="18" height="16"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5-4 4-3-3-5 5"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/><line x1="3" y1="3" x2="21" y2="21"/>',
  dice: '<rect x="4" y="4" width="16" height="16"/><circle cx="9" cy="9" r="1.3"/><circle cx="15" cy="9" r="1.3"/><circle cx="9" cy="15" r="1.3"/><circle cx="15" cy="15" r="1.3"/><circle cx="12" cy="12" r="1.3"/>',
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  list: '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>',
  save: '<path d="M4 4h13l3 3v13H4z"/><path d="M8 4v6h8V4"/><rect x="8" y="14" width="8" height="4"/>',
  download: '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 20h16"/>',
  upload: '<path d="M12 15V3"/><path d="M7 8l5-5 5 5"/><path d="M4 20h16"/>',
  handle: '<circle cx="8" cy="6" r="1.4"/><circle cx="16" cy="6" r="1.4"/><circle cx="8" cy="12" r="1.4"/><circle cx="16" cy="12" r="1.4"/><circle cx="8" cy="18" r="1.4"/><circle cx="16" cy="18" r="1.4"/>',
  close: '<line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>',
  check: '<path d="M4 12l5 5 11-11"/>',
};

function svgIcon(name, size) {
  size = size || 18;
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;
}

// ---------------------------------------------------------------------------
// Styles (injected once) — flat, angular (no border-radius, no borders,
// zones told apart purely via background shade), larger touch targets.
// ---------------------------------------------------------------------------
const STYLE_ID = "pm-style-tag";
if (!document.getElementById(STYLE_ID)) {
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
  .pm-root {
    display: flex; flex-direction: column; width: 100%; height: 100%;
    background: #171717; color: #ddd;
    font-family: "Consolas","Courier New",monospace; font-size: 12px;
    box-sizing: border-box; overflow: hidden; border-radius: 0;
  }
  .pm-zone-tabs { background:#0e0e0e; display:flex; flex-wrap:wrap; gap:2px; padding:6px; }
  .pm-zone-preset { background:#202020; display:flex; flex-wrap:wrap; gap:4px; padding:5px 6px; align-items:center; }
  .pm-zone-options { background:#1a1a1a; display:flex; flex-wrap:wrap; gap:4px; padding:5px 6px; align-items:center; }
  .pm-zone-list { background:#141414; flex:1; overflow-y:auto; padding:6px; }
  .pm-zone-preview { background:#0e0e0e; padding:5px 8px; font-size:11px; color:#7fd48a; max-height:48px; overflow-y:auto; white-space:pre-wrap; flex-shrink:0; }

  .pm-tab { display:flex; align-items:center; gap:5px; padding:6px 10px; background:#262626; cursor:pointer; color:#aaa; white-space:nowrap; border-radius:0; }
  .pm-tab:hover { color:#fff; background:#333; }
  .pm-tab.active { background:#3f9c58; color:#fff; }
  .pm-tab.pm-tab-disabled { opacity:0.4; }
  .pm-tab.pm-tab-locked { background:#3a2e5c; color:#d9c9ff; }
  .pm-tab.pm-tab-locked.active { background:#5b3f96; color:#fff; }
  .pm-tab .pm-count { color:#8a8a8a; font-size:10px; }
  .pm-tab.active .pm-count { color:#e2f5e8; }
  .pm-tab-toggle { background:none; border:none; color:inherit; cursor:pointer; padding:0; display:flex; opacity:0.85; }
  .pm-tab-toggle:hover { opacity:1; }
  .pm-tab-add { background:#1c1c1c; color:#666; }
  .pm-tab-add:hover { color:#3f9c58; background:#20301f; }

  .pm-btn { display:inline-flex; align-items:center; gap:4px; background:#2a2a2a; border:none; color:#ccc; padding:6px 8px; cursor:pointer; border-radius:0; font-family:inherit; font-size:11px; line-height:1; }
  .pm-btn:hover { background:#3a3a3a; color:#fff; }
  .pm-btn:disabled { opacity:0.3; cursor:default; }
  .pm-btn:disabled:hover { background:#2a2a2a; color:#ccc; }
  .pm-btn.danger:hover { background:#5c2323; color:#ff9d8f; }
  .pm-btn.primary { background:#2b6b3f; color:#fff; }
  .pm-btn.primary:hover { background:#357a49; }
  .pm-btn.accent-on { background:#5b3f96; color:#fff; }
  .pm-badge { font-size:10px; background:rgba(255,255,255,0.15); padding:0 4px; }

  .pm-select { background:#2a2a2a; border:none; color:#ccc; font-family:inherit; font-size:11px; padding:5px; max-width:120px; border-radius:0; }
  .pm-hint { color:#777; font-size:11px; }
  .pm-sep { width:1px; height:20px; background:#3a3a3a; margin:0 2px; }

  .pm-mode-list { display:flex; flex-direction:column; gap:5px; }
  .pm-mode-grid { display:flex; flex-flow:row wrap; align-content:flex-start; gap:8px; }

  /* --- list mode card --- */
  .pm-card { display:flex; gap:8px; background:#232323; padding:6px; border-radius:0; cursor:pointer; align-items:center; }
  .pm-card.selected { background:#1f5c34; }
  .pm-card.drag-over { background:#2a3f52; }
  .pm-drag-handle { color:#666; display:flex; flex-shrink:0; cursor:grab; }
  .pm-thumb { width:56px; height:56px; object-fit:cover; background:#111; flex-shrink:0; border-radius:0; }
  .pm-thumb-empty { width:56px;height:56px;flex-shrink:0;background:#1a1a1a;display:flex;align-items:center;justify-content:center;color:#555; }
  .pm-card-body { flex:1; min-width:0; }
  .pm-card-name { font-weight:bold; color:#eee; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .pm-card-prompt { color:#999; font-size:11px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:2px; }
  .pm-card-actions { display:flex; gap:6px; align-items:center; flex-shrink:0; }

  /* --- grid / compact mode tile --- */
  .pm-tile { display:flex; flex-direction:column; align-items:center; width:104px; background:#232323; border-radius:0; padding:6px; cursor:pointer; gap:4px; }
  .pm-tile.selected { background:#1f5c34; }
  .pm-tile.drag-over { background:#2a3f52; }
  .pm-tile-thumb { width:88px; height:88px; object-fit:cover; background:#111; border-radius:0; }
  .pm-tile-thumb-empty { width:88px;height:88px;background:#1a1a1a;display:flex;align-items:center;justify-content:center;color:#555; }
  .pm-tile-name { width:100%; text-align:center; font-size:11px; color:#eee; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .pm-tile-actions { display:flex; gap:6px; }

  .pm-icon-btn { background:none; border:none; color:#999; cursor:pointer; display:flex; padding:2px; }
  .pm-icon-btn:hover { color:#fff; }

  .pm-form { background:#202020; padding:8px; display:flex; flex-direction:column; gap:6px; }
  .pm-form input[type=text], .pm-form textarea { background:#101010; border:none; color:#ddd; font-family:inherit; font-size:12px; padding:6px; resize:vertical; width:100%; box-sizing:border-box; border-radius:0; }
  .pm-form textarea { min-height:48px; }
  .pm-form-row { display:flex; gap:6px; align-items:center; }
  .pm-form-actions { display:flex; gap:6px; justify-content:flex-end; }
  .pm-form-thumb { width:42px; height:42px; object-fit:cover; background:#111; border-radius:0; }

  .pm-empty-hint { color:#555; text-align:center; padding:16px 4px; font-style:italic; width:100%; }
  .pm-hidden-file { display:none; }
  `;
  document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------
function uid() {
  return "p_" + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

function slugify(label) {
  const s = (label || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return s || "section";
}

function uniqueKey(base, existingKeys) {
  let key = base;
  let i = 2;
  while (existingKeys.has(key)) {
    key = `${base}_${i}`;
    i += 1;
  }
  return key;
}

function uniqueLabel(base, existingLabels) {
  if (!existingLabels.has(base)) return base;
  let i = 1;
  let candidate = `${base} (${i})`;
  while (existingLabels.has(candidate)) {
    i += 1;
    candidate = `${base} (${i})`;
  }
  return candidate;
}

function sanitizeData(raw) {
  const data = raw && typeof raw === "object" ? raw : {};
  if (!Array.isArray(data.sections)) data.sections = [];
  if (!data.categories || typeof data.categories !== "object") data.categories = {};
  data.viewMode = data.viewMode === "grid" ? "grid" : "list";

  const seen = new Set();
  let sections = data.sections
    .map((s) => ({
      key: (s && s.key) || uid(),
      label: (s && s.label) || (s && s.key) || "Section",
      enabled: s && s.enabled === false ? false : true,
      locked: !!(s && s.locked),
      randomizeOnQueue: !!(s && s.randomizeOnQueue),
    }))
    .filter((s) => {
      if (seen.has(s.key)) return false;
      seen.add(s.key);
      return true;
    });

  const rawIdx = sections.findIndex((s) => s.key === RAW_PROMPT_KEY);
  if (rawIdx === -1) {
    sections.unshift({ key: RAW_PROMPT_KEY, label: "Prompt", enabled: true, locked: true, randomizeOnQueue: false });
  } else {
    sections[rawIdx].label = "Prompt";
    sections[rawIdx].locked = true;
  }

  data.sections = sections;
  data.categories[RAW_PROMPT_KEY] = [];

  data.sections.forEach((s) => {
    if (s.key === RAW_PROMPT_KEY) return;
    if (!Array.isArray(data.categories[s.key])) data.categories[s.key] = [];
    data.categories[s.key] = data.categories[s.key].map((it) => ({
      id: (it && it.id) || uid(),
      name: (it && it.name) || "",
      prompt: (it && it.prompt) || "",
      image: (it && it.image) || null,
      selected: !!(it && it.selected),
    }));
  });

  return data;
}

function computePreview(data, rawText) {
  const parts = [];
  data.sections.forEach((s) => {
    if (!s.enabled) return;
    if (s.locked) {
      const t = (rawText || "").trim();
      if (t) parts.push(t);
      return;
    }
    const items = data.categories[s.key] || [];
    const sel = items
      .filter((it) => it.selected && it.prompt && it.prompt.trim())
      .map((it) => it.prompt.trim());
    if (sel.length) parts.push(sel.join(", "));
  });
  return parts.join(". ");
}

function resizeImageFile(file, maxDim = 220) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function download(filename, text) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}

async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  let body = null;
  try {
    body = await res.json();
  } catch (e) {
    body = null;
  }
  if (!res.ok) {
    throw new Error((body && body.error) || `${res.status} ${res.statusText}`);
  }
  return body;
}

// Applies the randomize-on-queue logic to every PromptManager node in the
// graph. Deterministic per (seed, section key) via a tiny seeded PRNG.
function applyQueueRandomization(appRef) {
  const graph = appRef.graph;
  if (!graph || !graph._nodes) return;
  graph._nodes.forEach((n) => {
    if (!n.pmData || !n.widgets) return;
    const seedWidget = n.widgets.find((w) => w.name === "seed");
    const dataWidget = n.widgets.find((w) => w.name === "prompt_data");
    if (!dataWidget) return;
    const seedVal = seedWidget ? Number(seedWidget.value) || 0 : 0;
    let changed = false;
    n.pmData.sections.forEach((s) => {
      if (s.locked || !s.randomizeOnQueue) return;
      const items = n.pmData.categories[s.key] || [];
      if (!items.length) return;
      const rng = mulberry32(seedVal + hashStr(s.key));
      const idx = Math.floor(rng() * items.length);
      items.forEach((it, i) => (it.selected = i === idx));
      changed = true;
    });
    if (changed) {
      dataWidget.value = JSON.stringify(n.pmData);
      if (n.pmRenderAll) n.pmRenderAll();
    }
  });
}

// ---------------------------------------------------------------------------
// Extension
// ---------------------------------------------------------------------------
app.registerExtension({
  name: "PromptManager.UI",

  async setup(appRef) {
    if (appRef.__pmQueuePatched) return;
    appRef.__pmQueuePatched = true;
    if (typeof appRef.queuePrompt === "function") {
      const orig = appRef.queuePrompt.bind(appRef);
      appRef.queuePrompt = async function (...args) {
        try {
          applyQueueRandomization(appRef);
        } catch (e) {
          console.warn("PromptManager: randomize-on-queue failed", e);
        }
        return orig(...args);
      };
    }
  },

  async beforeRegisterNodeDef(nodeType, nodeData) {
    if (nodeData.name !== "PromptManagerNode") return;

    // IMPORTANT: never derive the widget's height from node.size while
    // computing node.size (that's a feedback loop that grows the node
    // forever). Instead, only *record* the height the user actually
    // dragged to (via onResize, an authoritative one-shot notification),
    // and have computeSize read that stored snapshot — never node.size
    // directly.
    const onResize = nodeType.prototype.onResize;
    nodeType.prototype.onResize = function (size) {
      const r = onResize ? onResize.apply(this, arguments) : undefined;
      if (Array.isArray(size) && typeof size[1] === "number") {
        this.pmDesiredHeight = Math.max(200, Math.min(4000, size[1]));
      }
      this.setDirtyCanvas(true, true);
      return r;
    };

    const onNodeCreated = nodeType.prototype.onNodeCreated;
    nodeType.prototype.onNodeCreated = function () {
      const r = onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined;
      const node = this;
      node.pmDesiredHeight = node.pmDesiredHeight || 640;

      const dataWidget = node.widgets && node.widgets.find((w) => w.name === "prompt_data");
      const seedWidget = node.widgets && node.widgets.find((w) => w.name === "seed");
      const rawPromptWidget = node.widgets && node.widgets.find((w) => w.name === "raw_prompt");

      if (dataWidget) {
        dataWidget.computeSize = () => [0, -4];
        if (dataWidget.inputEl) dataWidget.inputEl.style.display = "none";
        dataWidget.draw = function () {};
      }

      let initial = {};
      try {
        initial = dataWidget && dataWidget.value ? JSON.parse(dataWidget.value) : {};
      } catch (e) {
        initial = {};
      }
      node.pmData = sanitizeData(initial);

      const state = {
        activeTab: node.pmData.sections.length ? node.pmData.sections[0].key : null,
        clipboard: [],
      };

      function persist() {
        if (dataWidget) dataWidget.value = JSON.stringify(node.pmData);
        node.setDirtyCanvas(true, true);
      }

      function rawPromptValue() {
        return rawPromptWidget ? rawPromptWidget.value || "" : "";
      }

      function activeItems() {
        if (!state.activeTab) return [];
        return node.pmData.categories[state.activeTab] || [];
      }

      function activeSection() {
        return node.pmData.sections.find((s) => s.key === state.activeTab) || null;
      }

      // --- Root DOM: four visually distinct zones -------------------------------
      const root = document.createElement("div");
      root.className = "pm-root";

      const tabsEl = document.createElement("div");
      tabsEl.className = "pm-zone-tabs";
      const presetRowEl = document.createElement("div");
      presetRowEl.className = "pm-zone-preset";
      const sectionToolbarEl = document.createElement("div");
      sectionToolbarEl.className = "pm-zone-options";
      const formEl = document.createElement("div");
      formEl.style.display = "none";
      const listEl = document.createElement("div");
      listEl.className = "pm-zone-list";
      const previewEl = document.createElement("div");
      previewEl.className = "pm-zone-preview";

      root.appendChild(tabsEl);
      root.appendChild(presetRowEl);
      root.appendChild(sectionToolbarEl);
      root.appendChild(formEl);
      root.appendChild(listEl);
      root.appendChild(previewEl);

      if (rawPromptWidget && rawPromptWidget.inputEl) {
        rawPromptWidget.inputEl.addEventListener("input", () => updatePreview());
      }

      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.className = "pm-hidden-file";
      root.appendChild(fileInput);
      let fileInputTarget = null;

      fileInput.addEventListener("change", async () => {
        const f = fileInput.files && fileInput.files[0];
        fileInput.value = "";
        if (!f || !fileInputTarget || fileInputTarget === "__form__") return;
        const dataUrl = await resizeImageFile(f);
        const item = activeItems().find((it) => it.id === fileInputTarget);
        if (item) {
          item.image = dataUrl;
          persist();
          renderList();
        }
      });

      const importInput = document.createElement("input");
      importInput.type = "file";
      importInput.accept = "application/json";
      importInput.className = "pm-hidden-file";
      root.appendChild(importInput);
      importInput.addEventListener("change", () => {
        const f = importInput.files && importInput.files[0];
        importInput.value = "";
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            importSection(JSON.parse(reader.result));
          } catch (e) {
            alert("Invalid file: " + e.message);
          }
        };
        reader.readAsText(f);
      });

      function toggleRandomizeOnQueue(sec) {
        sec.randomizeOnQueue = !sec.randomizeOnQueue;
        persist();
        renderSectionToolbar();
      }

      // --- Section management -----------------------------------------------------
      function addSection() {
        const label = window.prompt("New section name:");
        if (!label || !label.trim()) return;
        const existingKeys = new Set(Object.keys(node.pmData.categories));
        const key = uniqueKey(slugify(label), existingKeys);
        node.pmData.sections.push({ key, label: label.trim(), enabled: true, locked: false, randomizeOnQueue: false });
        node.pmData.categories[key] = [];
        state.activeTab = key;
        persist();
        renderAll();
      }

      function renameSection() {
        const sec = activeSection();
        if (!sec || sec.locked) return;
        const label = window.prompt("Rename section:", sec.label);
        if (!label || !label.trim()) return;
        sec.label = label.trim();
        persist();
        renderAll();
      }

      function deleteSection() {
        const sec = activeSection();
        if (!sec || sec.locked) return;
        if (node.pmData.sections.filter((s) => !s.locked).length <= 1) {
          alert("You need to keep at least one (non-locked) section.");
          return;
        }
        const count = (node.pmData.categories[sec.key] || []).length;
        if (!confirm(`Delete section "${sec.label}" and its ${count} prompt(s)? This cannot be undone.`)) return;
        node.pmData.sections = node.pmData.sections.filter((s) => s.key !== sec.key);
        delete node.pmData.categories[sec.key];
        state.activeTab = node.pmData.sections.length ? node.pmData.sections[0].key : null;
        persist();
        renderAll();
      }

      function toggleSectionEnabled(sec) {
        sec.enabled = !sec.enabled;
        persist();
        renderAll();
      }

      function exportSection() {
        const sec = activeSection();
        if (!sec || sec.locked) return;
        const payload = { pmSection: true, label: sec.label, items: activeItems() };
        download(`${slugify(sec.label)}.json`, JSON.stringify(payload, null, 2));
      }

      function importSection(parsed) {
        const items = Array.isArray(parsed && parsed.items) ? parsed.items : null;
        if (!items) {
          alert("This file doesn't look like an exported section.");
          return;
        }
        const label = (parsed.label || "Imported Section").trim() || "Imported Section";
        const existingLabels = new Set(node.pmData.sections.map((s) => s.label));
        const finalLabel = uniqueLabel(label, existingLabels);
        const existingKeys = new Set(Object.keys(node.pmData.categories));
        const key = uniqueKey(slugify(finalLabel), existingKeys);
        node.pmData.sections.push({ key, label: finalLabel, enabled: true, locked: false, randomizeOnQueue: false });
        node.pmData.categories[key] = items.map((it) => ({
          id: uid(),
          name: (it && it.name) || "",
          prompt: (it && it.prompt) || "",
          image: (it && it.image) || null,
          selected: false,
        }));
        state.activeTab = key;
        persist();
        renderAll();
      }

      // --- Preset picker -------------------------------------------------------------
      async function fetchPresets() {
        try {
          return await fetchJSON("/prompt_manager/presets");
        } catch (e) {
          return { names: [], last: null };
        }
      }

      async function refreshPresetSelect(selectName) {
        const { names, last } = await fetchPresets();
        presetSelect.innerHTML = "";
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "—";
        presetSelect.appendChild(placeholder);
        names.forEach((n) => {
          const opt = document.createElement("option");
          opt.value = n;
          opt.textContent = n;
          presetSelect.appendChild(opt);
        });
        const want = selectName || last || "";
        presetSelect.value = names.includes(want) ? want : "";
      }

      const presetSelect = document.createElement("select");
      presetSelect.className = "pm-select";
      presetSelect.title = "Saved presets";
      presetSelect.addEventListener("change", async () => {
        const name = presetSelect.value;
        if (!name) return;
        try {
          const parsed = await fetchJSON(`/prompt_manager/presets/${encodeURIComponent(name)}`);
          node.pmData = sanitizeData(parsed);
          state.activeTab = node.pmData.sections.length ? node.pmData.sections[0].key : null;
          persist();
          renderAll();
          fetch("/prompt_manager/last_used", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
          }).catch(() => {});
        } catch (e) {
          alert("Failed to load preset: " + e.message);
        }
      });

      // --- Button builder --------------------------------------------------------------
      function mkBtn(iconName, cls, title, onClick, badge) {
        const b = document.createElement("button");
        b.className = "pm-btn" + (cls ? " " + cls : "");
        b.innerHTML = svgIcon(iconName, 16) + (badge ? `<span class="pm-badge">${badge}</span>` : "");
        if (title) b.title = title;
        b.addEventListener("click", (e) => {
          e.stopPropagation();
          onClick();
        });
        return b;
      }

      // --- Render: tabs --------------------------------------------------------------
      let sectionDragSrc = null;

      function renderTabs() {
        tabsEl.innerHTML = "";
        node.pmData.sections.forEach((s, index) => {
          const tab = document.createElement("div");
          const count = s.locked ? "" : (node.pmData.categories[s.key] || []).length;
          tab.className =
            "pm-tab" +
            (state.activeTab === s.key ? " active" : "") +
            (s.locked ? " pm-tab-locked" : "") +
            (!s.enabled ? " pm-tab-disabled" : "");
          tab.draggable = true;

          const label = document.createElement("span");
          label.textContent = s.label;
          tab.appendChild(label);
          if (!s.locked) {
            const countEl = document.createElement("span");
            countEl.className = "pm-count";
            countEl.textContent = count;
            tab.appendChild(countEl);
          }

          const toggle = document.createElement("button");
          toggle.className = "pm-tab-toggle";
          toggle.innerHTML = svgIcon(s.enabled ? "eye" : "eyeOff", 14);
          toggle.title = s.enabled ? "Section enabled — click to disable" : "Section disabled — click to enable";
          toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleSectionEnabled(s);
          });
          tab.appendChild(toggle);

          tab.addEventListener("click", () => {
            state.activeTab = s.key;
            closeForm();
            renderAll();
          });

          tab.addEventListener("dragstart", (e) => {
            sectionDragSrc = index;
            e.dataTransfer.effectAllowed = "move";
          });
          tab.addEventListener("dragover", (e) => e.preventDefault());
          tab.addEventListener("drop", (e) => {
            e.preventDefault();
            if (sectionDragSrc === null || sectionDragSrc === index) return;
            const arr = node.pmData.sections;
            const [moved] = arr.splice(sectionDragSrc, 1);
            arr.splice(index, 0, moved);
            sectionDragSrc = null;
            persist();
            renderTabs();
          });

          tabsEl.appendChild(tab);
        });

        const addTab = document.createElement("div");
        addTab.className = "pm-tab pm-tab-add";
        addTab.innerHTML = svgIcon("plus", 16);
        addTab.title = "New section";
        addTab.addEventListener("click", addSection);
        tabsEl.appendChild(addTab);
      }

      // --- Render: preset row (zone 2) -------------------------------------------------
      function renderPresetRow() {
        presetRowEl.innerHTML = "";
        presetRowEl.appendChild(presetSelect);

        presetRowEl.appendChild(
          mkBtn("save", "", "Save current library as a new preset", async () => {
            const suggested = presetSelect.value || "";
            const name = window.prompt("Save as:", suggested);
            if (!name || !name.trim()) return;
            const clean = name.trim();
            try {
              await fetchJSON(`/prompt_manager/presets/${encodeURIComponent(clean)}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(node.pmData),
              });
              await refreshPresetSelect(clean);
            } catch (e) {
              alert("Failed to save preset: " + e.message);
            }
          })
        );

        const renameBtn = mkBtn("edit", "", "Rename selected preset", async () => {
          const current = presetSelect.value;
          if (!current) return;
          const newName = window.prompt("Rename preset:", current);
          if (!newName || !newName.trim() || newName.trim() === current) return;
          try {
            await fetchJSON(`/prompt_manager/presets/${encodeURIComponent(current)}/rename`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ new_name: newName.trim() }),
            });
            await refreshPresetSelect(newName.trim());
          } catch (e) {
            alert("Failed to rename preset: " + e.message);
          }
        });
        renameBtn.disabled = !presetSelect.value;
        presetRowEl.appendChild(renameBtn);

        const delBtn = mkBtn("trash", "danger", "Delete selected preset", async () => {
          const current = presetSelect.value;
          if (!current) return;
          if (!confirm(`Delete preset "${current}"? This cannot be undone.`)) return;
          try {
            await fetch(`/prompt_manager/presets/${encodeURIComponent(current)}`, { method: "DELETE" });
            await refreshPresetSelect("");
          } catch (e) {
            alert("Failed to delete preset: " + e.message);
          }
        });
        delBtn.disabled = !presetSelect.value;
        presetRowEl.appendChild(delBtn);

        const sep = document.createElement("div");
        sep.className = "pm-sep";
        presetRowEl.appendChild(sep);

        presetRowEl.appendChild(
          mkBtn(node.pmData.viewMode === "grid" ? "list" : "grid", "", "Toggle compact grid / classic list view", () => {
            node.pmData.viewMode = node.pmData.viewMode === "grid" ? "list" : "grid";
            persist();
            renderAll();
          })
        );
      }

      // --- Render: section-scoped toolbar (zone 3) --------------------------------------
      function renderSectionToolbar() {
        sectionToolbarEl.innerHTML = "";
        const sec = activeSection();
        if (!sec) return;

        if (sec.locked) {
          const hint = document.createElement("span");
          hint.className = "pm-hint";
          hint.textContent = "Raw text — edit the box above. Drag this tab to reposition it.";
          sectionToolbarEl.appendChild(hint);
          return;
        }

        const items = activeItems();
        const selectedCount = items.filter((it) => it.selected).length;

        sectionToolbarEl.appendChild(mkBtn("plus", "primary", "Add prompt", () => openForm(null)));

        const randBtn = mkBtn(
          "dice",
          sec.randomizeOnQueue ? "accent-on" : "",
          sec.randomizeOnQueue
            ? "Randomize on queue: ON — click to disable"
            : "Randomize on queue: OFF — click to enable",
          () => toggleRandomizeOnQueue(sec)
        );
        sectionToolbarEl.appendChild(randBtn);

        const clearBtn = mkBtn("close", "", "Clear selection (this section only)", () => {
          items.forEach((it) => (it.selected = false));
          persist();
          renderAll();
        });
        clearBtn.disabled = selectedCount === 0;
        sectionToolbarEl.appendChild(clearBtn);

        const sep0 = document.createElement("div");
        sep0.className = "pm-sep";
        sectionToolbarEl.appendChild(sep0);

        const delBtn = mkBtn("trash", "danger", "Delete selected", () => {
          node.pmData.categories[state.activeTab] = items.filter((it) => !it.selected);
          persist();
          renderAll();
        }, selectedCount || "");
        delBtn.disabled = selectedCount === 0;
        sectionToolbarEl.appendChild(delBtn);

        const copyBtn = mkBtn("copy", "", "Copy selected", () => {
          state.clipboard = items.filter((it) => it.selected).map((it) => ({ ...it }));
        }, selectedCount || "");
        copyBtn.disabled = selectedCount === 0;
        sectionToolbarEl.appendChild(copyBtn);

        const cutBtn = mkBtn("cut", "", "Cut selected", () => {
          state.clipboard = items.filter((it) => it.selected).map((it) => ({ ...it }));
          node.pmData.categories[state.activeTab] = items.filter((it) => !it.selected);
          persist();
          renderAll();
        }, selectedCount || "");
        cutBtn.disabled = selectedCount === 0;
        sectionToolbarEl.appendChild(cutBtn);

        const pasteBtn = mkBtn("paste", "", "Paste into this section", () => {
          const clones = state.clipboard.map((it) => ({ ...it, id: uid(), selected: false }));
          node.pmData.categories[state.activeTab] = activeItems().concat(clones);
          persist();
          renderAll();
        }, state.clipboard.length || "");
        pasteBtn.disabled = state.clipboard.length === 0;
        sectionToolbarEl.appendChild(pasteBtn);

        const moveWrap = document.createElement("span");
        moveWrap.style.display = "inline-flex";
        moveWrap.style.alignItems = "center";
        moveWrap.style.gap = "3px";
        const moveIcon = document.createElement("span");
        moveIcon.style.color = "#999";
        moveIcon.innerHTML = svgIcon("move", 14);
        moveWrap.appendChild(moveIcon);
        const moveSelect = document.createElement("select");
        moveSelect.className = "pm-select";
        const optDefault = document.createElement("option");
        optDefault.textContent = "move…";
        optDefault.value = "";
        moveSelect.appendChild(optDefault);
        node.pmData.sections
          .filter((s) => s.key !== state.activeTab && !s.locked)
          .forEach((s) => {
            const opt = document.createElement("option");
            opt.value = s.key;
            opt.textContent = s.label;
            moveSelect.appendChild(opt);
          });
        moveSelect.disabled = selectedCount === 0;
        moveSelect.addEventListener("change", () => {
          const target = moveSelect.value;
          if (!target) return;
          const moving = items.filter((it) => it.selected);
          node.pmData.categories[state.activeTab] = items.filter((it) => !it.selected);
          node.pmData.categories[target] = (node.pmData.categories[target] || []).concat(moving);
          persist();
          renderAll();
        });
        moveWrap.appendChild(moveSelect);
        sectionToolbarEl.appendChild(moveWrap);

        const sep1 = document.createElement("div");
        sep1.className = "pm-sep";
        sectionToolbarEl.appendChild(sep1);

        sectionToolbarEl.appendChild(mkBtn("download", "", "Export this section", exportSection));
        sectionToolbarEl.appendChild(mkBtn("upload", "", "Import a section", () => importInput.click()));

        const sep2 = document.createElement("div");
        sep2.className = "pm-sep";
        sectionToolbarEl.appendChild(sep2);

        sectionToolbarEl.appendChild(mkBtn("edit", "", "Rename section", renameSection));
        const canDelete = node.pmData.sections.filter((s) => !s.locked).length > 1;
        const deleteSecBtn = mkBtn("trash", "danger", "Delete section", deleteSection);
        deleteSecBtn.disabled = !canDelete;
        sectionToolbarEl.appendChild(deleteSecBtn);
      }

      // --- Render: add/edit form ------------------------------------------------------
      function openForm(item) {
        formEl.style.display = "flex";
        formEl.className = "pm-form";
        formEl.innerHTML = "";

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.placeholder = "Name";
        nameInput.value = item ? item.name : "";

        const promptInput = document.createElement("textarea");
        promptInput.placeholder = "Prompt text (injected into the final output)";
        promptInput.value = item ? item.prompt : "";

        const row = document.createElement("div");
        row.className = "pm-form-row";
        const thumb = document.createElement("img");
        thumb.className = "pm-form-thumb";
        thumb.src = item && item.image ? item.image : "";
        thumb.style.visibility = item && item.image ? "visible" : "hidden";
        const imgBtn = mkBtn("image", "", "Set image", () => {
          fileInputTarget = "__form__";
          fileInput.click();
        });
        row.appendChild(thumb);
        row.appendChild(imgBtn);

        let pendingImage = item ? item.image : null;
        const formFileHandler = async () => {
          const f = fileInput.files && fileInput.files[0];
          if (!f) return;
          const dataUrl = await resizeImageFile(f);
          pendingImage = dataUrl;
          thumb.src = dataUrl;
          thumb.style.visibility = "visible";
        };

        const actions = document.createElement("div");
        actions.className = "pm-form-actions";
        const cancelBtn = mkBtn("close", "", "Cancel", () => closeForm());
        const saveBtn = mkBtn(item ? "check" : "plus", "primary", item ? "Save" : "Add", () => {
          const name = nameInput.value.trim();
          const promptText = promptInput.value.trim();
          if (!name && !promptText) {
            closeForm();
            return;
          }
          if (item) {
            item.name = name;
            item.prompt = promptText;
            item.image = pendingImage;
          } else {
            activeItems().push({ id: uid(), name, prompt: promptText, image: pendingImage, selected: false });
          }
          persist();
          closeForm();
          renderAll();
        });
        actions.appendChild(cancelBtn);
        actions.appendChild(saveBtn);

        formEl.appendChild(nameInput);
        formEl.appendChild(promptInput);
        formEl.appendChild(row);
        formEl.appendChild(actions);

        if (fileInput._pmHandler) fileInput.removeEventListener("change", fileInput._pmHandler);
        const handler = async () => {
          if (fileInputTarget === "__form__") {
            await formFileHandler();
            fileInputTarget = null;
            fileInput.value = "";
          }
        };
        fileInput.addEventListener("change", handler);
        fileInput._pmHandler = handler;
      }

      function closeForm() {
        formEl.style.display = "none";
        formEl.innerHTML = "";
        if (fileInput._pmHandler) {
          fileInput.removeEventListener("change", fileInput._pmHandler);
          fileInput._pmHandler = null;
        }
      }

      // --- Render: card / tile list (zone 4) ---------------------------------------------
      let itemDragSrc = null;

      function soloSelect(item) {
        activeItems().forEach((it) => (it.selected = it.id === item.id));
        persist();
        renderAll();
      }

      function toggleSelect(item) {
        item.selected = !item.selected;
        persist();
        renderList();
        renderSectionToolbar();
        updatePreview();
      }

      function makeActionIcons(item) {
        const wrap = document.createElement("div");
        wrap.className = "pm-card-actions";
        const soloBtn = document.createElement("button");
        soloBtn.className = "pm-icon-btn";
        soloBtn.innerHTML = svgIcon("target", 16);
        soloBtn.title = "Select only this one (deselects the rest of the section)";
        soloBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          soloSelect(item);
        });
        const editBtn = document.createElement("button");
        editBtn.className = "pm-icon-btn";
        editBtn.innerHTML = svgIcon("edit", 16);
        editBtn.title = "Edit";
        editBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          openForm(item);
        });
        const imgBtn = document.createElement("button");
        imgBtn.className = "pm-icon-btn";
        imgBtn.innerHTML = svgIcon("image", 16);
        imgBtn.title = "Change image";
        imgBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          fileInputTarget = item.id;
          fileInput.click();
        });
        const delBtn = document.createElement("button");
        delBtn.className = "pm-icon-btn";
        delBtn.innerHTML = svgIcon("trash", 16);
        delBtn.title = "Delete";
        delBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          node.pmData.categories[state.activeTab] = activeItems().filter((it) => it.id !== item.id);
          persist();
          renderAll();
        });
        wrap.appendChild(soloBtn);
        wrap.appendChild(editBtn);
        wrap.appendChild(imgBtn);
        wrap.appendChild(delBtn);
        return wrap;
      }

      function attachDragReorder(el, index) {
        el.draggable = true;
        el.addEventListener("dragstart", (e) => {
          itemDragSrc = index;
          e.dataTransfer.effectAllowed = "move";
        });
        el.addEventListener("dragover", (e) => {
          e.preventDefault();
          el.classList.add("drag-over");
        });
        el.addEventListener("dragleave", () => el.classList.remove("drag-over"));
        el.addEventListener("drop", (e) => {
          e.preventDefault();
          el.classList.remove("drag-over");
          if (itemDragSrc === null || itemDragSrc === index) return;
          const arr = activeItems();
          const [moved] = arr.splice(itemDragSrc, 1);
          arr.splice(index, 0, moved);
          itemDragSrc = null;
          persist();
          renderList();
        });
      }

      function renderListModeCard(item, index) {
        const card = document.createElement("div");
        card.className = "pm-card" + (item.selected ? " selected" : "");
        attachDragReorder(card, index);

        const handle = document.createElement("div");
        handle.className = "pm-drag-handle";
        handle.innerHTML = svgIcon("handle", 16);
        handle.title = "Drag to reorder";

        let thumbEl;
        if (item.image) {
          thumbEl = document.createElement("img");
          thumbEl.className = "pm-thumb";
          thumbEl.src = item.image;
        } else {
          thumbEl = document.createElement("div");
          thumbEl.className = "pm-thumb-empty";
          thumbEl.innerHTML = svgIcon("image", 20);
        }

        const body = document.createElement("div");
        body.className = "pm-card-body";
        const nameEl = document.createElement("div");
        nameEl.className = "pm-card-name";
        nameEl.textContent = item.name || "(unnamed)";
        const promptEl = document.createElement("div");
        promptEl.className = "pm-card-prompt";
        promptEl.textContent = item.prompt || "";
        body.appendChild(nameEl);
        body.appendChild(promptEl);

        card.addEventListener("click", () => toggleSelect(item));

        card.appendChild(handle);
        card.appendChild(thumbEl);
        card.appendChild(body);
        card.appendChild(makeActionIcons(item));
        return card;
      }

      function renderGridModeTile(item, index) {
        const tile = document.createElement("div");
        tile.className = "pm-tile" + (item.selected ? " selected" : "");
        attachDragReorder(tile, index);

        let thumbEl;
        if (item.image) {
          thumbEl = document.createElement("img");
          thumbEl.className = "pm-tile-thumb";
          thumbEl.src = item.image;
        } else {
          thumbEl = document.createElement("div");
          thumbEl.className = "pm-tile-thumb-empty";
          thumbEl.innerHTML = svgIcon("image", 26);
        }

        const nameEl = document.createElement("div");
        nameEl.className = "pm-tile-name";
        nameEl.textContent = item.name || "(unnamed)";
        nameEl.title = item.prompt || "";

        const actions = makeActionIcons(item);
        actions.className = "pm-tile-actions";

        tile.addEventListener("click", () => toggleSelect(item));

        tile.appendChild(thumbEl);
        tile.appendChild(nameEl);
        tile.appendChild(actions);
        return tile;
      }

      function renderList() {
        listEl.innerHTML = "";

        if (!state.activeTab) {
          const hint = document.createElement("div");
          hint.className = "pm-empty-hint";
          hint.textContent = "No sections yet. Click the + tab above to create one.";
          listEl.appendChild(hint);
          return;
        }

        const sec = activeSection();
        if (sec && sec.locked) {
          const hint = document.createElement("div");
          hint.className = "pm-empty-hint";
          hint.textContent = "This section mirrors the text box above. Nothing to list here.";
          listEl.appendChild(hint);
          return;
        }

        const gridMode = node.pmData.viewMode === "grid";
        listEl.className = "pm-zone-list " + (gridMode ? "pm-mode-grid" : "pm-mode-list");

        const items = activeItems();
        if (items.length === 0) {
          const hint = document.createElement("div");
          hint.className = "pm-empty-hint";
          hint.textContent = 'No prompts in this section yet. Click "+" to add one.';
          listEl.appendChild(hint);
          return;
        }

        items.forEach((item, index) => {
          listEl.appendChild(gridMode ? renderGridModeTile(item, index) : renderListModeCard(item, index));
        });
      }

      function updatePreview() {
        const text = computePreview(node.pmData, rawPromptValue());
        previewEl.textContent = text || "(nothing selected)";
      }

      function renderAll() {
        renderTabs();
        renderPresetRow();
        renderSectionToolbar();
        renderList();
        updatePreview();
      }

      node.pmRenderAll = renderAll;

      // --- DOM widget: height comes ONLY from the stored pmDesiredHeight snapshot ------
      function reservedHeight() {
        let total = 16;
        node.widgets.forEach((w) => {
          if (w === widget || w === dataWidget) return;
          let h = 26;
          try {
            if (typeof w.computeSize === "function") {
              const cs = w.computeSize(node.size ? node.size[0] : 300);
              if (Array.isArray(cs) && typeof cs[1] === "number") h = cs[1];
            }
          } catch (e) {
            /* ignore */
          }
          total += h + 4;
        });
        return total;
      }

      let widget = node.addDOMWidget("prompt_manager_ui", "div", root, {
        getValue() {
          return dataWidget ? dataWidget.value : "{}";
        },
        setValue(v) {
          if (dataWidget) dataWidget.value = v;
        },
      });
      widget.computeSize = function (width) {
        const h = Math.max(220, node.pmDesiredHeight - reservedHeight());
        return [width, h];
      };

      node.setSize([500, node.pmDesiredHeight]);
      persist();
      renderAll();
      refreshPresetSelect().catch(() => {});

      return r;
    };

    const onConfigure = nodeType.prototype.onConfigure;
    nodeType.prototype.onConfigure = function () {
      const r = onConfigure ? onConfigure.apply(this, arguments) : undefined;
      try {
        const dw = this.widgets && this.widgets.find((w) => w.name === "prompt_data");
        if (dw && dw.value) {
          this.pmData = sanitizeData(JSON.parse(dw.value));
          if (this.pmRenderAll) this.pmRenderAll();
        }
      } catch (e) {
        console.warn("PromptManager: failed to restore data", e);
      }
      return r;
    };
  },
});
