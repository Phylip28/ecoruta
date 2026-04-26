from typing import Annotated

from api.dependencies import require_roles
from api.schemas import EstadoUpdate, ReporteResponse, SolicitudCreate
from fastapi import APIRouter, Depends, HTTPException, Path, status
from services.store import store
from workers.telegram import notificar_cambio_estado

router = APIRouter()

VALID_TRANSITIONS = {
    "pendiente": {"en_camino"},
    "en_camino": {"completado"},
    "completado": set(),
}


@router.post("/", response_model=ReporteResponse)
async def crear_solicitud(
    payload: SolicitudCreate,
    _role: Annotated[str, Depends(require_roles("ciudadano", "admin"))],
) -> dict:
    return store.create(
        {
            "tipo": "solicitud",
            "estado": "pendiente",
            "latitud": payload.latitud,
            "longitud": payload.longitud,
            "foto_url": payload.foto_url,
            "descripcion": payload.descripcion,
            "material": payload.material,
            "ciudadano_telegram_id": payload.ciudadano_telegram_id,
            "reciclador_id": None,
            "kg_estimados": payload.kg_estimados,
        }
    )


@router.get("/pendientes", response_model=list[ReporteResponse])
async def listar_pendientes(
    _role: Annotated[str, Depends(require_roles("reciclador", "admin"))],
) -> list[dict]:
    return [
        s
        for s in store.list()
        if s["estado"] == "pendiente"
    ]


@router.patch("/{solicitud_id}/estado", response_model=ReporteResponse)
async def actualizar_estado(
    payload: EstadoUpdate,
    _role: Annotated[str, Depends(require_roles("reciclador", "admin"))],
    solicitud_id: int = Path(..., ge=1),
) -> dict:
    actual = store.get(solicitud_id)
    if actual is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solicitud no encontrada",
        )

    estado_actual = actual["estado"]
    if payload.estado not in VALID_TRANSITIONS[estado_actual]:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Transicion no permitida de {estado_actual} a {payload.estado}",
        )

    updated = store.update(solicitud_id, {"estado": payload.estado})
    if updated is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solicitud no encontrada",
        )

    if updated.get("ciudadano_telegram_id"):
        await notificar_cambio_estado(
            telegram_id=updated["ciudadano_telegram_id"],
            estado=payload.estado,
            kg_estimados=float(updated["kg_estimados"]),
        )

    return updated
