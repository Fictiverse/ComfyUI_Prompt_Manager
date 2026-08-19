import { app } from "../../scripts/app.js";

const RAW_PROMPT_KEY = "__raw_prompt__";

// Section color tag palette (muted / low-saturation labels)
const SECTION_COLORS = {
  red: "#a85d5d",
  green: "#5f9e73",
  blue: "#5f85b0",
  amber: "#b8975a",
  teal: "#5aa3a0",
  pink: "#a56a94",
  slate: "#7c88a0",
};

// ---------------------------------------------------------------------------
// Inline SVG Icons (Feather / Lucide style, 24x24 grid)
// ---------------------------------------------------------------------------
const ICONS = {
  filePlus: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  trash: '<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/>',
  copy: '<rect x="9" y="9" width="11" height="11"/><path d="M5 15V5h11"/>',
  cut: '<circle cx="6" cy="6" r="2.3"/><circle cx="6" cy="18" r="2.3"/><line x1="20" y1="4" x2="8.5" y2="15.5"/><line x1="8.5" y1="8.5" x2="20" y2="20"/>',
  paste: '<rect x="6" y="4" width="12" height="17"/><rect x="9" y="2" width="6" height="4"/>',
  move: '<line x1="4" y1="12" x2="17" y2="12"/><path d="M12 6l6 6-6 6"/>',
  edit: '<path d="M4 20l4-1 11-11-3-3-11 11-1 4z"/>',
  backspace: '<path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/>',
  image: '<rect x="3" y="4" width="18" height="16"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5-4 4-3-3-5 5"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/><line x1="3" y1="3" x2="21" y2="21"/>',
  dice: '<rect x="4" y="4" width="16" height="16"/><circle cx="9" cy="9" r="1.3"/><circle cx="15" cy="9" r="1.3"/><circle cx="9" cy="15" r="1.3"/><circle cx="15" cy="15" r="1.3"/><circle cx="12" cy="12" r="1.3"/>',
  diceOff: '<rect x="4" y="4" width="16" height="16"/><circle cx="9" cy="9" r="1.3"/><circle cx="15" cy="9" r="1.3"/><circle cx="9" cy="15" r="1.3"/><circle cx="15" cy="15" r="1.3"/><circle cx="12" cy="12" r="1.3"/><line x1="3" y1="3" x2="21" y2="21"/>',
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  list: '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>',
  save: '<path d="M4 4h13l3 3v13H4z"/><path d="M8 4v6h8V4"/><rect x="8" y="14" width="8" height="4"/>',
  download: '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 20h16"/>',
  upload: '<path d="M12 15V3"/><path d="M7 8l5-5 5 5"/><path d="M4 20h16"/>',
  handle: '<circle cx="8" cy="6" r="1.4"/><circle cx="16" cy="6" r="1.4"/><circle cx="8" cy="12" r="1.4"/><circle cx="16" cy="12" r="1.4"/><circle cx="8" cy="18" r="1.4"/><circle cx="16" cy="18" r="1.4"/>',
  close: '<line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>',
  check: '<path d="M4 12l5 5 11-11"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3.1-6.8"/><path d="M21 3v6h-6"/>',
  type: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="12" y1="4" x2="12" y2="20"/>',
  tag: '<path d="M20 12L12 20 4 12V4h8z"/><circle cx="8.5" cy="7.5" r="1.3"/>',
  fileText: '<path d="M6 2h9l5 5v15H6z"/><path d="M15 2v5h5"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/>',
  palette: '<path d="M12 2a10 10 0 1 0 0 20c1.5 0 2-1 2-2s-.5-1.5-.5-2 1-1 2-1h1a4 4 0 0 0 4-4c0-6-4-9-8.5-9z"/><circle cx="7.5" cy="10.5" r="1.2"/><circle cx="11" cy="7" r="1.2"/><circle cx="15.5" cy="8.5" r="1.2"/>',
  more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  star: '<path d="M12 2.5l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7-5.4-4.7 7.1-.6z"/>',
  comma: '<circle cx="9" cy="15" r="2.1" fill="currentColor" stroke="none"/><path d="M10 17c.4 2-1.5 4-1.5 4"/>',
  commaOff: '<circle cx="9" cy="15" r="2.1" fill="currentColor" stroke="none"/><path d="M10 17c.4 2-1.5 4-1.5 4"/><line x1="3" y1="3" x2="21" y2="21"/>',
  period: '<circle cx="12" cy="18" r="2" fill="currentColor" stroke="none"/>',
  periodOff: '<circle cx="12" cy="18" r="2" fill="currentColor" stroke="none"/><line x1="3" y1="3" x2="21" y2="21"/>',
};

function svgIcon(name, size = 18) {
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;
}

