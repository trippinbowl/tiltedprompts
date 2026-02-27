"""TiltedVoice — voice-to-text desktop app for Windows.

Entry point: main()
"""

from __future__ import annotations

import ctypes
import ctypes.wintypes as wintypes
import json
import logging
import os
import sys
import threading
import time
from datetime import datetime
from pathlib import Path
from typing import Optional

import customtkinter as ctk
import numpy as np

from tiltedvoice.audio import MicrophoneManager, VoiceRecorder
from tiltedvoice.models import (
    AppSettings,
    AudioConfig,
    RecordingMode,
    TranscriberConfig,
    TranscriptionResult,
    WhisperModel,
)
from tiltedvoice.transcriber import Transcriber

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Win32
# ---------------------------------------------------------------------------
user32 = ctypes.windll.user32
user32.GetParent.restype = wintypes.HWND
user32.GetParent.argtypes = [wintypes.HWND]

# ---------------------------------------------------------------------------
# Theme engine
# ---------------------------------------------------------------------------
THEMES = {
    "Midnight": {
        "bg": "#09090b", "sidebar": "#09090b", "surface": "#18181b",
        "card": "#09090b", "card_hover": "#18181b",
        "primary": "#ffffff", "primary_hover": "#e4e4e7", "primary_muted": "#a1a1aa",
        "accent": "#6366f1", "accent2": "#8b5cf6",
        "text": "#ffffff", "text_dim": "#a1a1aa", "text_muted": "#71717a",
        "success": "#10b981", "error": "#ef4444", "warning": "#f59e0b",
        "border": "#27272a", "border_light": "#3f3f46",
        "nav_hover": "#18181b", "nav_active": "#27272a",
        "glow": "#ffffff",
    },
    "Nord Aurora": {
        "bg": "#1c1e26", "sidebar": "#1c1e26", "surface": "#232530",
        "card": "#1c1e26", "card_hover": "#232530",
        "primary": "#8aadf4", "primary_hover": "#b7bdf8", "primary_muted": "#5b6078",
        "accent": "#c6a0f6", "accent2": "#f5bde6",
        "text": "#cad3f5", "text_dim": "#a5adcb", "text_muted": "#8087a2",
        "success": "#a6da95", "error": "#ed8796", "warning": "#eed49f",
        "border": "#363a4f", "border_light": "#494d64",
        "nav_hover": "#232530", "nav_active": "#363a4f",
        "glow": "#8aadf4",
    },
    "Emerald Night": {
        "bg": "#022c22", "sidebar": "#022c22", "surface": "#064e3b",
        "card": "#022c22", "card_hover": "#064e3b",
        "primary": "#34d399", "primary_hover": "#6ee7b7", "primary_muted": "#059669",
        "accent": "#fbbf24", "accent2": "#f87171",
        "text": "#ecfdf5", "text_dim": "#a7f3d0", "text_muted": "#6ee7b7",
        "success": "#10b981", "error": "#ef4444", "warning": "#f59e0b",
        "border": "#065f46", "border_light": "#047857",
        "nav_hover": "#064e3b", "nav_active": "#065f46",
        "glow": "#34d399",
    },
    "Sunset Blaze": {
        "bg": "#2e1005", "sidebar": "#2e1005", "surface": "#431407",
        "card": "#2e1005", "card_hover": "#431407",
        "primary": "#fb923c", "primary_hover": "#fdba74", "primary_muted": "#c2410c",
        "accent": "#facc15", "accent2": "#f472b6",
        "text": "#fff7ed", "text_dim": "#fed7aa", "text_muted": "#fdba74",
        "success": "#4ade80", "error": "#ef4444", "warning": "#facc15",
        "border": "#7c2d12", "border_light": "#9a3412",
        "nav_hover": "#431407", "nav_active": "#7c2d12",
        "glow": "#fb923c",
    },
    "Rose Quartz": {
        "bg": "#311024", "sidebar": "#311024", "surface": "#50143a",
        "card": "#311024", "card_hover": "#50143a",
        "primary": "#f472b6", "primary_hover": "#f9a8d4", "primary_muted": "#be185d",
        "accent": "#a78bfa", "accent2": "#fb923c",
        "text": "#fdf2f8", "text_dim": "#fbcfe8", "text_muted": "#f9a8d4",
        "success": "#34d399", "error": "#f43f5e", "warning": "#fbbf24",
        "border": "#831843", "border_light": "#9d174d",
        "nav_hover": "#50143a", "nav_active": "#831843",
        "glow": "#f472b6",
    },
    "Arctic": {
        "bg": "#f8fafc", "sidebar": "#f8fafc", "surface": "#f1f5f9",
        "card": "#ffffff", "card_hover": "#f1f5f9",
        "primary": "#0f172a", "primary_hover": "#334155", "primary_muted": "#64748b",
        "accent": "#3b82f6", "accent2": "#8b5cf6",
        "text": "#0f172a", "text_dim": "#475569", "text_muted": "#64748b",
        "success": "#10b981", "error": "#ef4444", "warning": "#f59e0b",
        "border": "#e2e8f0", "border_light": "#cbd5e1",
        "nav_hover": "#f1f5f9", "nav_active": "#e2e8f0",
        "glow": "#0f172a",
    },
    "Cyberpunk": {
        "bg": "#09090b", "sidebar": "#09090b", "surface": "#18181b",
        "card": "#09090b", "card_hover": "#18181b",
        "primary": "#00ff9d", "primary_hover": "#5affc2", "primary_muted": "#00cc7a",
        "accent": "#ff00ea", "accent2": "#00f0ff",
        "text": "#d1ffe8", "text_dim": "#a3ffd2", "text_muted": "#75ffbb",
        "success": "#00ff9d", "error": "#ff003c", "warning": "#ffe600",
        "border": "#27272a", "border_light": "#3f3f46",
        "nav_hover": "#18181b", "nav_active": "#27272a",
        "glow": "#00ff9d",
    },
}

DEFAULT_THEME = "Midnight"

SIDEBAR_W = 240

NAV_ITEMS = [
    ("\u2302", "Overview"),
    ("\u29d6", "History"),
    ("\u2328", "Shortcuts"),
    ("\u2699", "Settings"),
]


def _settings_path() -> Path:
    return Path(os.environ.get("APPDATA", ".")) / "TiltedVoice" / "settings.json"


def _load_settings_data() -> dict:
    """Load raw settings dict from disk."""
    try:
        return json.loads(_settings_path().read_text(encoding="utf-8"))
    except Exception:
        return {}


def _save_settings_data(data: dict):
    """Write settings dict to disk."""
    p = _settings_path()
    try:
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(json.dumps(data, indent=2), encoding="utf-8")
    except Exception:
        pass


def _load_theme_pref() -> str:
    name = _load_settings_data().get("theme", DEFAULT_THEME)
    return name if name in THEMES else DEFAULT_THEME


def _save_theme_pref(name: str):
    data = _load_settings_data()
    data["theme"] = name
    _save_settings_data(data)


def _load_app_settings() -> AppSettings:
    """Load full AppSettings from disk, merging with defaults."""
    data = _load_settings_data()
    return AppSettings.from_dict(data)


def _save_app_settings(settings: AppSettings, theme: str = ""):
    """Save full AppSettings + theme to disk."""
    data = settings.to_dict()
    if theme:
        data["theme"] = theme
    else:
        # Preserve existing theme
        existing = _load_settings_data()
        data["theme"] = existing.get("theme", DEFAULT_THEME)
    _save_settings_data(data)


def _history_path() -> Path:
    return Path(os.environ.get("APPDATA", ".")) / "TiltedVoice" / "history.json"


def _load_history() -> list:
    """Load transcription history from disk."""
    try:
        return json.loads(_history_path().read_text(encoding="utf-8"))
    except Exception:
        return []


def _save_history(history: list):
    """Save transcription history to disk (capped at 500 entries)."""
    p = _history_path()
    try:
        p.parent.mkdir(parents=True, exist_ok=True)
        capped = history[-500:] if len(history) > 500 else history
        p.write_text(json.dumps(capped, indent=2, ensure_ascii=False), encoding="utf-8")
    except Exception:
        pass


# ---------------------------------------------------------------------------
# Helper: get theme color
# ---------------------------------------------------------------------------
_current_theme: dict = THEMES[DEFAULT_THEME]


def T(key: str) -> str:
    return _current_theme.get(key, "#ff00ff")


# =========================================================================
# Floating PTT Button
# =========================================================================

