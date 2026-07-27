from .prompt_manager_node import PromptManagerNode

# Registers the /prompt_manager/presets/* server routes used by the preset
# picker in the UI. Safe to import even outside a running ComfyUI instance
# (it's a no-op in that case).
from . import server_routes  # noqa: F401

NODE_CLASS_MAPPINGS = {
    "PromptManagerNode": PromptManagerNode,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "PromptManagerNode": "🗂️ Prompt Manager",
}

# Tells ComfyUI to serve the "web" folder's content as the frontend
# extension (JS/CSS) associated with this custom node package.
WEB_DIRECTORY = "web"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
