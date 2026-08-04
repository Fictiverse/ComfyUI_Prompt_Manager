"""
Server-side routes backing the Prompt Manager node's preset picker.

Presets are whole-library JSON files stored in ./presets, next to this file.
The UI talks to these routes to list / load / save / rename / delete
presets, and to remember which preset was last used so it can be
auto-loaded the next time ComfyUI starts (for brand-new Prompt Manager
nodes only — existing nodes in a saved workflow keep whatever they had).

This module is optional: if the "server" module (ComfyUI's own PromptServer)
isn't importable (e.g. this package is inspected outside of a running
ComfyUI instance), the routes are simply never registered.
"""

import base64
import json
import os
import re
import uuid

PRESETS_DIR = os.path.join(os.path.dirname(__file__), "presets")
LAST_USED_FILE = os.path.join(PRESETS_DIR, ".last_used")
IMAGES_DIR = os.path.join(PRESETS_DIR, "images")
_IMAGE_NAME_RE = re.compile(r"^[a-f0-9]{32}\.(jpg|jpeg|png|webp)$")
_DATA_URL_RE = re.compile(r"^data:image/(png|jpe?g|webp);base64,(.+)$", re.DOTALL)

try:
    from aiohttp import web
    from server import PromptServer

    _AVAILABLE = True
except ImportError:
    _AVAILABLE = False


def _ensure_dir():
    os.makedirs(PRESETS_DIR, exist_ok=True)


def _ensure_images_dir():
    os.makedirs(IMAGES_DIR, exist_ok=True)


def _safe_name(name):
    name = (name or "").strip()
    name = re.sub(r"[^A-Za-z0-9 _\-\.]", "", name)
    name = name.strip(" .")
    return name[:80] if name else None


def _path_for(name):
    return os.path.join(PRESETS_DIR, f"{name}.json")


if _AVAILABLE:
    routes = PromptServer.instance.routes

    @routes.get("/prompt_manager/presets")
    async def pm_list_presets(request):
        _ensure_dir()
        names = sorted(
            f[:-5] for f in os.listdir(PRESETS_DIR) if f.endswith(".json")
        )
        last = None
        try:
            with open(LAST_USED_FILE, "r", encoding="utf-8") as fh:
                last = fh.read().strip() or None
        except OSError:
            last = None
        return web.json_response({"names": names, "last": last})

    @routes.get("/prompt_manager/presets/{name}")
    async def pm_get_preset(request):
        name = _safe_name(request.match_info.get("name"))
        if not name:
            return web.json_response({"error": "invalid name"}, status=400)
        path = _path_for(name)
        if not os.path.exists(path):
            return web.json_response({"error": "not found"}, status=404)
        with open(path, "r", encoding="utf-8") as fh:
            text = fh.read()
        return web.Response(text=text, content_type="application/json")

    @routes.post("/prompt_manager/presets/{name}")
    async def pm_save_preset(request):
        name = _safe_name(request.match_info.get("name"))
        if not name:
            return web.json_response({"error": "invalid name"}, status=400)
        try:
            body = await request.json()
        except Exception:
            return web.json_response({"error": "invalid json body"}, status=400)
        _ensure_dir()
        with open(_path_for(name), "w", encoding="utf-8") as fh:
            json.dump(body, fh, indent=2)
        with open(LAST_USED_FILE, "w", encoding="utf-8") as fh:
            fh.write(name)
        return web.json_response({"ok": True, "name": name})

    @routes.post("/prompt_manager/presets/{name}/rename")
    async def pm_rename_preset(request):
        name = _safe_name(request.match_info.get("name"))
        try:
            body = await request.json()
        except Exception:
            body = {}
        new_name = _safe_name(body.get("new_name"))
        if not name or not new_name:
            return web.json_response({"error": "invalid name"}, status=400)
        src, dst = _path_for(name), _path_for(new_name)
        if not os.path.exists(src):
            return web.json_response({"error": "not found"}, status=404)
        if os.path.exists(dst):
            return web.json_response({"error": "a preset with that name already exists"}, status=409)
        os.rename(src, dst)
        try:
            with open(LAST_USED_FILE, "r", encoding="utf-8") as fh:
                current_last = fh.read().strip()
            if current_last == name:
                with open(LAST_USED_FILE, "w", encoding="utf-8") as fh:
                    fh.write(new_name)
        except OSError:
            pass
        return web.json_response({"ok": True, "name": new_name})

    @routes.delete("/prompt_manager/presets/{name}")
    async def pm_delete_preset(request):
        name = _safe_name(request.match_info.get("name"))
        if not name:
            return web.json_response({"error": "invalid name"}, status=400)
        path = _path_for(name)
        if os.path.exists(path):
            os.remove(path)
        return web.json_response({"ok": True})

    @routes.post("/prompt_manager/last_used")
    async def pm_set_last_used(request):
        try:
            body = await request.json()
        except Exception:
            body = {}
        name = _safe_name(body.get("name"))
        if not name:
            return web.json_response({"error": "invalid name"}, status=400)
        _ensure_dir()
        with open(LAST_USED_FILE, "w", encoding="utf-8") as fh:
            fh.write(name)
        return web.json_response({"ok": True})

    # --- Reference images -----------------------------------------------------------
    # Images are stored as real files on disk (rather than base64 inside
    # prompt_data) so the workflow JSON stays small. A bloated workflow is
    # what causes ComfyUI's browser-side "Failed to save workflow draft"
    # autosave to repeatedly fail once it exceeds the localStorage quota.

    @routes.post("/prompt_manager/images")
    async def pm_upload_image(request):
        try:
            body = await request.json()
        except Exception:
            return web.json_response({"error": "invalid json body"}, status=400)
        data_url = body.get("data", "") or ""
        m = _DATA_URL_RE.match(data_url)
        if not m:
            return web.json_response({"error": "invalid image data"}, status=400)
        ext = m.group(1)
        ext = "jpg" if ext in ("jpeg", "jpg") else ext
        try:
            raw = base64.b64decode(m.group(2))
        except Exception:
            return web.json_response({"error": "invalid base64 data"}, status=400)
        _ensure_images_dir()
        filename = f"{uuid.uuid4().hex}.{ext}"
        with open(os.path.join(IMAGES_DIR, filename), "wb") as fh:
            fh.write(raw)
        return web.json_response({"ok": True, "filename": filename})

    @routes.get("/prompt_manager/images/{filename}")
    async def pm_get_image(request):
        filename = request.match_info.get("filename", "")
        if not _IMAGE_NAME_RE.match(filename):
            return web.json_response({"error": "invalid filename"}, status=400)
        path = os.path.join(IMAGES_DIR, filename)
        if not os.path.exists(path):
            return web.json_response({"error": "not found"}, status=404)
        return web.FileResponse(path)

    @routes.delete("/prompt_manager/images/{filename}")
    async def pm_delete_image(request):
        filename = request.match_info.get("filename", "")
        if not _IMAGE_NAME_RE.match(filename):
            return web.json_response({"error": "invalid filename"}, status=400)
        path = os.path.join(IMAGES_DIR, filename)
        if os.path.exists(path):
            os.remove(path)
        return web.json_response({"ok": True})