// ---------------------------------------------------------------------------
// Stylesheet & Theme Variables
// ---------------------------------------------------------------------------
const STYLE_ID = "pm-style-tag";
if (!document.getElementById(STYLE_ID)) {
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
  .pm-root {
    /* --- Base Surfaces --- */
    --pm-bg-root: #171717;
    --pm-bg-panel-dark: #0e0e0e;
    --pm-bg-panel-mid: #141414;
    --pm-bg-panel-light: #1a1a1a;
    --pm-bg-panel-alt: #202020;
    --pm-bg-card: #232323;
    --pm-bg-tile: #1c1c1c;
    --pm-bg-input: #101010;
    --pm-bg-contextual: #232030;

    /* --- Text & Neutral Colors --- */
    --pm-text-bright: #ffffff;
    --pm-text-main: #dddddd;
    --pm-text-soft: #eeeeee;
    --pm-text-muted: #cccccc;
    --pm-text-dim: #aaaaaa;
    --pm-text-faint: #777777;
    --pm-text-ghost: #555555;

    /* --- Base Buttons & Separators --- */
    --pm-btn-bg: #2a2a2a;
    --pm-btn-hover: #3a3a3a;
    --pm-sep-color: #3a3a3a;
    --pm-tab-sep-color: #444444;

    /* --- Green Theme (Selection & Active states) --- */
    --pm-green-bg: #23633b;
    --pm-green-hover: #2c7a49;
    --pm-green-border: #3b9e5f;
    --pm-green-text-soft: #a8e8b9;
    --pm-green-text-bright: #6be37b;
    --pm-green-text-light: #e6f7ec;
    --pm-green-count-active: #e2f5e8;

    /* --- Tabs --- */
    --pm-tab-bg: #262626;
    --pm-tab-hover: #333333;
    --pm-tab-sel-bg: #2d333b;
    --pm-tab-sel-hover: #373e48;
    --pm-tab-sel-count: #9ab0c8;
    --pm-tab-add-bg: #1c1c1c;

    /* --- Purple Theme (Locked Prompt & Randomize) --- */
    --pm-locked-tab-bg: #3a2e5c;
    --pm-locked-tab-active: #5b3f96;
    --pm-locked-tab-bar: #9a7fe0;
    --pm-locked-tab-text: #d9c9ff;

    /* --- Blue Theme (Always-On) --- */
    --pm-always-on-bg: #1c3e5c;
    --pm-always-on-border: #4c93d6;
    --pm-always-on-text: #bfe0ff;
    --pm-always-on-star-bg: rgba(42, 85, 128, 0.85);

    /* --- Discreet Button Hover Tints --- */
    --pm-tint-green-hover: #3e4d43;
    --pm-tint-purple-hover: #45394e;
    --pm-tint-blue-hover: #404d5a;
    --pm-tint-red-hover: #503737;
    --pm-danger-hover: #5c2323;
    --pm-danger-text: #ff9d8f;

    /* --- Indicators & Drag Feedback --- */
    --pm-warn-color: #c98a4b;
    --pm-drag-over-bg: #2a3f52;
    --pm-drag-over-border: #4f8ef7;

    display: flex; flex-direction: column; width: 100%; height: 100%;
    background: var(--pm-bg-root); color: var(--pm-text-main);
    font-family: "Consolas", "Courier New", monospace; font-size: 12px;
    box-sizing: border-box; overflow: hidden; border-radius: 0;
  }
  .pm-root, .pm-root * { box-sizing: border-box; }

  /* --- Layout Panels --- */
  .pm-zone-tabs { background: var(--pm-bg-panel-dark); display: flex; flex-wrap: wrap; gap: 2px; padding: 2px; flex-shrink: 0; }
  .pm-zone-preset { background: var(--pm-bg-panel-alt); display: flex; flex-wrap: wrap; gap: 2px; padding: 2px 2px; align-items: center; flex-shrink: 0; }
  .pm-zone-options { background: var(--pm-bg-panel-light); display: flex; flex-wrap: wrap; gap: 2px; padding: 2px 2px; align-items: center; flex-shrink: 0; }
  .pm-zone-options .pm-btn { padding: 4px 6px; }
  .pm-toolbar-contextual { display: flex; flex-wrap: wrap; gap: 1px; align-items: center; background: var(--pm-bg-contextual); padding: 0; }
  .pm-zone-list { background: var(--pm-bg-panel-mid); flex: 1 1 0; overflow-y: auto; padding: 2px; min-height: 0; }
  
  .pm-zone-preview { background: var(--pm-bg-panel-dark); flex-shrink: 0; display: flex; align-items: stretch; position: relative; }
  .pm-preview-text { flex: 1; min-width: 0; padding: 5px 8px; font-size: 11px; color: var(--pm-green-text-bright); max-height: 64px; overflow-y: auto; white-space: pre-wrap; }
  .pm-preview-side { flex-shrink: 0; width: 20px; display: flex; flex-direction: column; gap: 1px; }
  .pm-preview-copy-btn, .pm-preview-mode-btn { flex: 1; display: flex; align-items: center; justify-content: center; background: #161616; border: none; color: var(--pm-text-faint); cursor: pointer; padding: 0; }
  .pm-preview-copy-btn:hover, .pm-preview-mode-btn:hover { color: var(--pm-text-bright); background: var(--pm-btn-bg); }

  /* --- Navigation Tabs --- */
  .pm-tab { position: relative; display: flex; align-items: center; gap: 2px; padding: 6px 6px 6px 0; background: var(--pm-tab-bg); cursor: pointer; color: var(--pm-text-dim); white-space: nowrap; border-radius: 0; min-width: 96px; box-sizing: border-box; }
  .pm-tab-colorbar { width: 6px; align-self: stretch; margin-right: 5px; flex-shrink: 0; }
  .pm-tab-icons { display: flex; align-items: center; gap: 4px; }
  .pm-tab-mini-btn { background: none; border: none; color: inherit; cursor: pointer; padding: 0; display: flex; opacity: 0.55; }
  .pm-tab-mini-btn:hover { opacity: 1; }
  .pm-tab-mini-btn.on-enable { opacity: 1; color: var(--pm-green-text-bright); }
  .pm-tab-mini-btn.on-dice { opacity: 1; color: var(--pm-locked-tab-text); }
  .pm-tab-sep { width: 1px; align-self: stretch; background: var(--pm-tab-sep-color); margin: 0 3px 0 3px; }
  .pm-tab:hover { color: var(--pm-text-bright); background: var(--pm-tab-hover); }
  .pm-tab.active { background: var(--pm-green-bg); color: var(--pm-text-bright); }
  .pm-tab.pm-tab-disabled { filter: brightness(0.65); }
  .pm-tab.pm-tab-disabled > * { opacity: 0.55; }
  .pm-tab.pm-tab-locked { background: var(--pm-locked-tab-bg); color: var(--pm-locked-tab-text); }
  .pm-tab.pm-tab-locked.active { background: var(--pm-locked-tab-active); color: var(--pm-text-bright); }
  .pm-tab .pm-count { color: #8a8a8a; font-size: 10px; }
  .pm-tab.active .pm-count { color: var(--pm-green-count-active); }
  
  .pm-tab.pm-tab-has-selection { background: var(--pm-tab-sel-bg); color: var(--pm-text-main); }
  .pm-tab.pm-tab-has-selection:hover { background: var(--pm-tab-sel-hover); color: var(--pm-text-bright); }
  .pm-tab.pm-tab-has-selection.active { background: var(--pm-green-bg); color: var(--pm-text-bright); }
  .pm-tab.pm-tab-has-selection .pm-count { color: var(--pm-tab-sel-count); }
  .pm-tab.pm-tab-has-selection.active .pm-count { color: var(--pm-green-count-active); }

  .pm-tab-add {
    background: var(--pm-tab-add-bg);
    color: #666;
    min-width: 28px;
    width: 28px;
    height: 28px;
    padding: 0;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
  }
  .pm-tab-add:hover { color: var(--pm-text-bright); background: var(--pm-green-bg); }

  /* Constant green underline indicator on active tab */
  .pm-tab.active::after {
    content: ""; position: absolute; bottom: 0; left: 0; right: 0;
    height: 3px; background: var(--pm-green-border); z-index: 2;
  }
  .pm-tab.pm-tab-disabled.active::after {
    filter: brightness(1.54);
  }

  /* --- Buttons & Inputs --- */
  .pm-btn { display: inline-flex; align-items: center; gap: 4px; background: var(--pm-btn-bg); border: none; color: var(--pm-text-muted); padding: 6px 8px; cursor: pointer; border-radius: 0; font-family: inherit; font-size: 11px; line-height: 1; }
  .pm-btn:hover { background: var(--pm-btn-hover); color: var(--pm-text-bright); }
  .pm-btn:disabled { opacity: 0.3; cursor: default; }
  .pm-btn:disabled:hover { background: var(--pm-btn-bg); color: var(--pm-text-muted); }
  .pm-btn.danger:hover { background: var(--pm-danger-hover); color: var(--pm-danger-text); }
  .pm-btn.primary { background: var(--pm-green-bg); color: var(--pm-green-text-light); }
  .pm-btn.primary:hover { background: var(--pm-green-hover); color: var(--pm-text-bright); }
  .pm-btn.accent-on { background: var(--pm-locked-tab-active); color: var(--pm-text-bright); }
  .pm-btn.pm-flash { background: var(--pm-green-hover); color: var(--pm-text-bright); transition: background 0.15s ease; }
  .pm-badge { font-size: 10px; background: rgba(255,255,255,0.15); padding: 0 4px; }

  .pm-btn.btn-tint-green { background: var(--pm-btn-bg); color: var(--pm-green-text-soft); }
  .pm-btn.btn-tint-green:hover { background: var(--pm-tint-green-hover); color: var(--pm-text-bright); }
  .pm-btn.btn-tint-purple { background: var(--pm-btn-bg); color: var(--pm-locked-tab-text); }
  .pm-btn.btn-tint-purple:hover { background: var(--pm-tint-purple-hover); color: var(--pm-text-bright); }
  .pm-btn.btn-tint-blue { background: var(--pm-btn-bg); color: var(--pm-text-muted); }
  .pm-btn.btn-tint-blue:hover { background: var(--pm-tint-blue-hover); color: var(--pm-text-bright); }
  .pm-btn.btn-tint-red { background: var(--pm-btn-bg); color: var(--pm-text-muted); }
  .pm-btn.btn-tint-red:hover { background: var(--pm-tint-red-hover); color: var(--pm-text-bright); }

  .pm-select { background: var(--pm-btn-bg); border: none; color: var(--pm-text-muted); font-family: inherit; font-size: 11px; max-width: 120px; border-radius: 0; box-sizing: border-box; }
  .pm-select-preset { height: 28px; padding: 2px 4px; }
  .pm-select-move { height: 24px; padding: 0px 4px; font-size: 10px; }
  .pm-hint { color: var(--pm-text-faint); font-size: 11px; }
  .pm-sep { width: 1px; height: 20px; background: var(--pm-sep-color); margin: 0 2px; }

  .pm-color-picker { display: flex; align-items: center; gap: 3px; background: var(--pm-bg-contextual); padding: 2px 4px; }
  .pm-color-swatch { width: 15px; height: 15px; border: none; cursor: pointer; padding: 0; flex-shrink: 0; }
  .pm-color-swatch:hover { outline: 1px solid var(--pm-text-bright); }
  .pm-color-none { background: repeating-linear-gradient(45deg,#3a3a3a,#3a3a3a 3px,#242424 3px,#242424 6px); }

  .pm-mode-list { display: flex; flex-direction: column; gap: 2px; }
  .pm-mode-grid { display: flex; flex-flow: row wrap; align-content: flex-start; gap: 3px; }

  /* --- List Mode Cards --- */
  .pm-card { display: flex; gap: 8px; background: var(--pm-bg-card); padding: 2px 6px; border-radius: 0; cursor: pointer; align-items: center; }
  .pm-card.selected { background: var(--pm-green-bg); outline: 2px solid var(--pm-green-border); outline-offset: -2px; }
  .pm-card.drag-over { background: var(--pm-drag-over-bg); }
  .pm-card-solo { flex-shrink: 0; color: var(--pm-text-faint); }
  .pm-card-solo:hover { color: var(--pm-text-bright); }
  .pm-thumb { width: 56px; height: 56px; object-fit: cover; background: #111; flex-shrink: 0; border-radius: 0; }
  .pm-thumb-empty { width: 56px; height: 56px; flex-shrink: 0; background: var(--pm-bg-panel-light); display: flex; align-items: center; justify-content: center; color: var(--pm-text-ghost); }
  .pm-card-body { flex: 1; min-width: 0; }
  .pm-card-name { font-weight: bold; color: var(--pm-text-soft); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .pm-card-prompt { color: #999; font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 2px; }
  .pm-card-actions { display: flex; gap: 6px; align-items: center; flex-shrink: 0; }
  .pm-card.pm-always-on { background: var(--pm-always-on-bg); outline: 2px solid var(--pm-always-on-border); outline-offset: -2px; }

  /* --- Grid Mode Tiles --- */
  .pm-tile {
    position: relative; display: flex; flex-direction: column;
    width: 110px; box-sizing: border-box; background: var(--pm-bg-tile);
    border-radius: 0; padding: 0; cursor: pointer; overflow: hidden;
    border: 2px solid transparent; flex-shrink: 0;
  }
  .pm-tile.selected { border-color: var(--pm-green-border); }
  .pm-tile.pm-always-on { border-color: var(--pm-always-on-border); }
  .pm-tile.drag-over { outline: 2px solid var(--pm-drag-over-border); outline-offset: -2px; }

  .pm-tile-media {
    position: relative; width: 100%; aspect-ratio: 1 / 1; overflow: hidden;
    box-sizing: border-box; background: #111;
  }
  .pm-tile-thumb { width: 100%; height: 100%; aspect-ratio: 1 / 1; object-fit: cover; background: #111; border-radius: 0; display: block; }
  .pm-tile-thumb-empty { width: 100%; height: 100%; aspect-ratio: 1 / 1; background: var(--pm-bg-panel-light); display: flex; align-items: center; justify-content: center; color: var(--pm-text-ghost); }

  .pm-tile-btncol {
    position: absolute; top: 0; left: 0; bottom: 0; width: 26px; z-index: 5;
    display: flex; flex-direction: column; background: transparent;
  }
  .pm-tile:hover .pm-tile-btncol,
  .pm-tile.menu-open .pm-tile-btncol {
    background: rgba(26, 26, 26, 0.85);
  }

  .pm-tile-btncol button {
    flex: 1 1 0; width: 100%; background: none; border: none;
    color: var(--pm-text-muted); display: flex; align-items: center; justify-content: center;
    cursor: pointer; padding: 0;
  }
  .pm-tile-btncol button:hover {
    color: var(--pm-text-bright); background: rgba(60, 60, 60, 0.7);
  }

  .pm-tile-btncol button.pm-tile-btn-select {
    flex: 2 1 0 !important;
    color: var(--pm-text-soft);
    background: rgba(26, 26, 26, 0.5);
  }
  .pm-tile-btncol button.pm-tile-btn-select:hover {
    color: var(--pm-text-bright); background: rgba(60, 60, 60, 0.7);
  }
  .pm-tile.selected .pm-tile-btncol button.pm-tile-btn-select {
    color: var(--pm-green-text-soft) !important;
    background: var(--pm-green-bg);
  }

  /* Always-on tile button states */
  .pm-tile .pm-tile-btncol button.pm-star-on {
    color: var(--pm-always-on-text) !important;
    background: var(--pm-always-on-bg) !important;
  }
  .pm-tile-btncol button.pm-star-on {
    opacity: 1 !important;
    pointer-events: auto !important;
  }

  .pm-tile-btncol button:not(.pm-tile-btn-select):not(.pm-star-on) { opacity: 0; pointer-events: none; }
  .pm-tile:hover .pm-tile-btncol button:not(.pm-tile-btn-select),
  .pm-tile.menu-open .pm-tile-btncol button:not(.pm-tile-btn-select) {
    opacity: 1; pointer-events: auto;
  }

  .pm-tile-name {
    width: 100%; box-sizing: border-box; height: 32px; padding: 0 4px;
    background: var(--pm-bg-panel-light); display: flex; align-items: center; justify-content: center; overflow: hidden;
  }
  .pm-tile-name-text {
    font-size: 11px; line-height: 1.25; color: var(--pm-text-soft); text-align: center; width: 100%;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }

  .pm-tile.selected .pm-tile-name { background: var(--pm-green-bg); }
  .pm-tile.pm-always-on .pm-tile-name { background: var(--pm-always-on-bg); }
  .pm-tile.selected .pm-tile-name-text, .pm-tile.pm-always-on .pm-tile-name-text { color: var(--pm-text-bright); }
  .pm-star-on { background: var(--pm-always-on-star-bg); color: var(--pm-always-on-text); }
  .pm-icon-warn { color: var(--pm-warn-color); }

  .pm-tile-menu-overlay {
    position: absolute; inset: 0; z-index: 20; background: rgba(18,18,18,0.92);
    display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(4, 1fr);
    gap: 1px; padding: 3px; box-sizing: border-box;
  }
  .pm-tile-grid-icon { display: flex; align-items: center; justify-content: center; background: none; border: none; color: #bbb; padding: 0; }
  .pm-tile-grid-icon:hover { color: var(--pm-text-bright); }
  .pm-icon-danger:hover { color: var(--pm-danger-text); }

  .pm-icon-btn { background: none; border: none; color: #999; cursor: pointer; display: flex; padding: 2px; }
  .pm-icon-btn:hover { color: var(--pm-text-bright); }

  /* --- Form & Dialogs --- */
  .pm-form { background: var(--pm-bg-panel-alt); padding: 8px; display: flex; flex-direction: column; gap: 6px; flex: 1; min-height: 0; }
  .pm-form input[type=text], .pm-form textarea { background: var(--pm-bg-input); border: none; color: var(--pm-text-main); font-family: inherit; font-size: 12px; padding: 6px; width: 100%; box-sizing: border-box; border-radius: 0; }
  .pm-form textarea { flex: 1; min-height: 0; resize: none; }
  .pm-form-top-row { display: flex; gap: 2px; align-items: center; }
  .pm-form-actions { display: flex; flex-wrap: wrap; gap: 2px; align-items: center; justify-content: flex-end; flex-shrink: 0; }
  .pm-form-actions .pm-btn { padding: 4px 6px; }

  .pm-empty-hint { color: var(--pm-text-ghost); text-align: center; padding: 16px 4px; font-style: italic; width: 100%; }
  .pm-raw-only-active .pm-zone-tabs,
  .pm-raw-only-active .pm-zone-options,
  .pm-raw-only-active .pm-zone-list { opacity: 0.35; }
  .pm-hidden-file { display: none; }
  `;
  document.head.appendChild(style);
}

// ---------------------------------------------------------------------------
// Helpers & Utilities
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
  data.rawOnly = typeof data.rawOnly === "boolean" ? data.rawOnly : false;
  data.labeledOutput = typeof data.labeledOutput === "boolean" ? data.labeledOutput : false;
  // Prompt-selection presets live inside the library data (and therefore
  // inside each json preset file), so every file keeps its own set.
  if (!data.selectionPresets || typeof data.selectionPresets !== "object" || Array.isArray(data.selectionPresets)) {
    data.selectionPresets = {};
  }

  const seen = new Set();
  let sections = data.sections
    .map((s) => ({
      key: (s && s.key) || uid(),
      label: (s && s.label) || (s && s.key) || "Section",
      enabled: s && s.enabled === false ? false : true,
      locked: !!(s && s.locked),
      randomizeOnQueue: !!(s && s.randomizeOnQueue),
      color: s && typeof s.color === "string" && SECTION_COLORS[s.color] ? s.color : null,
      addPeriod: s && s.addPeriod === false ? false : true,
    }))
    .filter((s) => {
      if (seen.has(s.key)) return false;
      seen.add(s.key);
      return true;
    });

  const rawIdx = sections.findIndex((s) => s.key === RAW_PROMPT_KEY);
  if (rawIdx === -1) {
    sections.unshift({
      key: RAW_PROMPT_KEY,
      label: "Prompt",
      enabled: true,
      locked: true,
      randomizeOnQueue: false,
      addPeriod: false,
    });
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
      allowRandom: it && it.allowRandom === false ? false : true,
      alwaysOn: !!(it && it.alwaysOn),
      noComma: !!(it && it.noComma),
    }));
  });

  return data;
}

function computePreview(data, rawText, rawOnly, labeledOutput) {
  if (rawOnly) return (rawText || "").trim();

  const parts = [];
  data.sections.forEach((s) => {
    if (!s.enabled) return;
    if (s.locked) {
      const t = (rawText || "").trim();
      if (t) parts.push({ label: s.label, text: t, addPeriod: false });
      return;
    }
    const items = data.categories[s.key] || [];
    const pieces = items
      .filter((it) => (it.alwaysOn || it.selected) && it.prompt && it.prompt.trim())
      .map((it) => [it.prompt.trim(), !!it.noComma]);
    if (!pieces.length) return;
    let joined = "";
    pieces.forEach(([text, noComma], i) => {
      joined += text;
      if (i < pieces.length - 1) joined += noComma ? " " : ", ";
    });
    parts.push({ label: s.label, text: joined, addPeriod: s.addPeriod !== false });
  });

  if (labeledOutput) {
    return parts
      .map((p) => {
        const text = p.addPeriod && !p.text.endsWith(".") ? p.text + "." : p.text;
        return `${p.label}: ${text}`;
      })
      .join("\n\n");
  }

  let out = "";
  parts.forEach((p, i) => {
    out += p.text;
    if (i < parts.length - 1) out += p.addPeriod ? ". " : " ";
  });
  return out;
}

function imageSrc(item) {
  if (!item || !item.image) return null;
  if (item.image.startsWith("data:")) return item.image;
  return `/prompt_manager/images/${item.image}`;
}

function cleanupServerImage(filename) {
  if (!filename || filename.startsWith("data:")) return;
  fetch(`/prompt_manager/images/${filename}`, { method: "DELETE" }).catch(() => {});
}

async function fetchImageAsDataURL(filename) {
  const res = await fetch(`/prompt_manager/images/${filename}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const blob = await res.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function embedImagesInItems(items) {
  for (const it of items) {
    if (it.image && !it.image.startsWith("data:")) {
      try {
        it.image = await fetchImageAsDataURL(it.image);
      } catch (e) {}
    }
  }
}

async function localizeImages(dataObj) {
  let changed = false;
  for (const key of Object.keys(dataObj.categories || {})) {
    const items = dataObj.categories[key] || [];
    for (const it of items) {
      if (it.image && it.image.startsWith("data:")) {
        try {
          const res = await fetchJSON("/prompt_manager/images", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: it.image }),
          });
          it.image = res.filename;
          changed = true;
        } catch (e) {
          console.warn("PromptManager: failed to localize an embedded image", e);
        }
      }
    }
  }
  return changed;
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

const renderRegistry = new WeakMap();
const applyHeightRegistry = new WeakMap();

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
      const allItems = n.pmData.categories[s.key] || [];
      const eligible = allItems.filter((it) => it.allowRandom !== false);
      if (!eligible.length) return;
      const rng = mulberry32(seedVal + hashStr(s.key));
      const idx = Math.floor(rng() * eligible.length);
      const chosenId = eligible[idx].id;
      allItems.forEach((it) => (it.selected = it.id === chosenId));
      changed = true;
    });
    if (changed) {
      dataWidget.value = JSON.stringify(n.pmData);
      const fn = renderRegistry.get(n);
      if (fn) fn();
    }
  });
}

// ---------------------------------------------------------------------------
// Extension Registration
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

    const onResize = nodeType.prototype.onResize;
    nodeType.prototype.onResize = function (size) {
      const r = onResize ? onResize.apply(this, arguments) : undefined;
      if (Array.isArray(size)) {
        if (typeof size[0] === "number") {
          this.size[0] = Math.max(320, size[0]);
        }
        if (typeof size[1] === "number") {
          this.pmDesiredHeight = Math.max(220, size[1]);
          this.size[1] = this.pmDesiredHeight;
        }
      }
      const applyFn = applyHeightRegistry.get(this);
      if (applyFn) applyFn();
      this.setDirtyCanvas(true, true);
      return r;
    };

    const onDrawForeground = nodeType.prototype.onDrawForeground;
    nodeType.prototype.onDrawForeground = function (ctx) {
      const r = onDrawForeground ? onDrawForeground.apply(this, arguments) : undefined;
      const applyFn = applyHeightRegistry.get(this);
      if (applyFn) applyFn();
      return r;
    };

    const onNodeCreated = nodeType.prototype.onNodeCreated;
    nodeType.prototype.onNodeCreated = function () {
      const r = onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined;
      const node = this;
      node.pmDesiredHeight = (node.size && node.size[1]) || node.pmDesiredHeight || 640;

      node.computeSize = function (out) {
        const minW = 320;
        const minH = 220;
        if (out) {
          out[0] = minW;
          out[1] = minH;
          return out;
        }
        return [minW, minH];
      };

      const dataWidget = node.widgets && node.widgets.find((w) => w.name === "prompt_data");
      const seedWidget = node.widgets && node.widgets.find((w) => w.name === "seed");
      const rawPromptWidget = node.widgets && node.widgets.find((w) => w.name === "raw_prompt");
      const previewModeWidget = node.widgets && node.widgets.find((w) => w.name === "preview_mode");

      if (dataWidget) {
        dataWidget.computeSize = () => [0, -4];
        if (dataWidget.inputEl) dataWidget.inputEl.style.display = "none";
        dataWidget.draw = function () {};
      }

      if (previewModeWidget) {
        previewModeWidget.computeSize = () => [0, -4];
        if (previewModeWidget.inputEl) previewModeWidget.inputEl.style.display = "none";
        previewModeWidget.draw = function () {};
        if (previewModeWidget.value !== "names") previewModeWidget.value = "text";
      }

      // Lock raw_prompt height strictly so canvas does not expand it during vertical resize
      if (rawPromptWidget) {
        const RAW_PROMPT_FIXED_HEIGHT = 80;
        rawPromptWidget.dynamic = false;
        if (!rawPromptWidget.options) rawPromptWidget.options = {};
        rawPromptWidget.options.maxHeight = RAW_PROMPT_FIXED_HEIGHT;
        rawPromptWidget.options.minHeight = RAW_PROMPT_FIXED_HEIGHT;
        if (rawPromptWidget.inputEl) {
          rawPromptWidget.inputEl.style.height = RAW_PROMPT_FIXED_HEIGHT + "px";
          rawPromptWidget.inputEl.style.maxHeight = RAW_PROMPT_FIXED_HEIGHT + "px";
          rawPromptWidget.inputEl.style.minHeight = RAW_PROMPT_FIXED_HEIGHT + "px";
          rawPromptWidget.inputEl.style.flex = `0 0 ${RAW_PROMPT_FIXED_HEIGHT}px`;
        }
        rawPromptWidget.computeSize = function (width) {
          return [width, RAW_PROMPT_FIXED_HEIGHT];
        };
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
        editBarOpen: false,
        colorPickerOpen: false,
        openTileMenuId: null,
        // Name of the json preset file this node's data is currently tied to
        // (selection presets are stored inside that file). null = blank / not
        // saved to any file yet.
        currentPresetName: null,
        // Currently selected prompt-selection preset name (for the dropdown).
        currentSelPreset: null,
      };

      function persist() {
        if (dataWidget) dataWidget.value = JSON.stringify(node.pmData);
        node.setDirtyCanvas(true, true);
      }

      function rawPromptValue() {
        return rawPromptWidget ? rawPromptWidget.value || "" : "";
      }

      function previewModeValue() {
        return previewModeWidget && previewModeWidget.value === "names" ? "names" : "text";
      }

      function activeItems() {
        if (!state.activeTab) return [];
        return node.pmData.categories[state.activeTab] || [];
      }

      function activeSection() {
        return node.pmData.sections.find((s) => s.key === state.activeTab) || null;
      }

      // --- Root & UI Containers ---
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
      const previewTextEl = document.createElement("div");
      previewTextEl.className = "pm-preview-text";

      const previewSideEl = document.createElement("div");
      previewSideEl.className = "pm-preview-side";

      const previewCopyBtn = document.createElement("button");
      previewCopyBtn.className = "pm-preview-copy-btn";
      previewCopyBtn.innerHTML = svgIcon("copy", 13);
      previewCopyBtn.title = "Copy the actual prompt output";
      previewCopyBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const text = computePreview(
          node.pmData,
          rawPromptValue(),
          !!node.pmData.rawOnly,
          !!node.pmData.labeledOutput
        );
        try {
          await navigator.clipboard.writeText(text);
          flashButton(previewCopyBtn);
        } catch (err) {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          try {
            document.execCommand("copy");
            flashButton(previewCopyBtn);
          } catch (err2) {}
          document.body.removeChild(ta);
        }
      });

      const previewModeBtn = document.createElement("button");
      previewModeBtn.className = "pm-preview-mode-btn";
      previewModeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const current = previewModeValue();
        const next = current === "names" ? "text" : "names";
        if (previewModeWidget) previewModeWidget.value = next;
        node.setDirtyCanvas(true, true);
        updatePreview();
      });

      previewSideEl.appendChild(previewCopyBtn);
      previewSideEl.appendChild(previewModeBtn);
      previewEl.appendChild(previewTextEl);
      previewEl.appendChild(previewSideEl);

      root.appendChild(presetRowEl);
      root.appendChild(tabsEl);
      root.appendChild(sectionToolbarEl);
      root.appendChild(formEl);
      root.appendChild(listEl);
      root.appendChild(previewEl);

      if (rawPromptWidget && rawPromptWidget.inputEl) {
        rawPromptWidget.inputEl.addEventListener("input", () => updatePreview());
      }

      // --- Hidden File Upload Inputs ---
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.className = "pm-hidden-file";
      root.appendChild(fileInput);
      let fileInputTarget = null;

      fileInput.addEventListener("change", async () => {
        const f = fileInput.files && fileInput.files[0];
        fileInput.value = "";
        if (!f || !fileInputTarget) return;
        const targetId = fileInputTarget;
        const item = activeItems().find((it) => it.id === targetId);
        if (!item) return;
        try {
          const dataUrl = await resizeImageFile(f);
          const res = await fetchJSON("/prompt_manager/images", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: dataUrl }),
          });
          const oldImage = item.image;
          item.image = res.filename;
          persist();
          renderList();
          cleanupServerImage(oldImage);
        } catch (e) {
          alert("Failed to upload image: " + e.message);
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

      // --- Section Handlers ---
      function toggleRandomizeOnQueue(sec) {
        sec.randomizeOnQueue = !sec.randomizeOnQueue;
        persist();
        renderAll();
      }

      function addSection() {
        const label = window.prompt("New section name:");
        if (!label || !label.trim()) return;
        const existingKeys = new Set(Object.keys(node.pmData.categories));
        const key = uniqueKey(slugify(label), existingKeys);
        node.pmData.sections.push({ key, label: label.trim(), enabled: true, locked: false, randomizeOnQueue: false, color: null, addPeriod: true });
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
        const removedItems = node.pmData.categories[sec.key] || [];
        if (!confirm(`Delete section "${sec.label}" and its ${removedItems.length} prompt(s)? This cannot be undone.`)) return;
        node.pmData.sections = node.pmData.sections.filter((s) => s.key !== sec.key);
        delete node.pmData.categories[sec.key];
        state.activeTab = node.pmData.sections.length ? node.pmData.sections[0].key : null;
        persist();
        renderAll();
        removedItems.forEach((it) => cleanupServerImage(it.image));
      }

      function toggleSectionEnabled(sec) {
        sec.enabled = !sec.enabled;
        persist();
        renderAll();
      }

      function enableAllSections() {
        node.pmData.sections.forEach((s) => (s.enabled = true));
        persist();
        renderAll();
      }

      function disableAllSections() {
        node.pmData.sections.forEach((s) => (s.enabled = false));
        persist();
        renderAll();
      }

      function randomizeAllSections() {
        node.pmData.sections.forEach((s) => {
          if (!s.locked) s.randomizeOnQueue = true;
        });
        persist();
        renderAll();
      }

      function disableRandomizeAllSections() {
        node.pmData.sections.forEach((s) => (s.randomizeOnQueue = false));
        persist();
        renderAll();
      }

      function soloSection(sec) {
        node.pmData.sections.forEach((s) => (s.enabled = s.key === sec.key));
        persist();
        renderAll();
      }

      async function exportSection() {
        const sec = activeSection();
        if (!sec || sec.locked) return;
        const items = JSON.parse(JSON.stringify(activeItems()));
        await embedImagesInItems(items);
        const payload = { pmSection: true, label: sec.label, items };
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
        node.pmData.sections.push({ key, label: finalLabel, enabled: true, locked: false, randomizeOnQueue: false, color: null, addPeriod: true });
        node.pmData.categories[key] = items.map((it) => ({
          id: uid(),
          name: (it && it.name) || "",
          prompt: (it && it.prompt) || "",
          image: (it && it.image) || null,
          selected: false,
          allowRandom: it && it.allowRandom === false ? false : true,
          alwaysOn: !!(it && it.alwaysOn),
          noComma: !!(it && it.noComma),
        }));
        state.activeTab = key;
        persist();
        renderAll();
        localizeImages(node.pmData).then((changed) => {
          if (changed) {
            persist();
            renderAll();
          }
        });
      }

      // --- Presets Management ---
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
        renderPresetRow();
        return { names, last };
      }

      async function loadPresetByName(name) {
        const parsed = await fetchJSON(`/prompt_manager/presets/${encodeURIComponent(name)}`);
        node.pmData = sanitizeData(parsed);
        state.currentPresetName = name;
        state.currentSelPreset = null;
        state.activeTab = node.pmData.sections.length ? node.pmData.sections[0].key : null;
        persist();
        renderAll();
        localizeImages(node.pmData).then((changed) => {
          if (changed) {
            persist();
            renderAll();
          }
        });
        fetch("/prompt_manager/last_used", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }).catch(() => {});
      }

      // --- Prompt-selection presets -------------------------------------------
      // A selection preset is a snapshot of which items are selected in each
      // section (stored per json preset file under "selectionPresets").

      function captureSelection() {
        const sel = {};
        node.pmData.sections.forEach((s) => {
          if (s.locked) return;
          sel[s.key] = (node.pmData.categories[s.key] || [])
            .filter((it) => it.selected)
            .map((it) => it.id);
        });
        return sel;
      }

      function applySelectionPreset(name) {
        const sel = (node.pmData.selectionPresets || {})[name];
        if (!sel || typeof sel !== "object") {
          alert(`Selection preset "${name}" not found.`);
          return;
        }
        Object.keys(sel).forEach((key) => {
          const ids = Array.isArray(sel[key]) ? sel[key] : [];
          const items = node.pmData.categories[key] || [];
          items.forEach((it) => (it.selected = ids.includes(it.id)));
        });
        state.currentSelPreset = name;
        persist();
        renderAll();
      }

      // Writes the in-memory selection presets into the json preset file the
      // node is currently tied to. Only the "selectionPresets" key of the file
      // is touched, so unsaved library edits are never written to disk.
      async function syncSelectionPresetsToFile() {
        const file = state.currentPresetName;
        if (!file) return;
        try {
          await fetchJSON(`/prompt_manager/presets/${encodeURIComponent(file)}/selections`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ selectionPresets: node.pmData.selectionPresets || {} }),
          });
        } catch (e) {
          console.warn("PromptManager: failed to save selection presets into the json file", e);
        }
      }

      const presetSelect = document.createElement("select");
      presetSelect.className = "pm-select pm-select-preset";
      presetSelect.title = "Saved presets";
      presetSelect.addEventListener("change", async () => {
        const name = presetSelect.value;
        if (!name) return;
        try {
          await loadPresetByName(name);
        } catch (e) {
          alert("Failed to load preset: " + e.message);
        }
      });

      // --- Buttons Helper ---
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

      function flashButton(btn) {
        if (!btn) return;
        btn.classList.add("pm-flash");
        setTimeout(() => btn.classList.remove("pm-flash"), 650);
      }

      // --- Render: Tabs ---
      let sectionDragSrc = null;

      function renderTabs() {
        tabsEl.innerHTML = "";
        node.pmData.sections.forEach((s, index) => {
          const tab = document.createElement("div");
          const tabItems = node.pmData.categories[s.key] || [];
          const totalCount = s.locked ? 0 : tabItems.length;
          const selectedCount = s.locked ? 0 : tabItems.filter((it) => it.selected || it.alwaysOn).length;
          const hasSelection = selectedCount > 0;
          const count = s.locked ? "" : `${selectedCount}/${totalCount}`;
          
          tab.className =
            "pm-tab" +
            (state.activeTab === s.key ? " active" : "") +
            (hasSelection ? " pm-tab-has-selection" : "") +
            (s.locked ? " pm-tab-locked" : "") +
            (!s.enabled ? " pm-tab-disabled" : "");
          tab.draggable = true;

          const colorBar = document.createElement("span");
          colorBar.className = "pm-tab-colorbar";
          colorBar.style.background = s.locked ? "var(--pm-locked-tab-bar)" : s.color ? SECTION_COLORS[s.color] : "transparent";
          tab.appendChild(colorBar);

          const iconsWrap = document.createElement("div");
          iconsWrap.className = "pm-tab-icons";

          const enableBtn = document.createElement("button");
          enableBtn.className = "pm-tab-mini-btn" + (s.enabled ? " on-enable" : "");
          enableBtn.innerHTML = svgIcon(s.enabled ? "eye" : "eyeOff", 13);
          enableBtn.title = s.enabled ? "Section enabled — click to disable" : "Section disabled — click to enable";
          enableBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleSectionEnabled(s);
          });
          iconsWrap.appendChild(enableBtn);

          if (!s.locked) {
            const diceBtn = document.createElement("button");
            diceBtn.className = "pm-tab-mini-btn" + (s.randomizeOnQueue ? " on-dice" : "");
            diceBtn.innerHTML = svgIcon("dice", 13);
            diceBtn.title = s.randomizeOnQueue
              ? "Randomize on queue: ON — click to disable"
              : "Randomize on queue: OFF — click to enable";
            diceBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              toggleRandomizeOnQueue(s);
            });
            iconsWrap.appendChild(diceBtn);
          }

          tab.appendChild(iconsWrap);

          const sep0 = document.createElement("span");
          sep0.className = "pm-tab-sep";
          tab.appendChild(sep0);

          const label = document.createElement("span");
          label.textContent = s.label;
          tab.appendChild(label);

          const sep1 = document.createElement("span");
          sep1.className = "pm-tab-sep";
          tab.appendChild(sep1);

          if (!s.locked) {
            const countEl = document.createElement("span");
            countEl.className = "pm-count";
            countEl.textContent = count;
            tab.appendChild(countEl);
          }

          tab.addEventListener("click", () => {
            state.activeTab = s.key;
            state.colorPickerOpen = false;
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

      // --- Render: Preset Toolbar ---
      function renderPresetRow() {
        presetRowEl.innerHTML = "";

        presetRowEl.appendChild(
          mkBtn("filePlus", "", "Start a new, blank preset (discards unsaved changes here)", () => {
            if (!confirm("Start a new blank preset? Any unsaved changes here will be lost.")) return;
            node.pmData = sanitizeData({});
            state.activeTab = node.pmData.sections.length ? node.pmData.sections[0].key : null;
            state.currentPresetName = null;
            state.currentSelPreset = null;
            presetSelect.value = "";
            persist();
            renderAll();
          })
        );

        presetRowEl.appendChild(presetSelect);

        const saveBtn = mkBtn("save", "btn-tint-blue", "Save current library as a new preset", async () => {
          const suggested = presetSelect.value || "";
          const name = window.prompt("Save as:", suggested);
          if (!name || !name.trim()) return;
          const clean = name.trim();
          try {
            const embedded = JSON.parse(JSON.stringify(node.pmData));
            for (const key of Object.keys(embedded.categories)) {
              await embedImagesInItems(embedded.categories[key]);
            }
            await fetchJSON(`/prompt_manager/presets/${encodeURIComponent(clean)}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(embedded),
            });
            await refreshPresetSelect(clean);
            state.currentPresetName = clean;
            flashButton(saveBtn);
          } catch (e) {
            alert("Failed to save preset: " + e.message);
          }
        });
        presetRowEl.appendChild(saveBtn);

        const reloadBtn = mkBtn("refresh", "", "Reload selected preset (discards unsaved changes here)", async () => {
          const current = presetSelect.value;
          if (!current) return;
          if (!confirm(`Reload preset "${current}"? Any unsaved changes here will be lost.`)) return;
          try {
            await loadPresetByName(current);
          } catch (e) {
            alert("Failed to reload preset: " + e.message);
          }
        });
        reloadBtn.disabled = !presetSelect.value;
        presetRowEl.appendChild(reloadBtn);

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
            if (state.currentPresetName === current) state.currentPresetName = newName.trim();
            await refreshPresetSelect(newName.trim());
          } catch (e) {
            alert("Failed to rename preset: " + e.message);
          }
        });
        renameBtn.disabled = !presetSelect.value;
        presetRowEl.appendChild(renameBtn);

        const delBtn = mkBtn("trash", "btn-tint-red", "Delete selected preset", async () => {
          const current = presetSelect.value;
          if (!current) return;
          if (!confirm(`Delete preset "${current}"? This cannot be undone.`)) return;
          try {
            await fetch(`/prompt_manager/presets/${encodeURIComponent(current)}`, { method: "DELETE" });
            if (state.currentPresetName === current) state.currentPresetName = null;
            await refreshPresetSelect("");
          } catch (e) {
            alert("Failed to delete preset: " + e.message);
          }
        });
        delBtn.disabled = !presetSelect.value;
        presetRowEl.appendChild(delBtn);

        // --- Prompt-selection presets -----------------------------------------
        // A separate group between the preset-management buttons and the
        // view/output toggles. Selection presets are saved per json preset
        // file (stored inside the file under "selectionPresets").
        const sepSel = document.createElement("div");
        sepSel.className = "pm-sep";
        presetRowEl.appendChild(sepSel);

        const selSelect = document.createElement("select");
        selSelect.className = "pm-select pm-select-preset";
        selSelect.title = "Saved prompt-selection presets — each json preset file keeps its own set";
        selSelect.addEventListener("change", () => {
          const name = selSelect.value;
          if (!name) return;
          applySelectionPreset(name);
        });
        presetRowEl.appendChild(selSelect);

        const selNames = Object.keys(node.pmData.selectionPresets || {});
        const selPlaceholder = document.createElement("option");
        selPlaceholder.value = "";
        selPlaceholder.textContent = "—";
        selSelect.appendChild(selPlaceholder);
        selNames.forEach((n) => {
          const opt = document.createElement("option");
          opt.value = n;
          opt.textContent = n;
          selSelect.appendChild(opt);
        });
        selSelect.value = selNames.includes(state.currentSelPreset) ? state.currentSelPreset : "";

        const selSaveBtn = mkBtn(
          "save",
          "btn-tint-blue",
          "Save the current prompt selection as a selection preset (stored inside this json file)",
          async () => {
            const suggested = state.currentSelPreset || "";
            const name = window.prompt("Save current selection as:", suggested);
            if (!name || !name.trim()) return;
            const clean = name.trim();
            if (!node.pmData.selectionPresets) node.pmData.selectionPresets = {};
            node.pmData.selectionPresets[clean] = captureSelection();
            state.currentSelPreset = clean;
            persist();
            renderPresetRow();
            await syncSelectionPresetsToFile();
            flashButton(selSaveBtn);
          }
        );
        presetRowEl.appendChild(selSaveBtn);

        const selRenameBtn = mkBtn("edit", "", "Rename the selected selection preset", async () => {
          const current = selSelect.value;
          if (!current) return;
          const newName = window.prompt("Rename selection preset:", current);
          if (!newName || !newName.trim() || newName.trim() === current) return;
          const clean = newName.trim();
          const map = node.pmData.selectionPresets || {};
          if (map[clean]) {
            alert(`A selection preset named "${clean}" already exists.`);
            return;
          }
          map[clean] = map[current];
          delete map[current];
          state.currentSelPreset = clean;
          persist();
          renderPresetRow();
          await syncSelectionPresetsToFile();
        });
        selRenameBtn.disabled = !selSelect.value;
        presetRowEl.appendChild(selRenameBtn);

        const selDelBtn = mkBtn("trash", "btn-tint-red", "Delete the selected selection preset", async () => {
          const current = selSelect.value;
          if (!current) return;
          if (!confirm(`Delete selection preset "${current}"? This cannot be undone.`)) return;
          delete (node.pmData.selectionPresets || {})[current];
          state.currentSelPreset = null;
          persist();
          renderPresetRow();
          await syncSelectionPresetsToFile();
        });
        selDelBtn.disabled = !selSelect.value;
        presetRowEl.appendChild(selDelBtn);

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

        const sep2 = document.createElement("div");
        sep2.className = "pm-sep";
        presetRowEl.appendChild(sep2);

        const rawOnlyOn = !!node.pmData.rawOnly;
        presetRowEl.appendChild(
          mkBtn(
            "type",
            rawOnlyOn ? "accent-on" : "",
            rawOnlyOn
              ? "Raw prompt only: ON — sections are ignored, output = text box above"
              : "Raw prompt only: OFF — click to output ONLY the text box above, ignoring all sections",
            () => {
              node.pmData.rawOnly = !node.pmData.rawOnly;
              persist();
              renderAll();
            }
          )
        );

        const labeledOn = !!node.pmData.labeledOutput;
        presetRowEl.appendChild(
          mkBtn(
            "tag",
            labeledOn ? "accent-on" : "",
            labeledOn
              ? 'Labeled output: ON — "Section: prompts" on its own line per section'
              : "Labeled output: OFF — click to prefix each section with its name, one per line",
            () => {
              node.pmData.labeledOutput = !node.pmData.labeledOutput;
              persist();
              renderAll();
            }
          )
        );

        const sep3 = document.createElement("div");
        sep3.className = "pm-sep";
        presetRowEl.appendChild(sep3);

        presetRowEl.appendChild(mkBtn("eye", "btn-tint-green", "Enable all sections", enableAllSections));
        presetRowEl.appendChild(mkBtn("eyeOff", "btn-tint-green", "Disable all sections", disableAllSections));

        const sep4 = document.createElement("div");
        sep4.className = "pm-sep";
        presetRowEl.appendChild(sep4);

        presetRowEl.appendChild(mkBtn("dice", "btn-tint-purple", "Randomize on queue: ON for all sections", randomizeAllSections));
        presetRowEl.appendChild(
          mkBtn("diceOff", "btn-tint-purple", "Randomize on queue: OFF for all sections", disableRandomizeAllSections)
        );
      }

      // --- Render: Section Toolbar ---
      function renderSectionToolbar() {
        sectionToolbarEl.innerHTML = "";
        const sec = activeSection();
        if (!sec) return;

        if (sec.locked) {
          const hint = document.createElement("span");
          hint.className = "pm-hint";
          hint.textContent = "Raw text — edit the box above. Drag this tab to reposition it.";
          sectionToolbarEl.appendChild(hint);
          sectionToolbarEl.appendChild(
            mkBtn("target", "", "Enable only this section (disables all others)", () => soloSection(sec))
          );
          return;
        }

        const items = activeItems();
        const selectedCount = items.filter((it) => it.selected).length;
        const hasSelection = selectedCount > 0;
        const hasClipboard = state.clipboard.length > 0;

        sectionToolbarEl.appendChild(mkBtn("plus", "primary", "Add prompt", () => openForm(null)));

        const sep0a = document.createElement("div");
        sep0a.className = "pm-sep";
        sectionToolbarEl.appendChild(sep0a);

        sectionToolbarEl.appendChild(
          mkBtn("target", "", "Enable only this section (disables all others)", () => soloSection(sec))
        );

        const sep0b = document.createElement("div");
        sep0b.className = "pm-sep";
        sectionToolbarEl.appendChild(sep0b);

        sectionToolbarEl.appendChild(mkBtn("upload", "", "Export this section", exportSection));
        sectionToolbarEl.appendChild(mkBtn("download", "", "Import a section", () => importInput.click()));

        const sep1 = document.createElement("div");
        sep1.className = "pm-sep";
        sectionToolbarEl.appendChild(sep1);

        if (!sec.locked) {
                  const colorBtn = mkBtn(
                    "palette",
                    state.colorPickerOpen ? "accent-on" : "",
                    "Set this section's color bar",
                    () => {
                      state.colorPickerOpen = !state.colorPickerOpen;
                      renderSectionToolbar();
                    }
                  );
                  if (sec.color && SECTION_COLORS[sec.color]) {
                    colorBtn.style.background = SECTION_COLORS[sec.color];
                    colorBtn.style.color = "#fff";
                  }
                  sectionToolbarEl.appendChild(colorBtn);

          if (state.colorPickerOpen) {
            const picker = document.createElement("div");
            picker.className = "pm-color-picker";

            const noneSwatch = document.createElement("button");
            noneSwatch.className = "pm-color-swatch pm-color-none";
            noneSwatch.title = "No color";
            noneSwatch.addEventListener("click", (e) => {
              e.stopPropagation();
              sec.color = null;
              state.colorPickerOpen = false;
              persist();
              renderAll();
            });
            picker.appendChild(noneSwatch);

            Object.keys(SECTION_COLORS).forEach((key) => {
              const sw = document.createElement("button");
              sw.className = "pm-color-swatch";
              sw.style.background = SECTION_COLORS[key];
              sw.title = key;
              sw.addEventListener("click", (e) => {
                e.stopPropagation();
                sec.color = key;
                state.colorPickerOpen = false;
                persist();
                renderAll();
              });
              picker.appendChild(sw);
            });

            sectionToolbarEl.appendChild(picker);
          }

          sectionToolbarEl.appendChild(
            mkBtn(
              sec.addPeriod === false ? "periodOff" : "period",
              sec.addPeriod === false ? "pm-icon-warn" : "",
              sec.addPeriod === false
                ? "No trailing period after this section — click to restore it"
                : "Trailing period after this section — click to remove it",
              () => {
                sec.addPeriod = sec.addPeriod === false ? true : false;
                persist();
                renderAll();
              }
            )
          );
        }

        sectionToolbarEl.appendChild(mkBtn("edit", "", "Rename section", renameSection));

        const canDelete = node.pmData.sections.filter((s) => !s.locked).length > 1;
        const deleteSecBtn = mkBtn("trash", "btn-tint-red", "Delete section", deleteSection);
        deleteSecBtn.disabled = !canDelete;
        sectionToolbarEl.appendChild(deleteSecBtn);

        const sep1b = document.createElement("div");
        sep1b.className = "pm-sep";
        sectionToolbarEl.appendChild(sep1b);

        sectionToolbarEl.appendChild(
          mkBtn(
            "more",
            state.editBarOpen ? "accent-on" : "",
            state.editBarOpen ? "Hide edit actions" : "Show edit actions (delete, copy, cut, paste, move, rename...)",
            () => {
              state.editBarOpen = !state.editBarOpen;
              renderSectionToolbar();
            }
          )
        );

        if (state.editBarOpen) {
          const ctx = document.createElement("div");
          ctx.className = "pm-toolbar-contextual";

          const delBtn = mkBtn(
            "trash",
            "danger",
            "Delete selected",
            () => {
              const removed = items.filter((it) => it.selected);
              node.pmData.categories[state.activeTab] = items.filter((it) => !it.selected);
              persist();
              renderAll();
              removed.forEach((it) => cleanupServerImage(it.image));
            },
            selectedCount || ""
          );
          delBtn.disabled = !hasSelection;
          ctx.appendChild(delBtn);

          const copyBtn = mkBtn(
            "copy",
            "",
            "Copy selected",
            () => {
              state.clipboard = items.filter((it) => it.selected).map((it) => ({ ...it }));
              renderSectionToolbar();
            },
            selectedCount || ""
          );
          copyBtn.disabled = !hasSelection;
          ctx.appendChild(copyBtn);

          const cutBtn = mkBtn(
            "cut",
            "",
            "Cut selected",
            () => {
              state.clipboard = items.filter((it) => it.selected).map((it) => ({ ...it }));
              node.pmData.categories[state.activeTab] = items.filter((it) => !it.selected);
              persist();
              renderAll();
            },
            selectedCount || ""
          );
          cutBtn.disabled = !hasSelection;
          ctx.appendChild(cutBtn);

          const pasteBtn = mkBtn(
            "paste",
            "",
            "Paste into this section",
            () => {
              const clones = state.clipboard.map((it) => ({ ...it, id: uid(), selected: false }));
              node.pmData.categories[state.activeTab] = activeItems().concat(clones);
              persist();
              renderAll();
            },
            state.clipboard.length || ""
          );
          pasteBtn.disabled = !hasClipboard;
          ctx.appendChild(pasteBtn);

          const moveWrap = document.createElement("span");
          moveWrap.style.display = "inline-flex";
          moveWrap.style.alignItems = "center";
          moveWrap.style.gap = "3px";
          const moveIcon = document.createElement("span");
          moveIcon.style.color = "#999";
          moveIcon.innerHTML = svgIcon("move", 14);
          moveWrap.appendChild(moveIcon);
          const moveSelect = document.createElement("select");
          moveSelect.className = "pm-select pm-select-move";
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
          moveSelect.disabled = !hasSelection;
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
          ctx.appendChild(moveWrap);

          const clearBtn = mkBtn("close", "", "Clear selection (this section only)", () => {
            items.forEach((it) => (it.selected = false));
            persist();
            renderAll();
          });
          clearBtn.disabled = !hasSelection;
          ctx.appendChild(clearBtn);

          sectionToolbarEl.appendChild(ctx);
        }
      }

      // --- Render: Add / Edit Form ---
      function openForm(item) {
        formEl.style.display = "flex";
        formEl.className = "pm-form";
        formEl.innerHTML = "";
        listEl.style.display = "none";

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.placeholder = "Name";
        nameInput.value = item ? item.name : "";
        nameInput.style.flex = "1";
        nameInput.style.minWidth = "0";

        const promptInput = document.createElement("textarea");
        promptInput.placeholder = "Prompt text (injected into the final output)";
        promptInput.value = item ? item.prompt : "";

        const actions = document.createElement("div");
        actions.className = "pm-form-actions";

        const copyTextBtn = mkBtn("copy", "", "Copy the prompt text", async () => {
          try {
            await navigator.clipboard.writeText(promptInput.value);
            flashButton(copyTextBtn);
          } catch (err) {
            const ta = document.createElement("textarea");
            ta.value = promptInput.value;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            try {
              document.execCommand("copy");
              flashButton(copyTextBtn);
            } catch (err2) {}
            document.body.removeChild(ta);
          }
        });

        const pasteTextBtn = mkBtn("paste", "", "Paste — overwrites the current text", async () => {
          try {
            const text = await navigator.clipboard.readText();
            promptInput.value = text;
            flashButton(pasteTextBtn);
          } catch (err) {
            alert("Couldn't read the clipboard (browser permission needed). Paste with Ctrl+V into the text box instead.");
          }
        });

        const clearTextBtn = mkBtn("backspace", "", "Clear the prompt text", () => {
          promptInput.value = "";
          promptInput.focus();
        });

        const formSep = document.createElement("div");
        formSep.className = "pm-sep";

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
          } else {
            activeItems().push({
              id: uid(),
              name,
              prompt: promptText,
              image: null,
              selected: false,
              allowRandom: true,
              alwaysOn: false,
              noComma: false,
            });
          }
          persist();
          closeForm();
          renderAll();
        });
        actions.appendChild(copyTextBtn);
        actions.appendChild(pasteTextBtn);
        actions.appendChild(clearTextBtn);
        actions.appendChild(formSep);
        actions.appendChild(cancelBtn);
        actions.appendChild(saveBtn);

        const topRow = document.createElement("div");
        topRow.className = "pm-form-top-row";
        topRow.appendChild(nameInput);
        topRow.appendChild(actions);

        formEl.appendChild(topRow);
        formEl.appendChild(promptInput);
      }

      function closeForm() {
        formEl.style.display = "none";
        formEl.innerHTML = "";
        listEl.style.display = "";
      }

      // --- Render: Cards & Tiles List ---
      let itemDragSrc = null;

      function soloSelect(item) {
        activeItems().forEach((it) => (it.selected = it.id === item.id));
        state.openTileMenuId = null;
        persist();
        renderAll();
      }

      function toggleSelect(item) {
        item.selected = !item.selected;
        state.openTileMenuId = null;
        persist();
        renderTabs();
        renderList();
        renderSectionToolbar();
        updatePreview();
      }

      function buildEditButtons(item, onBeforeAction) {
        const editBtn = document.createElement("button");
        editBtn.className = "pm-icon-btn";
        editBtn.innerHTML = svgIcon("edit", 16);
        editBtn.title = "Edit text";
        editBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (onBeforeAction) onBeforeAction();
          openForm(item);
        });
        const imgBtn = document.createElement("button");
        imgBtn.className = "pm-icon-btn";
        imgBtn.innerHTML = svgIcon("image", 16);
        imgBtn.title = "Edit image";
        imgBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (onBeforeAction) onBeforeAction();
          fileInputTarget = item.id;
          fileInput.click();
        });
        const randBtn = document.createElement("button");
        randBtn.className = "pm-icon-btn" + (item.allowRandom === false ? " pm-icon-warn" : "");
        randBtn.innerHTML = svgIcon(item.allowRandom === false ? "diceOff" : "dice", 16);
        randBtn.title =
          item.allowRandom === false
            ? "Excluded from randomize-on-queue — click to include"
            : "Included in randomize-on-queue — click to exclude";
        randBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (onBeforeAction) onBeforeAction();
          item.allowRandom = item.allowRandom === false ? true : false;
          persist();
          renderList();
          updatePreview();
        });
        const commaBtn = document.createElement("button");
        commaBtn.className = "pm-icon-btn" + (item.noComma ? " pm-icon-warn" : "");
        commaBtn.innerHTML = svgIcon(item.noComma ? "commaOff" : "comma", 16);
        commaBtn.title = item.noComma
          ? "No comma after this prompt (space only) — click to restore the comma"
          : "Comma after this prompt — click to remove it (keeps the space)";
        commaBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (onBeforeAction) onBeforeAction();
          item.noComma = !item.noComma;
          persist();
          renderList();
          updatePreview();
        });
        const delBtn = document.createElement("button");
        delBtn.className = "pm-icon-btn pm-icon-danger";
        delBtn.innerHTML = svgIcon("trash", 16);
        delBtn.title = "Delete";
        delBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (onBeforeAction) onBeforeAction();
          node.pmData.categories[state.activeTab] = activeItems().filter((it) => it.id !== item.id);
          persist();
          renderAll();
          cleanupServerImage(item.image);
        });
        return [editBtn, imgBtn, randBtn, commaBtn, delBtn];
      }

      function makeEditActions(item) {
        const wrap = document.createElement("div");
        wrap.className = "pm-card-actions";
        buildEditButtons(item).forEach((b) => wrap.appendChild(b));
        return wrap;
      }

      function makeSoloButton(item, cls) {
        const b = document.createElement("button");
        b.className = cls;
        b.innerHTML = svgIcon("target", 13);
        b.title = "Select only this one (deselects the rest of the section)";
        b.addEventListener("click", (e) => {
          e.stopPropagation();
          soloSelect(item);
        });
        return b;
      }

      function makeAlwaysOnButton(item, cls) {
        const b = document.createElement("button");
        b.className = cls + (item.alwaysOn ? " pm-star-on" : "");
        b.innerHTML = svgIcon("star", 13);
        b.title = item.alwaysOn
          ? "Always on: ON — always included in the output while this section is enabled, click to turn off"
          : "Always on: OFF — click to always include this prompt regardless of selection";
        b.addEventListener("click", (e) => {
          e.stopPropagation();
          item.alwaysOn = !item.alwaysOn;
          persist();
          renderAll();
        });
        return b;
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
        card.className =
          "pm-card" + (item.selected ? " selected" : "") + (item.alwaysOn ? " pm-always-on" : "");
        attachDragReorder(card, index);
        card.title = "Drag anywhere on the card to reorder";

        const soloBtn = makeSoloButton(item, "pm-icon-btn pm-card-solo");
        const alwaysBtn = makeAlwaysOnButton(item, "pm-icon-btn pm-card-solo");

        let thumbEl;
        const src = imageSrc(item);
        if (src) {
          thumbEl = document.createElement("img");
          thumbEl.className = "pm-thumb";
          thumbEl.src = src;
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

        card.appendChild(soloBtn);
        card.appendChild(alwaysBtn);
        card.appendChild(thumbEl);
        card.appendChild(body);
        card.appendChild(makeEditActions(item));
        return card;
      }

      function renderGridModeTile(item, index) {
        const tile = document.createElement("div");
        tile.className =
          "pm-tile" +
          (item.selected ? " selected" : "") +
          (item.alwaysOn ? " pm-always-on" : "") +
          (state.openTileMenuId === item.id ? " menu-open" : "");
        attachDragReorder(tile, index);

        tile.addEventListener("mouseleave", () => {
          if (state.openTileMenuId === item.id) {
            state.openTileMenuId = null;
            renderList();
          }
        });

        const mediaWrap = document.createElement("div");
        mediaWrap.className = "pm-tile-media";

        const btnCol = document.createElement("div");
        btnCol.className = "pm-tile-btncol";

        const soloBtn = makeSoloButton(item, "pm-tile-btn-select");
        btnCol.appendChild(soloBtn);

        const alwaysBtn = makeAlwaysOnButton(item, "");
        alwaysBtn.innerHTML = svgIcon("star", 12);
        btnCol.appendChild(alwaysBtn);

        const [editBtn, imgBtn, randBtn, commaBtn, delBtn] = buildEditButtons(item, () => {
          state.openTileMenuId = null;
        });

        const menuBtn = document.createElement("button");
        menuBtn.innerHTML = svgIcon("more", 12);
        menuBtn.title = "More actions";
        menuBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          state.openTileMenuId = state.openTileMenuId === item.id ? null : item.id;
          renderList();
        });
        btnCol.appendChild(menuBtn);

        editBtn.innerHTML = svgIcon("edit", 12);
        btnCol.appendChild(editBtn);

        mediaWrap.appendChild(btnCol);

        let thumbEl;
        const src = imageSrc(item);
        if (src) {
          thumbEl = document.createElement("img");
          thumbEl.className = "pm-tile-thumb";
          thumbEl.src = src;
        } else {
          thumbEl = document.createElement("div");
          thumbEl.className = "pm-tile-thumb-empty";
          thumbEl.innerHTML = svgIcon("image", 26);
        }
        thumbEl.title = item.prompt || "";
        mediaWrap.appendChild(thumbEl);

        if (state.openTileMenuId === item.id) {
          const overlay = document.createElement("div");
          overlay.className = "pm-tile-menu-overlay";
          overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
              state.openTileMenuId = null;
              renderList();
            }
          });
          [imgBtn, randBtn, commaBtn, delBtn].forEach((b) => {
            b.classList.add("pm-tile-grid-icon");
            overlay.appendChild(b);
          });
          mediaWrap.appendChild(overlay);
        }

        tile.appendChild(mediaWrap);

        const nameEl = document.createElement("div");
        nameEl.className = "pm-tile-name";
        nameEl.title = item.prompt || "";
        const nameTextEl = document.createElement("span");
        nameTextEl.className = "pm-tile-name-text";
        nameTextEl.textContent = item.name || "(unnamed)";
        nameEl.appendChild(nameTextEl);
        tile.appendChild(nameEl);

        tile.addEventListener("click", () => toggleSelect(item));

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

      function renderNamesPreview() {
        previewTextEl.innerHTML = "";
        const rawOnlyOn = !!node.pmData.rawOnly;
        if (rawOnlyOn) {
          previewTextEl.textContent = rawPromptValue().trim() || "(nothing selected)";
          return;
        }
        const labeledOn = !!node.pmData.labeledOutput;
        let any = false;

        node.pmData.sections.forEach((s) => {
          if (!s.enabled) return;
          const color = s.locked ? "var(--pm-locked-tab-bar)" : s.color ? SECTION_COLORS[s.color] : null;
          let names = [];
          if (s.locked) {
            const t = rawPromptValue().trim();
            if (t) names = [[t, true]];
          } else {
            const items = node.pmData.categories[s.key] || [];
            names = items
              .filter((it) => (it.alwaysOn || it.selected) && it.prompt && it.prompt.trim())
              .map((it) => [it.name && it.name.trim() ? it.name.trim() : it.prompt.trim(), !!it.noComma]);
          }
          if (!names.length) return;
          any = true;
          const addPeriod = s.addPeriod !== false;

          const lineEl = document.createElement(labeledOn ? "div" : "span");
          if (labeledOn) {
            const labelSpan = document.createElement("span");
            labelSpan.textContent = s.label + ": ";
            labelSpan.style.color = "var(--pm-text-faint)";
            lineEl.appendChild(labelSpan);
          }
          names.forEach(([n, noComma], i) => {
            const sp = document.createElement("span");
            sp.textContent = n;
            if (color) sp.style.color = color;
            lineEl.appendChild(sp);
            if (i < names.length - 1) lineEl.appendChild(document.createTextNode(noComma ? " " : ", "));
          });
          if (labeledOn) {
            if (addPeriod) lineEl.appendChild(document.createTextNode("."));
          } else {
            lineEl.appendChild(document.createTextNode(addPeriod ? ". " : " "));
          }
          previewTextEl.appendChild(lineEl);
        });

        if (!any) previewTextEl.textContent = "(nothing selected)";
      }

      function updatePreview() {
        const isNames = previewModeValue() === "names";
        previewModeBtn.innerHTML = svgIcon(isNames ? "tag" : "fileText", 13);
        previewModeBtn.title = isNames
          ? "Preview mode: Names only — click to switch to Full text"
          : "Preview mode: Full text — click to switch to Names only";

        if (isNames) {
          renderNamesPreview();
        } else {
          const text = computePreview(node.pmData, rawPromptValue(), !!node.pmData.rawOnly, !!node.pmData.labeledOutput);
          previewTextEl.textContent = text || "(nothing selected)";
        }
      }

      function renderAll() {
        renderTabs();
        renderPresetRow();
        renderSectionToolbar();
        renderList();
        updatePreview();
        root.classList.toggle("pm-raw-only-active", !!node.pmData.rawOnly);
      }

      renderRegistry.set(node, renderAll);

      // --- Node & DOM Dimensions Calculation ---
      function reservedHeight() {
        let total = 16;
        if (!node.widgets) return total;
        node.widgets.forEach((w) => {
          if (w === widget || w === dataWidget || w === previewModeWidget) return;
          let h = 26;
          try {
            if (typeof w.computeSize === "function") {
              const cs = w.computeSize(node.size ? node.size[0] : 300);
              if (Array.isArray(cs) && typeof cs[1] === "number") h = cs[1];
            }
          } catch (e) {}
          total += h + 4;
        });
        return total;
      }

      function computeAvailableHeight() {
        const nodeH = (node.size && node.size[1]) || node.pmDesiredHeight || 640;
        return Math.max(160, nodeH - reservedHeight() - 16);
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
        return [width, computeAvailableHeight()];
      };

      let pmLastAppliedHeight = null;
      function applyDomHeight() {
        if (node.size && Array.isArray(node.size) && typeof node.size[1] === "number" && node.size[1] > 100) {
          node.pmDesiredHeight = node.size[1];
        }
        const h = computeAvailableHeight();
        root.style.height = h + "px";
        root.style.maxHeight = h + "px";
        if (widget && widget.element) {
          widget.element.style.height = h + "px";
          widget.element.style.maxHeight = h + "px";
        }
        pmLastAppliedHeight = h;
      }
      applyHeightRegistry.set(node, applyDomHeight);

      node.setSize([node.size ? node.size[0] : 500, node.pmDesiredHeight]);
      applyDomHeight();
      persist();
      renderAll();
      refreshPresetSelect()
        .then((res) => {
          // A brand-new node loads the last-used json preset (see
          // default_data() in prompt_manager_node.py), so tie it to that file
          // for selection-preset storage. Restored nodes keep whatever file
          // they get tied to through an explicit load / save-as.
          if (res && res.last) state.currentPresetName = res.last;
        })
        .catch(() => {});
      localizeImages(node.pmData).then((changed) => {
        if (changed) {
          persist();
          renderAll();
        }
      });

      setTimeout(() => {
        try {
          applyDomHeight();
          node.setDirtyCanvas(true, true);
        } catch (e) {}
      }, 0);

      return r;
    };

    const onConfigure = nodeType.prototype.onConfigure;
    nodeType.prototype.onConfigure = function () {
      const r = onConfigure ? onConfigure.apply(this, arguments) : undefined;
      if (this.size && Array.isArray(this.size) && typeof this.size[1] === "number") {
        this.pmDesiredHeight = this.size[1];
      }
      const applyFn = applyHeightRegistry.get(this);
      if (applyFn) applyFn();

      try {
        const dw = this.widgets && this.widgets.find((w) => w.name === "prompt_data");
        if (dw && dw.value) {
          this.pmData = sanitizeData(JSON.parse(dw.value));
          const fn = renderRegistry.get(this);
          if (fn) fn();
          localizeImages(this.pmData).then((changed) => {
            if (changed) {
              dw.value = JSON.stringify(this.pmData);
              this.setDirtyCanvas(true, true);
              const fn2 = renderRegistry.get(this);
              if (fn2) fn2();
            }
          });
        }
      } catch (e) {
        console.warn("PromptManager: failed to restore data", e);
      }
      return r;
    };
  },
});