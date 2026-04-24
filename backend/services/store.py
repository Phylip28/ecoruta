from datetime import datetime, timezone
from threading import Lock


class InMemoryStore:
    def __init__(self) -> None:
        self._lock = Lock()
        self._next_id = 1
        self._reportes: dict[int, dict] = {}

    def create(self, payload: dict) -> dict:
        with self._lock:
            now = datetime.now(timezone.utc)
            item = {
                "id": self._next_id,
                "created_at": now,
                "updated_at": now,
                **payload,
            }
            self._reportes[self._next_id] = item
            self._next_id += 1
            return item.copy()

    def get(self, reporte_id: int) -> dict | None:
        item = self._reportes.get(reporte_id)
        return item.copy() if item else None

    def list(self) -> list[dict]:
        return [item.copy() for item in self._reportes.values()]

    def update(self, reporte_id: int, changes: dict) -> dict | None:
        with self._lock:
            item = self._reportes.get(reporte_id)
            if item is None:
                return None
            item.update(changes)
            item["updated_at"] = datetime.now(timezone.utc)
            return item.copy()

    def clear(self) -> None:
        with self._lock:
            self._reportes.clear()
            self._next_id = 1


store = InMemoryStore()
