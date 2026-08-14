# 🗂️ Prompt Manager

A ComfyUI custom node for managing a categorized, reusable library of prompt
snippets — with reference images, per-prompt fine-tuning, presets, and
queue-time randomization — all from a custom panel built into the node.

## Install

Copy this folder into `ComfyUI/custom_nodes/` and restart ComfyUI. Only
dependency is `aiohttp`, already bundled with ComfyUI.

## Layout

| Zone | Contains |
|---|---|
| **Tabs** | One tab per section, drag to reorder. Each tab shows a 👁 enable/disable toggle, a 🎲 randomize-on-queue toggle, and an optional color bar. |
| **Preset bar** | New / Save / Reload / Rename / Delete preset, list ↔ grid view toggle, raw-only & labeled-output toggles, enable/disable/randomize all sections. |
| **Section toolbar** | Add prompt, solo this section, section color, export/import this section, rename/delete section, and a collapsible "more" panel for bulk delete/copy/cut/paste/move. |
| **List/grid** | The prompts themselves. |
| **Preview** | Live output text, with a mode switch (full text / names only) and a copy-to-clipboard button. |

## Sections

- Add via the **+** tab, drag any tab (including the locked **Prompt** tab)
  to reorder.
- 👁 enables/disables a section — disabled sections are skipped from the
  output entirely, regardless of what's selected inside.
- 🎨 assigns a muted color, shown as a bar on the tab for quick recognition.
- 🎲 marks a section for **randomize-on-queue**: one prompt gets picked
  automatically (seeded, deterministic) the moment you hit *Queue Prompt* —
  not while editing.
- **. toggle** — whether this section ends with a period before the next
  one starts (on by default).
- The locked **Prompt** tab is a plain multiline text box. It can be
  repositioned but not renamed or deleted, and never gets a period.

## Prompts

Each entry has a name, prompt text, and an optional reference image.

- **Click** a card/tile to select it for output (multi-select).
- **◎ Solo** — select only this one, clearing the rest of the section.
- **★ Always on** — always included in the output while its section is
  enabled, regardless of selection.
- **🎲/🚫 Allow random** — whether this prompt is eligible when
  randomize-on-queue fires.
- **,/␣ Comma** — whether a comma follows this prompt, or just a space.
- List view shows full prompt text; grid view is compact tiles with a
  button column (solo / always-on / more-actions menu / edit) and a
  two-line name footer.

## Presets

Saved server-side under `presets/`, picked from the dropdown:

- 📄 **New** — blank library. 💾 **Save** — save current state as a preset.
- 🔄 **Reload** — revert to the selected preset's saved state.
- ✎ **Rename**, 🗑 **Delete**.
- **Export/import a single section** as its own portable file (auto
  numbered `(1)`, `(2)`... on name collisions).

Presets and exports always embed images as base64 (fully self-contained,
easy to share). The live, actively-edited node instead references images
as files on disk — this keeps the ComfyUI workflow file small, avoiding
browser storage errors on large libraries. Either format loads fine either
way; images auto-convert in the background as needed.

## Output modes

- **Raw only** — ignore every section, output just the text box.
- **Labeled output** — prefix each section with its name, one per line,
  instead of the default single-line/period-separated format.

Example (default mode): `masterpiece, best quality. photorealistic, 8k. close-up shot`
Example (labeled mode):
```
Style: masterpiece, best quality.

Camera: close-up shot.
```

## Files

```
prompt_manager_node/
├── __init__.py              # node registration
├── prompt_manager_node.py   # output-building logic
├── server_routes.py         # preset & image storage API
├── presets/                 # saved presets + reference images
└── web/prompt_manager.js    # the in-node UI
```