class FloatingPTTButton(ctk.CTkToplevel):
    SIZE = 48

    def __init__(self, master: "TiltedVoiceApp"):
        super().__init__(master)
        self._app = master
        self.overrideredirect(True)
        self.attributes("-topmost", True)
        try:
            self.configure(fg_color="transparent")
        except Exception:
            self.configure(fg_color=T("bg"))
        self.geometry(f"{self.SIZE}x{self.SIZE}")
        sw = self.winfo_screenwidth()
        sh = self.winfo_screenheight()
        self.geometry(f"+{sw - self.SIZE - 20}+{sh - self.SIZE - 80}")

        self._dragging = False
        self._drag_sx = 0
        self._drag_sy = 0

        self._btn = ctk.CTkButton(
            self, text="\U0001f3a4", width=self.SIZE, height=self.SIZE,
            corner_radius=self.SIZE // 2, fg_color=T("primary"),
            hover_color=T("primary_hover"), font=ctk.CTkFont(size=20),
            command=self._on_click,
        )
        self._btn.pack(fill="both", expand=True)
        self._btn.bind("<ButtonPress-1>", self._on_press)
        self._btn.bind("<B1-Motion>", self._on_drag)
        self._btn.bind("<ButtonRelease-1>", self._on_release)
        self._btn.bind("<Button-3>", lambda e: (
            self._app.withdraw() if self._app.winfo_viewable()
            else (self._app.deiconify(), self._app.lift())
        ))

    def _on_press(self, event):
        self._drag_sx, self._drag_sy = event.x_root, event.y_root
        self._dragging = False
        if self._app.settings.recording_mode == RecordingMode.PUSH_TO_TALK:
            self._app._start_recording()

    def _on_drag(self, event):
        if abs(event.x_root - self._drag_sx) > 5 or abs(event.y_root - self._drag_sy) > 5:
            self._dragging = True
            self.geometry(f"+{self.winfo_x() + event.x_root - self._drag_sx}+{self.winfo_y() + event.y_root - self._drag_sy}")
            self._drag_sx, self._drag_sy = event.x_root, event.y_root

    def _on_release(self, event):
        if self._app.settings.recording_mode == RecordingMode.PUSH_TO_TALK:
            self._app._stop_recording()
            return
        if not self._dragging:
            self._on_click()

    def _on_click(self):
        if not self._dragging:
            self._app._toggle_recording()

    def set_recording(self, active: bool):
        if active:
            self._btn.configure(text="\u23fa", fg_color=T("error"))
        else:
            self._btn.configure(text="\U0001f3a4", fg_color=T("primary"))


# =========================================================================
# Main Application
# =========================================================================

