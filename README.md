# 🗂️ Prompt Manager

A ComfyUI custom node for managing a categorized, reusable library of prompt
snippets — with reference images, drag-and-drop sections, presets, and
queue-time randomization — all from a custom panel built into the node
itself.

<img width="743" height="820" alt="20260802_052807" src="https://github.com/user-attachments/assets/63a04bb1-6031-40bb-9f51-e94cee0c677e" />


## Features

- **Custom sections** — add, rename, delete, and drag-reorder as many
  sections as you want (Style, Camera, Character, Background, ...).
- **Per-prompt entries** — name, prompt text, and an optional reference
  image; list or compact grid view.
- **Selection = output** — click a prompt to include it; the ◎ icon selects
  only that one prompt in its section.
- **Enable/disable per section**, independent of prompt selection.
- **Randomize on queue** — toggle per section (or all at once); picks one
  prompt automatically when you hit *Queue Prompt*, seeded for
  reproducibility.
- **Locked "Prompt" text box** — a plain multiline field that can be
  repositioned among the sections but not deleted.
- **Presets** saved server-side (`presets/`), picked from a dropdown, with
  reload/rename/delete.
- **Import/export** a single section as a portable, self-contained file
  (images embedded).
- **Copy / cut / paste / move** prompts between sections.

## Install

Copy this folder into `ComfyUI/custom_nodes/`, restart ComfyUI. No extra
dependencies — only `aiohttp`, already bundled with ComfyUI.

## How it works

The node has one `STRING` output. For each **enabled** section, in the
order shown in the tabs:

- the locked "Prompt" section contributes its text box as-is
- any other section contributes its **selected** prompts, joined by `", "`

Non-empty sections are then joined by `". "`.

```
masterpiece, best quality. photorealistic, ultra detailed. close-up shot
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

