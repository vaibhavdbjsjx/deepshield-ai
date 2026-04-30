import socket
from threading import Lock

_state = {"local_ip": "127.0.0.1", "local_url": "http://127.0.0.1:5173", "public_url": "", "https_ready": False}
_lock = Lock()


def init_share_info():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        sock.connect(("8.8.8.8", 80))
        ip = sock.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"
    finally:
        sock.close()
    with _lock:
        _state["local_ip"] = ip
        _state["local_url"] = f"http://{ip}:5173"
    print(f"Access app locally at: http://{ip}:5173")
    return get_share_info()


def get_share_info():
    with _lock:
        data = dict(_state)
    data["fallback_message"] = "Connect to same WiFi to access" if not data["public_url"] else "Public link active"
    return data
