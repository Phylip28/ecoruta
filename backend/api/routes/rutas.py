from typing import Annotated

from api.dependencies import require_roles
from api.schemas import RutaResponse
from fastapi import APIRouter, Depends, Query
from services.routing import calcular_ruta
from services.store import store

router = APIRouter()


@router.get("/{reciclador_id}", response_model=RutaResponse)
async def obtener_ruta(
    reciclador_id: int,
    latitud_actual: float = Query(..., ge=-90, le=90),
    longitud_actual: float = Query(..., ge=-180, le=180),
    _role: Annotated[str, Depends(require_roles("reciclador", "admin"))] = "reciclador",
) -> dict:
    pendientes = [
        s
        for s in store.list()
        if s["tipo"] == "solicitud" and s["estado"] == "pendiente"
    ]
    orden, distancia_total_km = calcular_ruta(
        latitud_actual, longitud_actual, pendientes
    )

    return {
        "reciclador_id": reciclador_id,
        "orden": orden,
        "distancia_total_km": distancia_total_km,
    }
