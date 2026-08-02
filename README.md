
# Prompt Manager — ComfyUI Custom Node

A node that manages a fully editable, categorized library of reusable prompt
snippets, with a native multiline "Prompt" text box, presets stored on disk,
per-section enable/disable, and queue-time randomization.

<img width="743" height="820" alt="20260802_052807" src="https://github.com/user-attachments/assets/63a04bb1-6031-40bb-9f51-e94cee0c677e" />


## Installation

1. Copy the whole `prompt_manager_node` folder into `ComfyUI/custom_nodes/`.
2. Restart ComfyUI. Only dependency is `aiohttp`, which ComfyUI already
   ships with — nothing extra to `pip install`.
3. The node appears under category `utils/prompt` → **🗂️ Prompt Manager**.

Structure:
```
prompt_manager_node/
├── __init__.py                 # node registration + WEB_DIRECTORY
├── prompt_manager_node.py      # Python node logic
├── server_routes.py            # /prompt_manager/presets/* API routes
├── presets/
│   ├── default.json            # shipped starter library
│   └── .last_used              # created automatically, tracks the active preset
└── web/
    └── prompt_manager.js       # custom UI injected into the node
```

## Node widgets (top to bottom)

1. **seed** (native int widget) — seeds the queue-time randomization (see below).
2. **Prompt** (native multiline text box) — free text, always available.
   It is tied to a special, locked "Prompt" section: you can drag its tab to
   reposition it among the other sections (to control where its text lands
   in the final output), but it can't be renamed or deleted, and its content
   is **not** saved into the preset JSON (only its position is). It has its
   own accent color in the tab strip.
3. The custom Prompt Manager panel (tabs, toolbars, list/grid, preview).

## UI features

**Sections (tabs)**
- Drag any tab (including the locked "Prompt" one) to reorder sections —
  this is the order used when building the final output.
- Click **"+"** at the end of the tab strip to add a new section.
- Each tab has a small 👁/🚫 icon: click it to enable/disable that whole
  section without touching its prompt selections. A disabled section is
  fully skipped from the output, whatever is checked inside it.
- The section toolbar's **✎** / **🗑** rename/delete the active section
  (disabled for the locked "Prompt" section; you must keep at least one
  regular section).

**Selection model (unified)**
- Clicking anywhere on a card/tile (list or grid mode) toggles whether that
  prompt is **selected** — this single flag is both "included in the final
  output" and "targeted by the bulk-action buttons" (delete/copy/cut/move).
  There's no separate checkbox anymore; the whole card is the clickable
  zone.
- The **◎** icon on a card is "select only this one": it selects that prompt
  and clears every other selection in the same section — handy for quickly
  swapping a single choice without hunting down what else was checked.

**Two view modes** (toggle with the ▦/☰ icon in the preset row)
- **List** — one row per prompt, shows the prompt text preview, good for
  reading/reviewing.
- **Grid** — compact tiles that wrap and re-flow automatically as you
  resize the node, bigger thumbnails, name only (no prompt-text preview) —
  better for browsing many reference images at a glance.

Both modes support drag-and-drop reordering (list order = output order) and
the same click-to-select / ◎-to-solo-select / icon actions (✎ edit, 🖼
image, 🗑 delete).

**Bulk actions** (section toolbar, act on whatever is currently selected in
the active section)
- **⌫** clear selection (this section only).
- **🗑** delete selected, **📋** copy, **✂** cut, **📥** paste (into the
  active section), **➡ move…** dropdown to move selected prompts to another
  section.

**Import / export**
- **⇩ / ⇧** in the section toolbar export/import a **single section** as a
  small JSON file. Importing a section whose name collides with an existing
  one automatically appends `(1)`, `(2)`, etc., so nothing gets overwritten.
- The preset row (💾/✎/🗑 + dropdown) manages **whole-library presets**,
  saved server-side in the node's own `presets/` folder (see below) rather
  than as browser downloads.

**Presets folder**
- 💾 asks for a name and saves the entire current library (all sections,
  all prompts, images included — but not the live "Prompt" text box
  content) as `presets/<name>.json`.
