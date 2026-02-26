"""Tests for microphone selection behavior."""

from unittest.mock import patch

from tiltedvoice.audio import MicrophoneManager


class TestMicrophoneSelection:
    @patch("tiltedvoice.audio.sd.query_devices")
    def test_prefers_hardware_mic_over_sound_mapper(self, mock_query_devices):
        mock_query_devices.return_value = [
            {"name": "Microsoft Sound Mapper - Input", "max_input_channels": 2, "default_samplerate": 44100},
            {"name": "Microphone (USB Audio Device)", "max_input_channels": 1, "default_samplerate": 48000},
        ]
        mgr = MicrophoneManager()
        picked = mgr.get_default_device()
        assert picked is not None
        assert "microphone" in picked["name"].lower()

    @patch("tiltedvoice.audio.sd.query_devices")
    def test_returns_none_when_no_inputs(self, mock_query_devices):
        mock_query_devices.return_value = [
            {"name": "Speakers (Realtek)", "max_input_channels": 0, "default_samplerate": 48000},
        ]
        mgr = MicrophoneManager()
        assert mgr.get_default_device() is None