class TiltedVoiceApp(ctk.CTk):

    def __init__(self):
        super().__init__()

        global _current_theme
        self._theme_name = _load_theme_pref()
        _current_theme = THEMES[self._theme_name]

        self.settings = _load_app_settings()
        self._transcriber: Optional[Transcriber] = None
        self._recorder: Optional[VoiceRecorder] = None
        self._mic_manager = MicrophoneManager()
        self._recording = False
        self._transcribing = False
        self._transcription_count = 0
        self._cancel_event: Optional[threading.Event] = None
        self._timer_id: Optional[str] = None
        self._timer_start: Optional[float] = None
        self._ptt_button: Optional[FloatingPTTButton] = None
        self._tray_icon = None
        self._hotkeys_registered = False
        self._diag_lines: list[str] = []
        self._diag_peak: float = 0.0
        self._diag_rms_last: float = 0.0
        self._history: list[dict] = _load_history()
        self._current_page = "Overview"
        self._nav_buttons: dict[str, ctk.CTkButton] = {}

        self.title("TiltedVoice")
        self.geometry("1024x768")
        self.minsize(960, 720)
        ctk.set_appearance_mode("dark")
        self.overrideredirect(True)
        
        # Apply custom title bar (Windows only)
        try:
            from ctypes import windll, byref, sizeof, c_int
            HWND = windll.user32.GetParent(self.winfo_id())
            # Enable rounded corners
            windll.dwmapi.DwmSetWindowAttribute(HWND, 33, byref(c_int(2)), sizeof(c_int))
            # Dark title bar
            windll.dwmapi.DwmSetWindowAttribute(HWND, 19, byref(c_int(1)), sizeof(c_int))
        except Exception:
            pass

        icon_path = self._asset_path("icon.ico")
        if os.path.exists(icon_path):
            self.iconbitmap(icon_path)

        self._mic_var = ctk.StringVar(value="Default")
        self._model_var = ctk.StringVar(value=self.settings.model.value)
        self._mode_var = ctk.StringVar(value=self.settings.recording_mode.value)

        self._build_ui()

        self.after(200, self._populate_devices)
        self.after(400, self._start_tray)
        self.after(500, self._register_hotkeys)
        self.after(600, self._create_floating_ptt)
        if not self.settings.onboarding_complete:
            self.after(700, self._show_onboarding)
        self.protocol("WM_DELETE_WINDOW", self._on_close)

    @staticmethod
    def _asset_path(name: str) -> str:
        if getattr(sys, "frozen", False):
            base = sys._MEIPASS
        else:
            base = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets")
        return os.path.join(base, name)

    # ==================================================================
    # Theme application
    # ==================================================================

    def _persist_settings(self):
        """Save all current settings to disk (debounce-safe to call frequently)."""
        _save_app_settings(self.settings, theme=self._theme_name)

    def _apply_theme(self, name: str):
        global _current_theme
        if name not in THEMES:
            return
        self._theme_name = name
        _current_theme = THEMES[name]
        _save_theme_pref(name)
        self._persist_settings()
        is_light = name == "Arctic"
        ctk.set_appearance_mode("light" if is_light else "dark")
        self._rebuild_full_ui()

    def _rebuild_full_ui(self):
        # Destroy floating PTT before rebuild
        if self._ptt_button:
            try:
                self._ptt_button.destroy()
            except Exception:
                pass
            self._ptt_button = None
        for w in self.winfo_children():
            w.destroy()
        self._nav_buttons = {}
        self._build_ui()
        self._navigate(self._current_page)
        # Re-init devices and re-create floating PTT with new theme
        self.after(100, self._populate_devices)
        self.after(200, self._create_floating_ptt)

    # ==================================================================
    # Window Movement & Controls
    # ==================================================================
    
    def _get_pos(self, event):
        self._xwin = event.x
        self._ywin = event.y

    def _move_window(self, event):
        self.geometry(f"+{event.x_root - self._xwin}+{event.y_root - self._ywin}")

    def _minimize_window(self):
        self.iconify()

    def _maximize_window(self):
        if self.state() == "zoomed":
            self.state("normal")
        else:
            self.state("zoomed")

    # ==================================================================
    # UI Construction
    # ==================================================================

    def _build_ui(self):
        self.configure(fg_color=T("bg"))
        root = ctk.CTkFrame(self, fg_color=T("bg"), corner_radius=0)
        root.pack(fill="both", expand=True)

        # Custom Title Bar Frame
        self._title_bar = ctk.CTkFrame(root, fg_color=T("bg"), height=40, corner_radius=0)
        self._title_bar.pack(fill="x", side="top")
        self._title_bar.pack_propagate(False)
        self._title_bar.bind("<B1-Motion>", self._move_window)
        self._title_bar.bind("<ButtonPress-1>", self._get_pos)

        # Title bar controls
        ctrl_frame = ctk.CTkFrame(self._title_bar, fg_color="transparent")
        ctrl_frame.pack(side="right", fill="y")
        
        ctk.CTkButton(
            ctrl_frame, text="\u2014", width=40, height=40, corner_radius=0,
            fg_color="transparent", hover_color=T("nav_hover"), text_color=T("text_dim"),
            command=self._minimize_window
        ).pack(side="left")
        
        self._maximize_btn = ctk.CTkButton(
            ctrl_frame, text="\u25a1", width=40, height=40, corner_radius=0,
            fg_color="transparent", hover_color=T("nav_hover"), text_color=T("text_dim"),
            command=self._maximize_window
        )
        self._maximize_btn.pack(side="left")

        ctk.CTkButton(
            ctrl_frame, text="\u2715", width=40, height=40, corner_radius=0,
            fg_color="transparent", hover_color="#ef4444", text_color=T("text_dim"),
            command=self._on_close
        ).pack(side="left")

        # --- Sidebar ---
        sidebar = ctk.CTkFrame(root, fg_color=T("sidebar"), width=SIDEBAR_W, corner_radius=0,
                               border_width=0)
        sidebar.pack(side="left", fill="y")
        sidebar.pack_propagate(False)

        logo_frame = ctk.CTkFrame(sidebar, fg_color="transparent", height=64)
        logo_frame.pack(fill="x")
        logo_frame.pack_propagate(False)
        logo_frame.bind("<B1-Motion>", self._move_window)
        logo_frame.bind("<ButtonPress-1>", self._get_pos)

        ctk.CTkLabel(
            logo_frame, text="\U000026a1 TiltedVoice",
            font=ctk.CTkFont(size=20, weight="bold"), text_color=T("text"), anchor="w",
        ).pack(fill="x", padx=20, pady=(20, 0))

        sep = ctk.CTkFrame(sidebar, fg_color="transparent", height=10)
        sep.pack(fill="x", padx=16, pady=(12, 8))

        nav_frame = ctk.CTkFrame(sidebar, fg_color="transparent")
        nav_frame.pack(fill="x", padx=10)
        for icon, label in NAV_ITEMS:
            btn = ctk.CTkButton(
                nav_frame,
                text=f"  {icon}   {label}",
                anchor="w",
                height=40,
                corner_radius=10,
                fg_color="transparent",
                hover_color=T("nav_hover"),
                text_color=T("text_muted"),
                font=ctk.CTkFont(size=14, weight="bold"),
                command=lambda l=label: self._navigate(l),
            )
            btn.pack(fill="x", pady=2)
            self._nav_buttons[label] = btn

        ctk.CTkFrame(sidebar, fg_color="transparent").pack(fill="both", expand=True)

        # User profile mock at bottom
        profile_frame = ctk.CTkFrame(sidebar, fg_color="transparent")
        profile_frame.pack(fill="x", padx=10, pady=(0, 20))
        
        sep2 = ctk.CTkFrame(profile_frame, fg_color=T("border"), height=1)
        sep2.pack(fill="x", pady=(0, 16))

        user_row = ctk.CTkFrame(profile_frame, fg_color="transparent")
        user_row.pack(fill="x", padx=10)
        
        avatar = ctk.CTkLabel(
            user_row, text="PO", font=ctk.CTkFont(size=12, weight="bold"),
            text_color=T("text"), fg_color=T("surface"), width=32, height=32, corner_radius=16
        )
        avatar.pack(side="left")
        
        user_info = ctk.CTkFrame(user_row, fg_color="transparent")
        user_info.pack(side="left", fill="both", expand=True, padx=(10, 0))
        
        ctk.CTkLabel(user_info, text="pooja.tripathi91@...", font=ctk.CTkFont(size=12, weight="bold"), text_color=T("text"), anchor="w").pack(fill="x")
        ctk.CTkLabel(user_info, text="Pro Plan", font=ctk.CTkFont(size=11), text_color=T("text_dim"), anchor="w").pack(fill="x")

        # Sidebar right border stroke
        ctk.CTkFrame(root, fg_color=T("border"), width=1, corner_radius=0).pack(side="left", fill="y")

        # --- Content area ---
        self._content = ctk.CTkFrame(root, fg_color=T("bg"), corner_radius=0)
        self._content.pack(side="left", fill="both", expand=True)

        self._navigate("Overview")

    # ------------------------------------------------------------------
    # Navigation
    # ------------------------------------------------------------------

    def _navigate(self, page: str):
        self._current_page = page
        for name, btn in self._nav_buttons.items():
            if name == page:
                btn.configure(fg_color=T("nav_active"), text_color=T("text"))
            else:
                btn.configure(fg_color="transparent", text_color=T("text_muted"))
        for w in self._content.winfo_children():
            w.destroy()
        builder = {
            "Overview": self._build_overview_page,
            "History": self._build_history_page,
            "Shortcuts": self._build_shortcuts_page,
            "Settings": self._build_settings_page,
        }.get(page, self._build_overview_page)
        try:
            builder()
        except Exception:
            logger.exception("Page build failed: %s", page)

    # ------------------------------------------------------------------
    # Helper: card builder
    # ------------------------------------------------------------------

    def _make_card(self, parent, **kw):
        return ctk.CTkFrame(
            parent,
            fg_color=T("card"),
            corner_radius=16,
            border_width=1,
            border_color=T("border"),
            **kw,
        )

    def _make_inner_card(self, parent, **kw):
        return ctk.CTkFrame(
            parent,
            fg_color=T("bg"),  # Darker inner background
            corner_radius=12,
            border_width=1,
            border_color=T("border_light"),
            **kw,
        )

    # ------------------------------------------------------------------
    # Overview page
    # ------------------------------------------------------------------
    def _build_overview_page(self):
        page = ctk.CTkScrollableFrame(self._content, fg_color=T("bg"), corner_radius=0,
                                       scrollbar_button_color=T("border"),
                                       scrollbar_button_hover_color=T("text_muted"))
        page.pack(fill="both", expand=True, padx=28, pady=20)

        # Header
        hdr = ctk.CTkFrame(page, fg_color="transparent")
        hdr.pack(fill="x", pady=(0, 12))
        ctk.CTkLabel(
            hdr, text="Overview",
            font=ctk.CTkFont(size=32, weight="bold"), text_color=T("text"), anchor="w",
        ).pack(side="left")
        ctk.CTkLabel(
            hdr, text=self._theme_name,
            font=ctk.CTkFont(size=11), text_color=T("primary"), anchor="e",
        ).pack(side="right")

        ctk.CTkLabel(
            page, text="Record, transcribe, and paste \u2014 all from one place.",
            font=ctk.CTkFont(size=13), text_color=T("text_dim"), anchor="w",
        ).pack(fill="x", pady=(0, 18))

        # Status card
        status_card = self._make_card(page)
        status_card.pack(fill="x", pady=(0, 12))
        sr = ctk.CTkFrame(status_card, fg_color="transparent")
        sr.pack(fill="x", padx=18, pady=(14, 6))
        self._status_dot = ctk.CTkLabel(sr, text="\u25cf", font=ctk.CTkFont(size=14),
                                         text_color=T("text_dim"), width=18)
        self._status_dot.pack(side="left")
        self._status_label = ctk.CTkLabel(sr, text="Ready", font=ctk.CTkFont(size=14),
                                           text_color=T("text"), anchor="w")
        self._status_label.pack(side="left", padx=8)
        self._mode_badge = ctk.CTkLabel(
            sr, text=self.settings.recording_mode.value.upper().replace("-", " "),
            font=ctk.CTkFont(size=11, weight="bold"), text_color=T("primary"),
            fg_color=T("surface"), corner_radius=8, width=100, height=28,
        )
        self._mode_badge.pack(side="right")
        self._level_bar = ctk.CTkProgressBar(status_card, height=4, corner_radius=2,
                                              fg_color=T("surface"), progress_color=T("primary"))
        self._level_bar.pack(fill="x", padx=18, pady=(2, 14))
        self._level_bar.set(0)

        # Controls card
        ctrl_card = self._make_card(page)
        ctrl_card.pack(fill="x", pady=(0, 12))

        ctrl_label = ctk.CTkLabel(ctrl_card, text="Configuration",
                                   font=ctk.CTkFont(size=13, weight="bold"),
                                   text_color=T("text"), anchor="w")
        ctrl_label.pack(fill="x", padx=18, pady=(14, 10))

        def _ctrl_row(parent, label, widget_builder):
            row = ctk.CTkFrame(parent, fg_color="transparent")
            row.pack(fill="x", padx=18, pady=5)
            ctk.CTkLabel(row, text=label, font=ctk.CTkFont(size=12),
                         text_color=T("text_dim"), width=70, anchor="w").pack(side="left")
            widget_builder(row)

        def _mic_widgets(row):
            self._mic_dropdown = ctk.CTkOptionMenu(
                row, variable=self._mic_var, values=["Default"],
                fg_color=T("bg"), button_color=T("bg"),
                button_hover_color=T("surface"),
                font=ctk.CTkFont(size=12, weight="bold"), width=300, command=self._on_mic_change,
                dropdown_fg_color=T("card"), dropdown_hover_color=T("nav_active"),
                dropdown_text_color=T("text"),
                text_color=T("text"),
            )
            self._mic_dropdown.pack(side="left", padx=4)
            ctk.CTkButton(
                row, text="\u25b6 Test", width=64, height=30,
                fg_color=T("surface"), hover_color=T("card_hover"),
                text_color=T("text"), font=ctk.CTkFont(size=11, weight="bold"),
                border_width=1, border_color=T("border_light"),
                command=self._test_mic, corner_radius=8,
            ).pack(side="right")

        def _model_widgets(row):
            self._model_dropdown = ctk.CTkOptionMenu(
                row, variable=self._model_var, values=[m.value for m in WhisperModel],
                fg_color=T("bg"), button_color=T("bg"),
                button_hover_color=T("surface"),
                font=ctk.CTkFont(size=12, weight="bold"), width=300, command=self._on_model_change,
                dropdown_fg_color=T("card"), dropdown_hover_color=T("nav_active"),
                dropdown_text_color=T("text"),
                text_color=T("text"),
            )
            self._model_dropdown.pack(side="left", padx=4)

        def _mode_widgets(row):
            self._mode_dropdown = ctk.CTkOptionMenu(
                row, variable=self._mode_var, values=[m.value for m in RecordingMode],
                fg_color=T("bg"), button_color=T("bg"),
                button_hover_color=T("surface"),
                font=ctk.CTkFont(size=12, weight="bold"), width=300, command=self._on_mode_change,
                dropdown_fg_color=T("card"), dropdown_hover_color=T("nav_active"),
                dropdown_text_color=T("text"),
                text_color=T("text"),
            )
            self._mode_dropdown.pack(side="left", padx=4)

        _ctrl_row(ctrl_card, "Mic", _mic_widgets)
        _ctrl_row(ctrl_card, "Model", _model_widgets)
        _ctrl_row(ctrl_card, "Mode", _mode_widgets)
        ctk.CTkFrame(ctrl_card, fg_color="transparent", height=8).pack()

        # Output card
        out_card = self._make_card(page)
        out_card.pack(fill="x", pady=(0, 12))
        out_hdr = ctk.CTkFrame(out_card, fg_color="transparent")
        out_hdr.pack(fill="x", padx=18, pady=(14, 6))
        ctk.CTkLabel(out_hdr, text="Transcription Output",
                      font=ctk.CTkFont(size=13, weight="bold"),
                      text_color=T("text"), anchor="w").pack(side="left")

        self._output = ctk.CTkTextbox(
            out_card, fg_color=T("bg"), text_color=T("text"),
            font=ctk.CTkFont(family="Consolas", size=14),
            corner_radius=12, wrap="word", state="disabled", height=180,
            border_width=1, border_color=T("border_light"),
        )
        self._output.pack(fill="x", padx=14, pady=(0, 14))

        # Action bar
        action_row = ctk.CTkFrame(page, fg_color="transparent")
        action_row.pack(fill="x", pady=(0, 16))
        self._start_btn = ctk.CTkButton(
            action_row, text="\u25cf  Start Recording", height=56,
            fg_color=T("primary"), hover_color=T("primary_hover"),
            font=ctk.CTkFont(size=16, weight="bold"),
            command=self._toggle_recording, corner_radius=14,
        )
        self._start_btn.pack(side="left", expand=True, fill="x", padx=(0, 8))
        ctk.CTkButton(
            action_row, text="Copy", width=80, height=56,
            fg_color=T("card"), hover_color=T("card_hover"),
            text_color=T("text_dim"), font=ctk.CTkFont(size=14),
            command=self._copy_output, corner_radius=14,
            border_width=1, border_color=T("border"),
        ).pack(side="left", padx=(0, 4))
        ctk.CTkButton(
            action_row, text="Clear", width=80, height=56,
            fg_color=T("card"), hover_color=T("card_hover"),
            text_color=T("text_dim"), font=ctk.CTkFont(size=14),
            command=self._clear_output, corner_radius=14,
            border_width=1, border_color=T("border"),
        ).pack(side="left")

        # Diagnostics
        diag_card = self._make_card(page)
        diag_card.pack(fill="x", pady=(0, 12))
        dh = ctk.CTkFrame(diag_card, fg_color="transparent")
        dh.pack(fill="x", padx=14, pady=(12, 4))
        ctk.CTkLabel(dh, text="Diagnostics",
                      font=ctk.CTkFont(size=12, weight="bold"),
                      text_color=T("text_muted")).pack(side="left")
        ctk.CTkButton(
            dh, text="Copy", width=52, height=22,
            fg_color=T("surface"), hover_color=T("card_hover"),
            text_color=T("text_muted"), font=ctk.CTkFont(size=10),
            command=self._copy_diagnostics,
        ).pack(side="right")
        self._diag_text = ctk.CTkTextbox(
            diag_card, fg_color=T("surface"), text_color=T("text_muted"),
            font=ctk.CTkFont(family="Consolas", size=10),
            corner_radius=8, height=70, wrap="none",
        )
        self._diag_text.pack(fill="x", padx=14, pady=(2, 12))
        if self._diag_lines:
            self._diag_text.insert("end", "\n".join(self._diag_lines) + "\n")
        else:
            self._diag_text.insert("end", "Diagnostics ready.\n")
        self._diag_text.configure(state="disabled")

        self._repopulate_devices_if_needed()

    # ------------------------------------------------------------------
    # History page
    # ------------------------------------------------------------------
    def _build_history_page(self):
        page = ctk.CTkScrollableFrame(self._content, fg_color=T("bg"), corner_radius=0,
                                       scrollbar_button_color=T("border"),
                                       scrollbar_button_hover_color=T("text_muted"))
        page.pack(fill="both", expand=True, padx=28, pady=20)

        # Header row
        hdr_row = ctk.CTkFrame(page, fg_color="transparent")
        hdr_row.pack(fill="x", pady=(0, 8))
        ctk.CTkLabel(
            hdr_row, text="History",
            font=ctk.CTkFont(size=32, weight="bold"), text_color=T("text"), anchor="w",
        ).pack(side="left")

        if self._history:
            # Export + Clear buttons
            btn_frame = ctk.CTkFrame(hdr_row, fg_color="transparent")
            btn_frame.pack(side="right")
            ctk.CTkButton(
                btn_frame, text="Export TXT", width=90, height=32,
                fg_color=T("surface"), hover_color=T("card_hover"),
                text_color=T("text_dim"), font=ctk.CTkFont(size=12),
                corner_radius=8, border_width=1, border_color=T("border"),
                command=self._export_history_txt,
            ).pack(side="left", padx=(0, 6))
            ctk.CTkButton(
                btn_frame, text="Clear All", width=80, height=32,
                fg_color=T("surface"), hover_color=T("error"),
                text_color=T("text_dim"), font=ctk.CTkFont(size=12),
                corner_radius=8, border_width=1, border_color=T("border"),
                command=self._clear_history,
            ).pack(side="left")

        ctk.CTkLabel(
            page, text=f"{len(self._history)} transcription(s) saved.",
            font=ctk.CTkFont(size=13), text_color=T("text_dim"), anchor="w",
        ).pack(fill="x", pady=(0, 18))

        if not self._history:
            empty = self._make_card(page)
            empty.pack(fill="x", pady=20)
            ctk.CTkLabel(
                empty, text="No transcriptions yet",
                font=ctk.CTkFont(size=15, weight="bold"), text_color=T("text_muted"),
            ).pack(pady=(28, 4))
            ctk.CTkLabel(
                empty, text="Use the Overview page to record and transcribe.",
                font=ctk.CTkFont(size=12), text_color=T("text_muted"),
            ).pack(pady=(0, 28))
            return

        for i, entry in enumerate(reversed(self._history)):
            card = self._make_card(page)
            card.pack(fill="x", pady=4)
            hdr = ctk.CTkFrame(card, fg_color="transparent")
            hdr.pack(fill="x", padx=16, pady=(12, 4))
            ctk.CTkLabel(
                hdr, text=f"#{len(self._history) - i}  {entry['time']}",
                font=ctk.CTkFont(size=11), text_color=T("text_muted"),
            ).pack(side="left")
            # Copy button per entry
            entry_text = entry["text"]
            ctk.CTkButton(
                hdr, text="Copy", width=48, height=22,
                fg_color=T("surface"), hover_color=T("card_hover"),
                text_color=T("text_muted"), font=ctk.CTkFont(size=10),
                command=lambda t=entry_text: self._copy_to_clipboard(t),
            ).pack(side="right", padx=(6, 0))
            ctk.CTkLabel(
                hdr, text=f"{entry['ms']}ms",
                font=ctk.CTkFont(size=11), text_color=T("primary"),
            ).pack(side="right")
            # Use CTkTextbox instead of label for proper wrapping
            tb = ctk.CTkTextbox(
                card, fg_color="transparent", text_color=T("text"),
                font=ctk.CTkFont(size=13), height=60, wrap="word",
                corner_radius=0, border_width=0, activate_scrollbars=False,
            )
            tb.pack(fill="x", padx=16, pady=(2, 14))
            tb.insert("1.0", entry["text"])
            tb.configure(state="disabled")

    def _export_history_txt(self):
        """Export history to a .txt file via save dialog."""
        try:
            from tkinter import filedialog
            path = filedialog.asksaveasfilename(
                defaultextension=".txt",
                filetypes=[("Text files", "*.txt"), ("All files", "*.*")],
                title="Export Transcription History",
                initialfile="tiltedvoice_history.txt",
            )
            if not path:
                return
            lines = []
            for i, entry in enumerate(self._history, 1):
                lines.append(f"#{i}  {entry['time']}  ({entry['ms']}ms)")
                lines.append(entry["text"])
                lines.append("")
            Path(path).write_text("\n".join(lines), encoding="utf-8")
            self._set_status(f"Exported {len(self._history)} entries", T("success"))
        except Exception as exc:
            self._set_status(f"Export failed: {exc}", T("error"))

    def _clear_history(self):
        """Clear all history (with confirmation)."""
        if not self._history:
            return
        # Simple confirmation via a top-level dialog
        dialog = ctk.CTkToplevel(self)
        dialog.title("Clear History")
        dialog.geometry("340x140")
        dialog.transient(self)
        dialog.grab_set()
        dialog.resizable(False, False)
        dialog.configure(fg_color=T("bg"))
        ctk.CTkLabel(
            dialog, text=f"Delete all {len(self._history)} transcriptions?",
            font=ctk.CTkFont(size=14, weight="bold"), text_color=T("text"),
        ).pack(pady=(20, 10))
        btn_row = ctk.CTkFrame(dialog, fg_color="transparent")
        btn_row.pack(pady=10)
        ctk.CTkButton(
            btn_row, text="Cancel", width=100, fg_color=T("surface"),
            hover_color=T("card_hover"), text_color=T("text_dim"),
            command=dialog.destroy,
        ).pack(side="left", padx=8)
        def _confirm():
            self._history.clear()
            _save_history(self._history)
            dialog.destroy()
            self._navigate("History")
            self._set_status("History cleared", T("success"))
        ctk.CTkButton(
            btn_row, text="Delete All", width=100, fg_color=T("error"),
            hover_color="#dc2626", text_color="#ffffff",
            command=_confirm,
        ).pack(side="left", padx=8)

    # ------------------------------------------------------------------
    # Shortcuts page
    # ------------------------------------------------------------------
    def _build_shortcuts_page(self):
        page = ctk.CTkScrollableFrame(self._content, fg_color=T("bg"), corner_radius=0,
                                       scrollbar_button_color=T("border"),
                                       scrollbar_button_hover_color=T("text_muted"))
        page.pack(fill="both", expand=True, padx=28, pady=20)

        ctk.CTkLabel(
            page, text="Shortcuts",
            font=ctk.CTkFont(size=32, weight="bold"), text_color=T("text"), anchor="w",
        ).pack(fill="x", pady=(0, 8))
        ctk.CTkLabel(
            page, text="Global hotkeys for fast voice control.",
            font=ctk.CTkFont(size=13), text_color=T("text_dim"), anchor="w",
        ).pack(fill="x", pady=(0, 18))

        info = self._make_card(page)
        info.pack(fill="x", pady=(0, 14))
        ctk.CTkLabel(
            info, text="How it works",
            font=ctk.CTkFont(size=14, weight="bold"), text_color=T("text"), anchor="w",
        ).pack(fill="x", padx=18, pady=(16, 4))
        ctk.CTkLabel(
            info,
            text="TiltedVoice registers global keyboard shortcuts that work in any app.\n"
                 "Use modifier keys (Ctrl/Shift/Alt) for reliable capture.",
            font=ctk.CTkFont(size=12), text_color=T("text_dim"), anchor="w", justify="left",
        ).pack(fill="x", padx=18, pady=(0, 16))

        def _shortcut_card(title, desc, current_key):
            card = self._make_card(page)
            card.pack(fill="x", pady=6)
            
            inner_row = ctk.CTkFrame(card, fg_color="transparent")
            inner_row.pack(fill="x", padx=18, pady=(16, 16))
            
            text_frame = ctk.CTkFrame(inner_row, fg_color="transparent")
            text_frame.pack(side="left", fill="x", expand=True)
            
            ctk.CTkLabel(
                text_frame, text=title,
                font=ctk.CTkFont(size=14, weight="bold"), text_color=T("text"), anchor="w",
            ).pack(fill="x", pady=(0, 2))
            ctk.CTkLabel(
                text_frame, text=desc,
                font=ctk.CTkFont(size=12), text_color=T("text_dim"), anchor="w",
            ).pack(fill="x")
            
            key_frame = self._make_inner_card(inner_row)
            key_frame.pack(side="right", padx=(10, 0))
            ctk.CTkLabel(
                key_frame, text=current_key if current_key else "Not configured",
                font=ctk.CTkFont(family="Consolas", size=14, weight="bold"),
                text_color=T("primary") if current_key else T("text_muted"), height=40,
            ).pack(padx=24)

        _shortcut_card(
            "\U0001f3a4  Push-to-Talk",
            "Hold key to record, release to transcribe.",
            self.settings.hotkeys.push_to_talk,
        )
        _shortcut_card(
            "\u23fb  Toggle Recording",
            "Press once to start, press again to stop.",
            self.settings.hotkeys.toggle,
        )

    # ------------------------------------------------------------------
    # Settings page (with theme picker)
    # ------------------------------------------------------------------
    def _build_settings_page(self):
        page = ctk.CTkScrollableFrame(self._content, fg_color=T("bg"), corner_radius=0,
                                       scrollbar_button_color=T("border"),
                                       scrollbar_button_hover_color=T("text_muted"))
        page.pack(fill="both", expand=True, padx=28, pady=20)

        ctk.CTkLabel(
            page, text="Settings",
            font=ctk.CTkFont(size=32, weight="bold"), text_color=T("text"), anchor="w",
        ).pack(fill="x", pady=(0, 18))

        # -- Themes --
        theme_card = self._make_card(page)
        theme_card.pack(fill="x", pady=(0, 14))
        ctk.CTkLabel(theme_card, text="Theme",
                      font=ctk.CTkFont(size=15, weight="bold"),
                      text_color=T("text"), anchor="w").pack(fill="x", padx=18, pady=(16, 4))
        ctk.CTkLabel(theme_card, text="Choose a visual style for the app.",
                      font=ctk.CTkFont(size=12),
                      text_color=T("text_dim"), anchor="w").pack(fill="x", padx=18, pady=(0, 12))

        theme_grid = ctk.CTkFrame(theme_card, fg_color="transparent")
        theme_grid.pack(fill="x", padx=14, pady=(0, 16))

        col = 0
        row_frame = ctk.CTkFrame(theme_grid, fg_color="transparent")
        row_frame.pack(fill="x", pady=3)
        for name, colors in THEMES.items():
            is_active = name == self._theme_name
            pill = ctk.CTkButton(
                row_frame,
                text=f"  \u25cf  {name}" if is_active else f"     {name}",
                font=ctk.CTkFont(size=12, weight="bold" if is_active else "normal"),
                text_color=colors["text"] if is_active else T("text_dim"),
                fg_color=colors["primary"] if is_active else T("surface"),
                hover_color=colors["primary_hover"] if is_active else T("card_hover"),
                corner_radius=10, height=36, anchor="w",
                border_width=1,
                border_color=colors["primary"] if is_active else T("border"),
                command=lambda n=name: self._apply_theme(n),
            )
            pill.pack(side="left", padx=3, pady=2)
            col += 1
            if col % 4 == 0:
                row_frame = ctk.CTkFrame(theme_grid, fg_color="transparent")
                row_frame.pack(fill="x", pady=3)

        # -- General --
        gen = self._make_card(page)
        gen.pack(fill="x", pady=(0, 14))
        ctk.CTkLabel(gen, text="General",
                      font=ctk.CTkFont(size=15, weight="bold"),
                      text_color=T("text"), anchor="w").pack(fill="x", padx=18, pady=(16, 10))

        def _toggle_row(parent, label, var, command=None):
            row = ctk.CTkFrame(parent, fg_color="transparent")
            row.pack(fill="x", padx=18, pady=5)
            ctk.CTkLabel(row, text=label, font=ctk.CTkFont(size=13),
                         text_color=T("text"), anchor="w").pack(side="left")
            sw = ctk.CTkSwitch(row, variable=var, text="", onvalue=True, offvalue=False,
                               command=command,
                               fg_color=T("text_muted"), progress_color=T("primary"), width=44)
            sw.pack(side="right")

        self._auto_copy_var = ctk.BooleanVar(value=self.settings.auto_copy)
        self._auto_paste_var = ctk.BooleanVar(value=self.settings.auto_paste)

        def _on_auto_copy():
            self.settings.auto_copy = self._auto_copy_var.get()
            self._persist_settings()

        def _on_auto_paste():
            self.settings.auto_paste = self._auto_paste_var.get()
            self._persist_settings()

        _toggle_row(gen, "Auto-copy transcription to clipboard", self._auto_copy_var, _on_auto_copy)
        _toggle_row(gen, "Auto-paste into active window", self._auto_paste_var, _on_auto_paste)
        ctk.CTkFrame(gen, fg_color="transparent", height=8).pack()

        # -- Audio --
        aud = self._make_card(page)
        aud.pack(fill="x", pady=(0, 14))
        ctk.CTkLabel(aud, text="Audio",
                      font=ctk.CTkFont(size=15, weight="bold"),
                      text_color=T("text"), anchor="w").pack(fill="x", padx=18, pady=(16, 10))

        row = ctk.CTkFrame(aud, fg_color="transparent")
        row.pack(fill="x", padx=18, pady=5)
        ctk.CTkLabel(row, text="Energy threshold",
                      font=ctk.CTkFont(size=13), text_color=T("text"), anchor="w").pack(side="left")
        self._energy_var = ctk.StringVar(value=str(self.settings.energy_threshold))
        ctk.CTkEntry(row, textvariable=self._energy_var, width=90,
                      fg_color=T("surface"), border_color=T("border"),
                      text_color=T("text")).pack(side="right")

        row2 = ctk.CTkFrame(aud, fg_color="transparent")
        row2.pack(fill="x", padx=18, pady=5)
        ctk.CTkLabel(row2, text="Silence timeout (ms)",
                      font=ctk.CTkFont(size=13), text_color=T("text"), anchor="w").pack(side="left")
        self._silence_var = ctk.StringVar(value=str(self.settings.silence_ms))
        ctk.CTkEntry(row2, textvariable=self._silence_var, width=90,
                      fg_color=T("surface"), border_color=T("border"),
                      text_color=T("text")).pack(side="right")

        # Wire audio settings to persist on change
        def _on_energy_change(*_args):
            try:
                val = float(self._energy_var.get())
                if 0.0 <= val <= 1.0:
                    self.settings.energy_threshold = val
                    self._persist_settings()
            except (ValueError, TypeError):
                pass

        def _on_silence_change(*_args):
            try:
                val = int(self._silence_var.get())
                if 100 <= val <= 10000:
                    self.settings.silence_ms = val
                    self._persist_settings()
            except (ValueError, TypeError):
                pass

        self._energy_var.trace_add("write", _on_energy_change)
        self._silence_var.trace_add("write", _on_silence_change)

        ctk.CTkFrame(aud, fg_color="transparent", height=8).pack()

        # -- About --
        about = self._make_card(page)
        about.pack(fill="x", pady=(0, 14))
        ctk.CTkLabel(about, text="About",
                      font=ctk.CTkFont(size=15, weight="bold"),
                      text_color=T("text"), anchor="w").pack(fill="x", padx=18, pady=(16, 6))
        ctk.CTkLabel(
            about, text="TiltedVoice v0.1.0\n"
                        "Local voice-to-text powered by faster-whisper.\n"
                        "Your voice data never leaves your computer.",
            font=ctk.CTkFont(size=12), text_color=T("text_dim"),
            anchor="w", justify="left",
        ).pack(fill="x", padx=18, pady=(0, 16))

    # ==================================================================
    # Onboarding — simple 2-step wizard (bulletproof, no complex nesting)
    # ==================================================================

    def _show_onboarding(self):
        if hasattr(self, "_onboarding_overlay") and self._onboarding_overlay is not None:
            return
        self._onboarding_step = 0
        self._onboarding_overlay = ctk.CTkFrame(self, fg_color=T("bg"), corner_radius=0)
        self._onboarding_overlay.place(x=0, y=0, relwidth=1, relheight=1)
        self.bind("<Escape>", lambda _e: self._close_onboarding())
        self._draw_onboarding()

    def _draw_onboarding(self):
        """Render onboarding step. Uses only simple pack into a single frame."""
        overlay = self._onboarding_overlay
        if not overlay or not overlay.winfo_exists():
            return

        for w in overlay.winfo_children():
            w.destroy()

        step = self._onboarding_step

        # Close button row
        close_row = ctk.CTkFrame(overlay, fg_color="transparent", height=40)
        close_row.pack(fill="x")
        close_row.pack_propagate(False)
        ctk.CTkButton(
            close_row, text="\u2715", width=32, height=32,
            fg_color="transparent", hover_color=T("nav_hover"),
            text_color=T("text_muted"), font=ctk.CTkFont(size=14),
            command=self._close_onboarding,
        ).pack(side="right", padx=16, pady=4)

        # Center content area — just pack widgets into it
        center = ctk.CTkFrame(overlay, fg_color="transparent", width=440)
        center.pack(expand=True)

        if step == 0:
            splash_frame = ctk.CTkFrame(center, fg_color="transparent")
            splash_frame.pack(pady=(0, 20))
            
            logo_img = ctk.CTkLabel(splash_frame, text="\U000026a1", font=ctk.CTkFont(size=64), text_color=T("primary"))
            logo_img.pack(side="left", padx=(0, 16))
            
            ctk.CTkLabel(splash_frame, text="TiltedVoice",
                          font=ctk.CTkFont(size=48, weight="bold"),
                          text_color=T("text")).pack(side="left")

            ctk.CTkLabel(center, text="by TiltedPrompts",
                          font=ctk.CTkFont(size=14),
                          text_color=T("text_dim")).pack(pady=(0, 40))

            div = ctk.CTkFrame(center, fg_color=T("border"), height=1, width=150)
            div.pack(pady=(0, 40))

            ctk.CTkLabel(center, text="Stop Typing. Start Shipping.",
                          font=ctk.CTkFont(size=28, weight="bold"),
                          text_color=T("text")).pack(pady=(0, 16))
                          
            ctk.CTkLabel(center,
                          text="Your voice-first agentic coding companion.\n"
                               "Speak your intent \u2014 ship working software.",
                          font=ctk.CTkFont(size=16), text_color=T("text_dim"),
                          justify="center").pack(pady=(0, 32))

            pill_badge = ctk.CTkFrame(center, fg_color=T("surface"), corner_radius=16, border_width=1, border_color=T("border"))
            pill_badge.pack(pady=(0, 24))
            ctk.CTkLabel(pill_badge, text="\U000026a1 TiltedVoice", font=ctk.CTkFont(size=12, weight="bold"), text_color=T("text")).pack(padx=16, pady=6)

            ctk.CTkButton(
                center, text="\U000026a1  Start Building  \u2192", height=56, corner_radius=16,
                fg_color=T("accent"), hover_color=T("accent2"),
                font=ctk.CTkFont(size=16, weight="bold"),
                command=lambda: self._onboarding_next(1),
            ).pack(fill="x", padx=40, pady=(0, 10))
            
            ctk.CTkLabel(center, text="Part of the TiltedPrompts product suite", font=ctk.CTkFont(size=11), text_color=T("text_muted")).pack(pady=(16, 80))
            
            eco_badge = ctk.CTkFrame(center, fg_color="transparent", corner_radius=16, border_width=1, border_color=T("border"))
            eco_badge.pack(pady=(0, 24))
            ctk.CTkLabel(eco_badge, text="\u25cf  TILTEDPROMPTS ECOSYSTEM", font=ctk.CTkFont(size=10, weight="bold"), text_color=T("text_dim")).pack(padx=16, pady=6)

            ctk.CTkButton(
                center, text="Skip", height=32,
                fg_color="transparent", hover_color=T("nav_hover"),
                text_color=T("text_muted"), font=ctk.CTkFont(size=12),
                command=self._close_onboarding,
            ).pack(pady=(0, 8))

            ctk.CTkLabel(center,
                          text="100% local. Your voice never leaves your device.",
                          font=ctk.CTkFont(size=11), text_color=T("text_muted"),
                          ).pack(pady=(4, 0))

        elif step == 1:
            ctk.CTkLabel(center, text="\U0001f3a4",
                          font=ctk.CTkFont(size=32), text_color=T("primary")).pack(pady=(0, 8))
            ctk.CTkLabel(center, text="Welcome to TiltedVoice",
                          font=ctk.CTkFont(size=24, weight="bold"),
                          text_color=T("text")).pack(pady=(0, 4))
            ctk.CTkLabel(center, text="Choose a speech recognition model to get started",
                          font=ctk.CTkFont(size=14),
                          text_color=T("text_dim")).pack(pady=(0, 24))

            badges = {
                WhisperModel.TINY_EN: ("FASTEST", T("warning")),
                WhisperModel.BASE_EN: ("RECOMMENDED", T("text")),
                WhisperModel.SMALL_EN: ("HIGH QUALITY", T("accent2")),
            }
            descs = {
                WhisperModel.TINY_EN: "Quick transcription, good for short phrases",
                WhisperModel.BASE_EN: "Best balance of speed and accuracy",
                WhisperModel.SMALL_EN: "Better accuracy, slower transcription",
                WhisperModel.MEDIUM_EN: "Highest accuracy, most resources",
            }

            for model in WhisperModel:
                selected = self.settings.model == model
                card = ctk.CTkFrame(
                    center,
                    fg_color=T("bg"),
                    corner_radius=8,
                    border_width=1,
                    border_color=T("border_light") if selected else T("border"),
                )
                card.pack(fill="x", padx=20, pady=4)
                inner = ctk.CTkFrame(card, fg_color="transparent")
                inner.pack(fill="x", padx=16, pady=16)

                title_row = ctk.CTkFrame(inner, fg_color="transparent")
                title_row.pack(fill="x")

                title = model.display_name.split(" \u2014 ")[0]
                ctk.CTkLabel(title_row, text=title,
                              font=ctk.CTkFont(size=14, weight="bold"),
                              text_color=T("text")).pack(side="left")
                if model in badges:
                    bt, bc = badges[model]
                    badge_frame = ctk.CTkFrame(title_row, fg_color=T("surface"), corner_radius=12, border_width=1, border_color=bc)
                    badge_frame.pack(side="left", padx=8)
                    ctk.CTkLabel(badge_frame, text=f"{bt}",
                                  font=ctk.CTkFont(size=10, weight="bold"),
                                  text_color=bc).pack(padx=8, pady=2)
                
                if selected:
                    ctk.CTkLabel(title_row, text="\u2713",
                                  font=ctk.CTkFont(size=18, weight="bold"),
                                  text_color=T("text")).pack(side="right")
                                  
                ctk.CTkLabel(inner,
                              text=f"{model.size_mb} MB - {descs.get(model, '')}",
                              font=ctk.CTkFont(size=12),
                              text_color=T("text"), anchor="w").pack(fill="x", pady=(4, 0))

                for w in (card, inner, title_row):
                    w.bind("<Button-1>", lambda e, m=model: self._ob_select_model(m))
                for w in inner.winfo_children():
                    w.bind("<Button-1>", lambda e, m=model: self._ob_select_model(m))
                for w in title_row.winfo_children():
                    w.bind("<Button-1>", lambda e, m=model: self._ob_select_model(m))

            ctk.CTkButton(
                center, text="Download & Continue", height=40,
                fg_color="transparent", hover_color=T("nav_hover"),
                font=ctk.CTkFont(size=14, weight="bold"), text_color=T("text"),
                command=self._close_onboarding,
            ).pack(fill="x", padx=40, pady=(24, 16))

            ctk.CTkLabel(center,
                          text="Models are processed locally on your device. Your voice data never\nleaves your computer.",
                          font=ctk.CTkFont(size=12), text_color=T("text"), justify="center"
                          ).pack(pady=(4, 0))

    def _onboarding_next(self, step):
        self._onboarding_step = step
        self.after(20, self._draw_onboarding)

    def _ob_select_model(self, model):
        self.settings.model = model
        self._model_var.set(model.value)
        self._on_model_change(model.value)
        self.after(20, self._draw_onboarding)

    def _close_onboarding(self):
        if hasattr(self, "_onboarding_overlay") and self._onboarding_overlay:
            self._onboarding_overlay.destroy()
            self._onboarding_overlay = None
        try:
            self.unbind("<Escape>")
        except Exception:
            pass
        # Mark onboarding complete so it doesn't show again
        self.settings.onboarding_complete = True
        self._persist_settings()
        try:
            self._set_status("Ready", T("text_dim"))
        except Exception:
            pass

    # ==================================================================
    # Device management
    # ==================================================================

    def _populate_devices(self):
        try:
            devs = self._mic_manager.list_devices()
            names = [d["name"] for d in devs]
            if names:
                if hasattr(self, "_mic_dropdown"):
                    self._mic_dropdown.configure(values=names)
                # Restore previously saved device if still available
                saved = self.settings.selected_device
                if saved and saved in names:
                    self._mic_var.set(saved)
                else:
                    default = self._mic_manager.get_default_device()
                    if default:
                        self._mic_var.set(default["name"])
        except Exception as exc:
            logger.error("Failed to list devices: %s", exc)

    def _repopulate_devices_if_needed(self):
        try:
            devs = self._mic_manager.list_devices()
            names = [d["name"] for d in devs]
            if names and hasattr(self, "_mic_dropdown"):
                self._mic_dropdown.configure(values=names)
                current = self._mic_var.get()
                if current == "Default" or current not in names:
                    default = self._mic_manager.get_default_device()
                    if default:
                        self._mic_var.set(default["name"])
        except Exception:
            pass

    def _on_mic_change(self, value):
        devs = self._mic_manager.list_devices()
        device_idx = None
        for d in devs:
            if d["name"] == value:
                device_idx = d["index"]
                break
        # Stop recording if active (mic changed mid-recording)
        if self._recording:
            self._stop_recording()
            self._set_status("Mic changed — restart recording when ready", T("warning"))
        # Probe the new device in background
        if device_idx is not None:
            self._set_status("Probing mic\u2026", T("warning"))
            def _probe():
                self._mic_manager.probe_device(device_idx)
                dtype = self._mic_manager.get_working_dtype(device_idx)
                rate = self._mic_manager.get_working_sample_rate(device_idx)
                self.after(0, lambda: self._set_status(f"Mic ready ({dtype}@{rate}Hz)", T("success")))
            threading.Thread(target=_probe, daemon=True).start()
        # Persist selected device
        self.settings.selected_device = value
        self._persist_settings()

    def _test_mic(self):
        self._set_status("Testing mic\u2026", T("warning"))

        def _run():
            devs = self._mic_manager.list_devices()
            idx = None
            selected = self._mic_var.get()
            for d in devs:
                if d["name"] == selected:
                    idx = d["index"]
                    break
            peak = self._mic_manager.test_device(idx)
            self.after(0, lambda: self._set_status(f"Mic peak: {peak:.3f}", T("success")))

        threading.Thread(target=_run, daemon=True).start()

    # ==================================================================
    # Model / mode changes
    # ==================================================================

    def _on_model_change(self, value):
        try:
            self.settings.model = WhisperModel(value)
        except ValueError:
            return
        if self._transcriber and self._transcriber.is_loaded:
            self._transcriber.unload()
            self._transcriber = None
        self._set_status(f"Model \u2192 {value}", T("primary"))
        self._persist_settings()

    def _on_mode_change(self, value):
        try:
            self.settings.recording_mode = RecordingMode(value)
        except ValueError:
            return
        try:
            self._mode_badge.configure(text=value.upper().replace("-", " "))
        except Exception:
            pass
        if self._recording:
            self._stop_recording()
        self._set_status(f"Mode \u2192 {value}", T("primary"))
        self._persist_settings()

    # ==================================================================
    # Recording
    # ==================================================================

    def _toggle_recording(self):
        if self._transcribing:
            if self._cancel_event:
                self._cancel_event.set()
            self._transcription_cleanup()
            self._set_status("Cancelled", T("text_dim"))
            return
        if self._recording:
            self._stop_recording()
        else:
            self._start_recording()

    def _start_recording(self):
        if self._recording:
            return
        self._recording = True
        mode = self.settings.recording_mode
        device_idx = self._get_selected_device_index()
        selected_mic = self._mic_var.get()
        self._diag_peak = 0.0
        self._diag_rms_last = 0.0
        self._append_diag(f"record_start mode={mode.value} mic='{selected_mic}' device_index={device_idx}")
        # Probe device for working dtype/sample rate (cached after first probe)
        probed_dtype = self._mic_manager.probe_device(device_idx) if device_idx is not None else None
        working_dtype = self._mic_manager.get_working_dtype(device_idx) if device_idx is not None else "float32"
        working_rate = self._mic_manager.get_working_sample_rate(device_idx) if device_idx is not None else 16000
        self._append_diag(f"device_probe dtype={working_dtype} rate={working_rate}")
        audio_cfg = AudioConfig(sample_rate=working_rate, energy_threshold=self.settings.energy_threshold)
        self._recorder = VoiceRecorder(config=audio_cfg, device_index=device_idx, silence_ms=self.settings.silence_ms, device_dtype=working_dtype)

        if mode == RecordingMode.AUTO:
            self._recorder.start_auto_listen(
                on_speech_start=lambda: self.after(0, lambda: self._set_status("Speech detected\u2026", T("error"))),
                on_speech_end=lambda: self.after(0, lambda: self._set_status("Processing\u2026", T("warning"))),
                on_audio_ready=lambda audio: self.after(0, lambda a=audio: self._on_audio_captured(a)),
            )
        else:
            self._recorder.start_manual_recording()

        self._set_status("Recording\u2026", T("error"))
        self._start_btn.configure(text="\u25a0  Stop", fg_color=T("error"), hover_color="#dc2626")
        if self._ptt_button:
            self._ptt_button.set_recording(True)

        def _level_cb(rms):
            self._diag_rms_last = rms
            self._diag_peak = max(self._diag_peak, rms)
            self.after(0, lambda r=rms: self._level_bar.set(min(r * 10, 1.0)))

        self._mic_manager.start_level_monitor(callback=_level_cb, device_index=device_idx)

    def _stop_recording(self):
        if not self._recording:
            return
        self._recording = False
        self._mic_manager.stop_level_monitor()
        self._level_bar.set(0)
        if self._ptt_button:
            self._ptt_button.set_recording(False)
        mode = self.settings.recording_mode
        self._append_diag(f"record_stop mode={mode.value} live_rms={self._diag_rms_last:.5f} peak_rms={self._diag_peak:.5f}")
        if mode == RecordingMode.AUTO:
            if self._recorder:
                self._recorder.stop_auto_listen()
            self._set_status("Ready", T("text_dim"))
            self._start_btn.configure(text="\u25cf  Start Recording", fg_color=T("primary"), hover_color=T("primary_hover"))
            return
        audio = None
        if self._recorder:
            audio = self._recorder.stop_manual_recording()
        self._start_btn.configure(text="\u25cf  Start Recording", fg_color=T("primary"), hover_color=T("primary_hover"))
        if audio is not None:
            self._on_audio_captured(audio)
        else:
            self._set_status("No audio captured", T("warning"))

    def _on_audio_captured(self, audio: np.ndarray):
        sample_rate = self._recorder._config.sample_rate if self._recorder else 16000
        dur = len(audio) / float(sample_rate)
        rms = float(np.sqrt(np.mean(audio ** 2)))
        peak = float(np.max(np.abs(audio))) if len(audio) else 0.0
        logger.info("Audio captured: %.2fs, rms=%.5f peak=%.5f", dur, rms, peak)
        self._append_diag(f"audio_captured dur={dur:.2f}s rms={rms:.5f} peak={peak:.5f} samples={len(audio)}")
        if rms < 0.0005:
            self._set_status(f"Mic too quiet (level={rms:.5f})", T("warning"))
            self._append_diag("audio_rejected reason=low_rms")
            return
        self._transcribing = True
        self._cancel_event = threading.Event()
        self._start_btn.configure(text="\u2715  Cancel", fg_color=T("warning"))
        self._set_status("Loading model\u2026", T("warning"))
        self._timer_start = time.monotonic()
        self._update_timer()
        cancel = self._cancel_event

        def _status_cb(msg):
            if not cancel.is_set():
                self.after(0, lambda: self._set_status(msg, T("warning")))
                self.after(0, lambda: self._append_diag(f"status {msg}"))

        def _debug_cb(evt):
            if cancel.is_set():
                return
            event = evt.get("event")
            if event == "timeout_budget":
                self.after(0, lambda: self._append_diag(f"timeout_budget audio={evt.get('audio_duration_s', 0.0):.2f}s total={evt.get('total_budget_s', 0.0):.1f}s"))
            elif event == "audio":
                self.after(0, lambda: self._append_diag(f"fw_audio dur={evt.get('duration_s', 0.0):.2f}s rms={evt.get('rms', 0.0):.5f} peak={evt.get('peak', 0.0):.5f}"))
            elif event == "pass_start":
                self.after(0, lambda: self._append_diag(f"pass_start name={evt.get('pass_name')} vad={evt.get('use_vad')}"))
            elif event == "engine_call_start":
                self.after(0, lambda: self._append_diag(f"engine_call_start pass={evt.get('pass_name')} timeout={evt.get('timeout_s', 0.0):.1f}s"))
            elif event == "engine_call_end":
                self.after(0, lambda: self._append_diag(f"engine_call_end pass={evt.get('pass_name')}"))
            elif event == "pass_end":
                self.after(0, lambda: self._append_diag(f"pass_end name={evt.get('name')} segs={evt.get('segment_count')} reason={evt.get('stop_reason')} elapsed={evt.get('elapsed_ms', 0.0):.0f}ms"))

        def _run():
            try:
                if self._transcriber is None:
                    self._transcriber = Transcriber(config=TranscriberConfig(model=self.settings.model))
                result = self._transcriber.transcribe(audio, cancel_event=cancel, on_status=_status_cb, on_debug=_debug_cb)
                if not cancel.is_set():
                    self.after(0, lambda: self._on_transcription_done(result))
            except Exception as exc:
                logger.error("Transcription failed: %s", exc)
                if not cancel.is_set():
                    self.after(0, lambda: self._set_status(f"Error: {exc}", T("error")))
            finally:
                if not cancel.is_set():
                    self.after(0, self._transcription_cleanup)

        threading.Thread(target=_run, daemon=True).start()

    def _update_timer(self):
        if not self._transcribing or self._timer_start is None:
            return
        elapsed = int(time.monotonic() - self._timer_start)
        current = self._status_label.cget("text")
        if current.startswith("Loading model"):
            self._status_label.configure(text=f"Loading model\u2026 ({elapsed}s)")
        else:
            self._status_label.configure(text=f"Transcribing\u2026 ({elapsed}s)")
        self._timer_id = self.after(1000, self._update_timer)

    def _transcription_cleanup(self):
        self._transcribing = False
        self._cancel_event = None
        if self._timer_id:
            try:
                self.after_cancel(self._timer_id)
            except Exception:
                pass
            self._timer_id = None
        self._timer_start = None
        self._start_btn.configure(text="\u25cf  Start Recording", fg_color=T("primary"), hover_color=T("primary_hover"))

    def _on_transcription_done(self, result: TranscriptionResult):
        if result.debug_info:
            selected_pass = result.debug_info.get("selected_pass", "?")
            proc_ms = int(result.debug_info.get("processing_time_ms", 0))
            self._append_diag(f"transcribe_done pass={selected_pass} elapsed={proc_ms}ms")
        if not result.text.strip():
            ms = int(result.processing_time_ms)
            self._set_status(f"No speech detected ({ms}ms)", T("text_dim"))
            self._append_diag("result_empty")
            return

        self._transcription_count += 1
        now = datetime.now().strftime("%H:%M:%S")
        ms = int(result.processing_time_ms)

        self._history.append({"time": now, "ms": ms, "text": result.text, "wpm": result.words_per_minute})
        _save_history(self._history)

        self._output.configure(state="normal")
        if self._transcription_count > 1:
            self._output.insert("end", "\n" + "\u2500" * 50 + "\n")
        self._output.insert("end", f"[{now}]  #{self._transcription_count}  ({ms}ms)\n")
        self._output.insert("end", result.text + "\n")
        self._output.configure(state="disabled")
        self._output.see("end")

        self._set_status(f"Done \u2014 {ms}ms, {result.words_per_minute:.0f} WPM", T("success"))
        self._append_diag(f"result_text chars={len(result.text)} wpm={result.words_per_minute:.1f}")

        if self.settings.auto_copy:
            self._copy_to_clipboard(result.text)
        if self.settings.auto_paste:
            self.after(150, lambda: self._paste_to_active(result.text))

    # ==================================================================
    # Clipboard
    # ==================================================================

    def _copy_to_clipboard(self, text):
        try:
            import pyperclip
            pyperclip.copy(text)
        except Exception:
            try:
                self.clipboard_clear()
                self.clipboard_append(text)
            except Exception:
                pass

    def _paste_to_active(self, text):
        self._copy_to_clipboard(text)
        try:
            import keyboard as kb
            kb.send("ctrl+v")
        except Exception as exc:
            logger.error("Auto-paste failed: %s", exc)

    def _copy_output(self):
        self._output.configure(state="normal")
        text = self._output.get("1.0", "end").strip()
        self._output.configure(state="disabled")
        if text:
            self._copy_to_clipboard(text)
            self._set_status("Copied to clipboard", T("success"))

    def _clear_output(self):
        self._output.configure(state="normal")
        self._output.delete("1.0", "end")
        self._output.configure(state="disabled")
        self._transcription_count = 0
        self._set_status("Cleared", T("text_dim"))

    # ==================================================================
    # Status / diagnostics
    # ==================================================================

    def _set_status(self, text, color=None):
        if color is None:
            color = T("text_dim")
        try:
            self._status_dot.configure(text_color=color)
            self._status_label.configure(text=text)
        except Exception:
            pass

    def _get_selected_device_index(self):
        selected = self._mic_var.get()
        if selected in ("Default", ""):
            return None
        for d in self._mic_manager.list_devices():
            if d["name"] == selected:
                return d["index"]
        return None

    def _append_diag(self, message):
        stamp = datetime.now().strftime("%H:%M:%S")
        line = f"[{stamp}] {message}"
        self._diag_lines.append(line)
        if len(self._diag_lines) > 120:
            self._diag_lines = self._diag_lines[-120:]
        try:
            self._diag_text.configure(state="normal")
            self._diag_text.delete("1.0", "end")
            self._diag_text.insert("end", "\n".join(self._diag_lines) + "\n")
            self._diag_text.configure(state="disabled")
            self._diag_text.see("end")
        except Exception:
            pass

    def _copy_diagnostics(self):
        text = "\n".join(self._diag_lines).strip()
        if text:
            self._copy_to_clipboard(text)
            self._set_status("Diagnostics copied", T("success"))

    # ==================================================================
    # System tray
    # ==================================================================

    def _start_tray(self):
        try:
            from PIL import Image
            import pystray
            icon_path = self._asset_path("icon.png")
            if not os.path.exists(icon_path):
                return
            img = Image.open(icon_path)

            def _toggle_window(icon, item):
                if self.winfo_viewable():
                    self.after(0, self.withdraw)
                else:
                    self.after(0, self.deiconify)
                    self.after(0, self.lift)

            def _set_mode(mode):
                def _inner(icon, item):
                    self.after(0, lambda: self._on_mode_change(mode.value))
                    self.after(0, lambda: self._mode_var.set(mode.value))
                return _inner

            def _exit(icon, item):
                icon.stop()
                self.after(0, self._on_close)

            menu = pystray.Menu(
                pystray.MenuItem("Show / Hide", _toggle_window, default=True),
                pystray.Menu.SEPARATOR,
                pystray.MenuItem("Push-to-Talk", _set_mode(RecordingMode.PUSH_TO_TALK),
                                 checked=lambda item: self.settings.recording_mode == RecordingMode.PUSH_TO_TALK),
                pystray.MenuItem("Toggle", _set_mode(RecordingMode.TOGGLE),
                                 checked=lambda item: self.settings.recording_mode == RecordingMode.TOGGLE),
                pystray.MenuItem("Auto-Listen", _set_mode(RecordingMode.AUTO),
                                 checked=lambda item: self.settings.recording_mode == RecordingMode.AUTO),
                pystray.Menu.SEPARATOR,
                pystray.MenuItem("Exit", _exit),
            )
            self._tray_icon = pystray.Icon("TiltedVoice", img, "TiltedVoice", menu)
            threading.Thread(target=self._tray_icon.run, daemon=True).start()
        except Exception as exc:
            logger.error("Tray icon failed: %s", exc)

    # ==================================================================
    # Global hotkeys
    # ==================================================================

    def _register_hotkeys(self):
        try:
            import keyboard as kb
            ptt_key = self.settings.hotkeys.push_to_talk
            kb.add_hotkey(ptt_key, self._on_ptt_press, suppress=False)
            # Parse the last key from the PTT combo for release detection
            # e.g. "ctrl+shift+space" → "space"
            release_key = ptt_key.rsplit("+", 1)[-1].strip()
            kb.on_release_key(release_key, self._on_ptt_release, suppress=False)
            kb.add_hotkey(self.settings.hotkeys.toggle, lambda: self.after(0, self._toggle_recording), suppress=False)
            self._hotkeys_registered = True
            logger.info("Global hotkeys registered (PTT=%s, release=%s)", ptt_key, release_key)
        except Exception as exc:
            logger.error("Hotkey registration failed: %s", exc)

    def _unregister_hotkeys(self):
        if not self._hotkeys_registered:
            return
        try:
            import keyboard as kb
            kb.unhook_all()
            self._hotkeys_registered = False
        except Exception:
            pass

    def _on_ptt_press(self):
        if self.settings.recording_mode != RecordingMode.PUSH_TO_TALK:
            return
        self.after(0, self._start_recording)

    def _on_ptt_release(self, event=None):
        if self.settings.recording_mode != RecordingMode.PUSH_TO_TALK:
            return
        if not self._recording:
            return
        self.after(0, self._stop_recording)

    # ==================================================================
    # Floating PTT
    # ==================================================================

    def _create_floating_ptt(self):
        try:
            self._ptt_button = FloatingPTTButton(self)
        except Exception as exc:
            logger.error("Floating PTT creation failed: %s", exc)

    # ==================================================================
    # Cleanup
    # ==================================================================

    def _on_close(self):
        self.after(1500, lambda: os._exit(0))
        self._unregister_hotkeys()
        if self._tray_icon:
            try:
                threading.Thread(target=self._tray_icon.stop, daemon=True).start()
            except Exception:
                pass
        if self._recorder:
            self._recorder.stop_manual_recording()
            self._recorder.stop_auto_listen()
        self._mic_manager.stop_level_monitor()
        try:
            self.quit()
            self.destroy()
        except Exception:
            pass


def main():
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
    app = TiltedVoiceApp()
    app.mainloop()


if __name__ == "__main__":
    main()
