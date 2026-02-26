# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['G:\\AI_Projects\\ai-agency\\tiltedvoice\\tiltedvoice\\gui.py'],
    pathex=[],
    binaries=[],
    datas=[('G:\\AI_Projects\\ai-agency\\tiltedvoice\\.venv\\Lib\\site-packages\\customtkinter', 'customtkinter'), ('G:\\AI_Projects\\ai-agency\\tiltedvoice\\.venv\\Lib\\site-packages\\faster_whisper\\assets', 'faster_whisper\\assets'), ('G:\\AI_Projects\\ai-agency\\tiltedvoice\\assets', 'assets')],
    hiddenimports=['customtkinter', 'faster_whisper', 'faster_whisper.vad', 'faster_whisper.transcribe', 'faster_whisper.audio', 'faster_whisper.utils', 'ctranslate2', 'sounddevice', 'numpy', 'onnxruntime', 'huggingface_hub', 'pystray', 'pystray._win32', 'keyboard', 'pyperclip', 'PIL', 'PIL.Image', 'tiltedvoice', 'tiltedvoice.transcriber', 'tiltedvoice.audio', 'tiltedvoice.models', 'tiltedvoice.gui'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=['torch', 'torchaudio', 'torchvision', 'tensorflow', 'keras', 'tensorboard', 'matplotlib', 'scipy', 'pandas', 'sklearn', 'scikit-learn', 'grpc', 'grpcio', 'google.protobuf', 'h5py', 'pygments', 'fsspec', 'pyarrow', 'cv2', 'opencv', 'IPython', 'jupyter', 'notebook', 'tkinter.test', 'unittest', 'pytest', 'setuptools', 'pip', 'distutils', '_distutils_hack'],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='TiltedVoice',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=['G:\\AI_Projects\\ai-agency\\tiltedvoice\\assets\\icon.ico'],
)
