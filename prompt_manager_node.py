import json
import os

PRESETS_DIR = os.path.join(os.path.dirname(__file__), "presets")
LAST_USED_FILE = os.path.join(PRESETS_DIR, ".last_used")
RAW_PROMPT_KEY = "__raw_prompt__"

# Absolute minimal fallback, used only if presets/default.json is missing or
# unreadable (it should always be shipped with this node).
_MINIMAL_FALLBACK = {
    "viewMode": "list",
    "sections": [{"key": RAW_PROMPT_KEY, "label": "Prompt", "enabled": True, "locked": True}],
    "categories": {RAW_PROMPT_KEY: []},
}


def _read_json(path):
    try:
        with open(path, "r", encoding="utf-8") as fh:
            return json.load(fh)
    except (OSError, json.JSONDecodeError):
        return None


def default_data():
    """
    Loads whichever preset was last selected/saved from the UI (tracked in
    presets/.last_used), falling back to presets/default.json, falling back
    to a minimal built-in structure if the presets folder is missing.
    """
    last_name = None
    try:
        with open(LAST_USED_FILE, "r", encoding="utf-8") as fh:
            last_name = fh.read().strip() or None
    except OSError:
        last_name = None

    if last_name:
        data = _read_json(os.path.join(PRESETS_DIR, f"{last_name}.json"))
        if data is not None:
            return data

    data = _read_json(os.path.join(PRESETS_DIR, "default.json"))
    if data is not None:
        return data

    return json.loads(json.dumps(_MINIMAL_FALLBACK))


class PromptManagerNode:
    """
    Node for managing a fully user-editable, categorized library of reusable
    prompt snippets, plus one raw multiline text field ("Prompt") that can be
    repositioned among the sections but not renamed or deleted.

    All editing (sections, entries, ordering, presets, per-section
    enable/disable, per-section randomize-on-queue) happens through the
    custom UI injected by web/prompt_manager.js. The "prompt_data" widget is
    the JSON serialization of the library (persisted with the workflow); the
    "raw_prompt" widget is a normal multiline text field whose live value is
    NOT stored in prompt_data, and "seed" seeds the client-side
    randomize-on-queue feature (unused directly by this function, kept as a
    real input so it participates in the workflow/API and can be wired
    elsewhere if useful).

    Output: for each enabled section, in the user-defined order:
      - the locked "Prompt" section contributes the raw_prompt text as-is
      - any other section contributes its checked entries joined by ", "
    All non-empty section contributions are then joined by ". ".
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "prompt_data": (
                    "STRING",
                    {"multiline": True, "default": json.dumps(default_data())},
                ),
                "seed": (
                    "INT",
                    {"default": 0, "min": 0, "max": 0xFFFFFFFFFFFFFFFF},
                ),
                "raw_prompt": (
                    "STRING",
                    {"multiline": True, "default": ""},
                ),
            }
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("prompt",)
    FUNCTION = "build_prompt"
    CATEGORY = "utils/prompt"
    DESCRIPTION = (
        "Builds a final prompt string from a user-editable, categorized "
        "prompt library plus a raw text field, following the user-defined "
        "section order."
    )

    def build_prompt(self, prompt_data, seed, raw_prompt):
        try:
            data = json.loads(prompt_data) if prompt_data else default_data()
        except json.JSONDecodeError:
            data = default_data()

        if not isinstance(data, dict):
            data = default_data()

        categories = data.get("categories", {}) or {}
        sections = data.get("sections")

        if not sections:
            sections = [{"key": k, "label": k} for k in categories.keys()]

        section_strings = []
        for sec in sections:
            if not isinstance(sec, dict):
                sec = {"key": sec, "label": sec}
            if not sec.get("enabled", True):
                continue

            key = sec.get("key")

            if sec.get("locked") or key == RAW_PROMPT_KEY:
                text = (raw_prompt or "").strip()
                if text:
                    section_strings.append(text)
                continue

            items = categories.get(key, []) or []
            selected_prompts = []
            for it in items:
                if not isinstance(it, dict):
                    continue
                if it.get("selected"):
                    text = (it.get("prompt") or "").strip()
                    if text:
                        selected_prompts.append(text)
            if selected_prompts:
                section_strings.append(", ".join(selected_prompts))

        final_prompt = ". ".join(section_strings)
        return (final_prompt,)
