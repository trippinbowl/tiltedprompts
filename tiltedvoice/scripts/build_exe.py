#!/usr/bin/env python
"""PyInstaller build script for TiltedVoice — produces a single .exe (no torch)."""

from __future__ import annotations

import importlib
import os
import platform
import shutil
import subprocess
import sys


def _find_package_path(pkg_name: str) -> str | None:
    """Return the filesystem path of an installed package."""
    try:
        mod = importlib.import_module(pkg_name)
        pkg_path = os.path.dirname(mod.__file__)
        return pkg_path
    except Exception:
        return None


def build():
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    entry = os.path.join(project_root, "tiltedvoice", "gui.py")
    icon = os.path.join(project_root, "assets", "icon.ico")
    dist_dir = os.path.join(project_root, "dist")

    print("=" * 60)
    print("TiltedVoice Build")
    print("=" * 60)
    print(f"  Version   : 0.1.0")
    print(f"  Platform  : {platform.system()} {platform.machine()}")
    print(f"  Python    : {sys.version}")
    print(f"  Entry     : {entry}")
    print(f"  Icon      : {icon}")
    print("=" * 60)

    # ---- data files --------------------------------------------------
    datas: list[tuple[str, str]] = []

    # customtkinter themes
    ctk_path = _find_package_path("customtkinter")
    if ctk_path:
        datas.append((ctk_path, "customtkinter"))
        print(f"  CTk path  : {ctk_path}")

    # faster-whisper assets (Silero VAD ONNX model)
    fw_path = _find_package_path("faster_whisper")
    if fw_path:
        assets_dir = os.path.join(fw_path, "assets")
        if os.path.isdir(assets_dir):
            datas.append((assets_dir, os.path.join("faster_whisper", "assets")))
            print(f"  FW assets : {assets_dir}")

    # App assets (icons)
    app_assets = os.path.join(project_root, "assets")
    if os.path.isdir(app_assets):
        datas.append((app_assets, "assets"))

    # ---- hidden imports ----------------------------------------------
    hidden_imports = [
        "customtkinter",
        "faster_whisper",
        "faster_whisper.vad",
        "faster_whisper.transcribe",
        "faster_whisper.audio",
        "faster_whisper.utils",
        "ctranslate2",
        "sounddevice",
        "numpy",
        "onnxruntime",
        "huggingface_hub",
        "pystray",
        "pystray._win32",
        "keyboard",
        "pyperclip",
        "PIL",
        "PIL.Image",
        "tiltedvoice",
        "tiltedvoice.transcriber",
        "tiltedvoice.audio",
        "tiltedvoice.models",
        "tiltedvoice.gui",
    ]

    # ---- excludes (keep exe small) -----------------------------------
    excludes = [
        "torch", "torchaudio", "torchvision",
        "tensorflow", "keras", "tensorboard",
        "matplotlib", "scipy", "pandas",
        "sklearn", "scikit-learn",
        "grpc", "grpcio", "google.protobuf",
        "h5py", "pygments", "fsspec", "pyarrow",
        "cv2", "opencv",
        "IPython", "jupyter", "notebook",
        "tkinter.test", "unittest", "pytest",
        "setuptools", "pip", "distutils", "_distutils_hack",
    ]

    # ---- assemble command --------------------------------------------
    cmd = [
        sys.executable, "-m", "PyInstaller",
        "--onefile",
        "--windowed",
        "--clean",
        "--noconfirm",
        "--name", "TiltedVoice",
    ]

    if os.path.exists(icon):
        cmd += ["--icon", icon]

    for src, dst in datas:
        cmd += ["--add-data", f"{src}{os.pathsep}{dst}"]

    for h in hidden_imports:
        cmd += ["--hidden-import", h]

    for e in excludes:
        cmd += ["--exclude-module", e]

    cmd.append(entry)

    print("\nRunning PyInstaller…\n")
    result = subprocess.run(cmd, cwd=project_root)

    if result.returncode != 0:
        print("\nBuild FAILED.")
        sys.exit(1)

    # ---- report ------------------------------------------------------
    exe_path = os.path.join(dist_dir, "TiltedVoice.exe")
    if os.path.exists(exe_path):
        size_mb = os.path.getsize(exe_path) / (1024 * 1024)
        print(f"\nBuild SUCCESS — {exe_path}")
        print(f"  Size: {size_mb:.1f} MB")
    else:
        print("\nBuild completed but exe not found at expected location.")


if __name__ == "__main__":
    build()