- The dropdown lists every preset in that folder; selecting one loads it
  immediately and remembers it as "last used".
- ✎ renames the selected preset's file, 🗑 deletes it.
- On ComfyUI startup, brand-new Prompt Manager nodes default to whatever
  preset was last used (via `presets/.last_used`), falling back to
  `presets/default.json` if none was ever selected. Note: ComfyUI typically
  caches node defaults per browser session, so if you switch presets mid
  session, already-open "add node" menus might not reflect it until you
  refresh the page — nodes you explicitly load from a saved workflow are
  unaffected either way, since they keep their own saved data.

**Randomization at queue time**
- The 🎲 icon in the section toolbar is a **toggle**, not an instant pick:
  when enabled (highlighted) for a section, that section gets exactly one
  random prompt selected automatically the moment you hit *Queue Prompt* —
  not while you're editing.
- The **seed** widget makes this reproducible: the same seed always
  reproduces the same picks for a given section (each section gets an
  independent but deterministic pick derived from the seed).

**Live preview**
- The bottom strip recomputes the exact output string as you edit — including
  the live "Prompt" text box content and whichever picks a random section
  currently holds.

## Output format

Single `STRING` output (`prompt`), built by walking sections in their
current (user-defined, draggable) order:

- An **enabled** locked "Prompt" section contributes the text box's content
  as-is.
- An **enabled** regular section contributes its checked prompts joined by
  `", "`.
- **Disabled** sections are skipped entirely.
- Non-empty section contributions are joined by `". "`.

Example: text box contains `masterpiece, best quality`; in `Style` you
checked `photorealistic, ultra detailed, 8k`; in `Camera` you checked
`close-up shot`; all three sections enabled, in that order →

```
masterpiece, best quality. photorealistic, ultra detailed, 8k. close-up shot
```

## Data format (preset JSON)

```json
{
  "viewMode": "list",
  "sections": [
    { "key": "__raw_prompt__", "label": "Prompt", "enabled": true, "locked": true, "randomizeOnQueue": false },
    { "key": "style", "label": "Style", "enabled": true, "locked": false, "randomizeOnQueue": false }
  ],
  "categories": {
    "__raw_prompt__": [],
    "style": [
      { "id": "p_ab12cd", "name": "Photorealistic", "prompt": "photorealistic, ultra detailed, 8k", "image": "data:image/jpeg;base64,...", "selected": true }
    ]
  }
}
```

This JSON lives in the node's hidden `prompt_data` widget, so a workflow
save/reload keeps everything (it doesn't depend on the presets folder at
all) — the preset picker is purely a convenience for reusing a library
across different workflows or node instances.

## Server API (used internally by the UI)

- `GET /prompt_manager/presets` → `{ names: [...], last: "name"|null }`
- `GET /prompt_manager/presets/{name}` → preset JSON content
- `POST /prompt_manager/presets/{name}` (body = preset JSON) → save/overwrite
- `POST /prompt_manager/presets/{name}/rename` (body `{new_name}`) → rename
- `DELETE /prompt_manager/presets/{name}` → delete
- `POST /prompt_manager/last_used` (body `{name}`) → set the "last used" marker

## Notes / known limitations

- The UI relies on `node.addDOMWidget(...)` and a `computeSize`-driven
  height to track the node's vertical size — both are ComfyUI frontend
  internals that can shift between versions. If vertical resizing stops
  filling the panel after a ComfyUI update, check that version's
  `app.js`/`widgets.js` for changes to this API.
- Queue-time randomization is implemented by wrapping `app.queuePrompt`.
  This is a common but unofficial pattern; if a future ComfyUI version
  renames or restructures that function, the wrap may silently no-op (the
  rest of the node keeps working normally, just without auto-randomization).
- Section add/rename/delete/preset-name prompts use native browser
  `prompt()`/`confirm()` dialogs for simplicity rather than a custom modal.
- Images are stored as base64 directly in the JSON (auto-resized to 220px
  client-side); a library with many images will make the preset file (and
  the saved workflow) proportionally larger.
- No external Python dependency beyond `json`/`os`/`re` (stdlib) and
  `aiohttp`, which ComfyUI already bundles for its own server.
