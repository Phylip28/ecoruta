from typing import Annotated

from api.dependencies import require_roles
from api.schemas import HistorialCiudadanoItemResponse
from fastapi import APIRouter, Depends
from services.store import store

router = APIRouter()


@router.get("/historial", response_model=list[HistorialCiudadanoItemResponse])
async def historial_ciudadano(
    _role: Annotated[str, Depends(require_roles("ciudadano", "admin"))],
) -> list[dict]:
    """Return all reportes and solicitudes visible to the ciudadano role."""
    return [
        {
            "id": str(item["id"]),
            "tipo": item["tipo"],
            "estado": item["estado"],
            "fecha": item["created_at"],
            "descripcion": item.get("descripcion"),
            "material": item.get("material"),
            "reciclador_nombre": None,
            "miniatura_uri": item.get("foto_url"),
        }
        for item in store.list()
    ]
