"""
fix_audio.py — Diagnose and fix audio input device issues on Windows Server.

Run with admin privileges:
    python scripts/fix_audio.py
"""
import winreg
import subprocess
import sys
import os

# Force UTF-8 output on Windows
os.environ["PYTHONIOENCODING"] = "utf-8"
if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")


def get_capture_devices():
    """Read all audio capture devices from registry."""
    capture_path = r"SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Capture"
    devices = []
    try:
        key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, capture_path)
    except OSError:
        print("ERROR: Cannot open MMDevices registry key")
        return devices

    i = 0
    while True:
        try:
            subkey_name = winreg.EnumKey(key, i)
            subkey = winreg.OpenKey(key, subkey_name)
            state, _ = winreg.QueryValueEx(subkey, "DeviceState")

            name = subkey_name
            try:
                props_key = winreg.OpenKey(subkey, "Properties")
                name, _ = winreg.QueryValueEx(
                    props_key, "{a45c254e-df1c-4efd-8020-67d146a850e0},2"
                )
                winreg.CloseKey(props_key)
            except OSError:
                pass

            devices.append({
                "guid": subkey_name,
                "name": name,
                "state": state,
                "path": capture_path + "\\" + subkey_name,
            })
            winreg.CloseKey(subkey)
            i += 1
        except OSError:
            break

    winreg.CloseKey(key)
    return devices


def state_name(state: int) -> str:
    mapping = {1: "ACTIVE", 4: "DISABLED", 8: "NOT_PRESENT"}
    return mapping.get(state, f"OTHER(0x{state:08X})")


def enable_device(device: dict) -> bool:
    """Set DeviceState to 1 (ACTIVE)."""
    try:
        key = winreg.OpenKey(
            winreg.HKEY_LOCAL_MACHINE,
            device["path"],
            0,
            winreg.KEY_SET_VALUE,
        )
        winreg.SetValueEx(key, "DeviceState", 0, winreg.REG_DWORD, 1)
        winreg.CloseKey(key)
        return True
    except PermissionError:
        print("  ERROR: Permission denied. Run this script as Administrator.")
        return False
    except Exception as e:
        print(f"  ERROR: {e}")
        return False


def restart_audio_service():
    """Restart the Windows Audio service to pick up changes."""
    print("\nRestarting Windows Audio service...")
    try:
        subprocess.run(["net", "stop", "Audiosrv"], capture_output=True, timeout=15)
        subprocess.run(["net", "start", "Audiosrv"], capture_output=True, timeout=15)
        print("  Audio service restarted.")
    except Exception as e:
        print(f"  WARNING: Could not restart audio service: {e}")
        print("  You may need to restart manually or reboot.")


def main():
    print("=" * 60)
    print("TiltedVoice Audio Device Fixer")
    print("=" * 60)

    devices = get_capture_devices()
    if not devices:
        print("\nNo capture devices found in registry!")
        sys.exit(1)

    print(f"\nFound {len(devices)} capture devices:\n")

    active = []
    disabled = []
    microphones = []

    for d in devices:
        sn = state_name(d["state"])
        marker = ""
        if d["state"] == 1:
            active.append(d)
            marker = " ✓"
        elif d["state"] == 4:
            disabled.append(d)
            marker = " ✗ (disabled)"
        elif "Microphone" in str(d["name"]) or "Mic" in str(d["name"]):
            microphones.append(d)

        print(f"  {sn:20s} | {d['name']}{marker}")

    print(f"\n  Active: {len(active)}  |  Disabled: {len(disabled)}  |  Total: {len(devices)}")

    if active:
        print("\n✓ You already have active capture devices. Audio should work.")
        return

    # No active devices — try to enable disabled ones
    print("\n⚠ NO ACTIVE capture devices found!")

    # Find microphone candidates to enable
    candidates = [d for d in disabled if "Microphone" in str(d["name"])]
    if not candidates:
        candidates = disabled[:1]  # Try the first disabled device
    if not candidates:
        # Try devices with state containing DISABLED flag (bit 2)
        candidates = [d for d in devices if (d["state"] & 4) and "Micro" in str(d["name"])]

    if not candidates:
        print("No suitable microphone candidates found to enable.")
        print("Please enable a recording device in Windows Sound Settings:")
        print("  1. Right-click speaker icon in system tray")
        print("  2. Open Sound Settings → Recording")
        print("  3. Right-click → Show Disabled Devices")
        print("  4. Right-click a Microphone → Enable")
        sys.exit(1)

    print(f"\nWill attempt to enable {len(candidates)} device(s):")
    changed = False
    for d in candidates:
        print(f"\n  Enabling: {d['name']} (was {state_name(d['state'])})")
        if enable_device(d):
            print(f"  ✓ {d['name']} set to ACTIVE")
            changed = True
        else:
            print(f"  ✗ Failed to enable {d['name']}")

    if changed:
        restart_audio_service()
        print("\n✓ Done! Try running TiltedVoice now.")
        # Quick verify
        try:
            import sounddevice as sd
            devs = sd.query_devices()
            inputs = [d for d in devs if d["max_input_channels"] > 0]
            print(f"  sounddevice now sees {len(inputs)} input device(s)")
        except Exception:
            pass
    else:
        print("\nNo devices could be enabled. Please enable manually:")
        print("  1. Open: mmsys.cpl (Sound Control Panel)")
        print("  2. Go to Recording tab")
        print("  3. Right-click → Show Disabled Devices")
        print("  4. Right-click Microphone → Enable → Set as Default")


if __name__ == "__main__":
    main()
