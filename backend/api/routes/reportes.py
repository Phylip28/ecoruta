from typing import Annotated

from api.dependencies import require_roles
from api.schemas import ReporteCreate, ReporteResponse
from fastapi import APIRouter, Depends
from services.store import store

router = APIRouter()


@router.post("/", response_model=ReporteResponse)
async def crear_reporte(
    payload: ReporteCreate,
    _role: Annotated[str, Depends(require_roles("ciudadano", "admin"))],
) -> dict:
    return store.create(
        {
            "tipo": payload.tipo,
            "estado": "pendiente",
            "latitud": payload.latitud,
            "longitud": payload.longitud,
            "foto_url": payload.foto_url,
            "descripcion": payload.descripcion,
            "material": None,
            "ciudadano_telegram_id": None,
            "reciclador_id": None,
            "kg_estimados": 0,
        }
    )


@router.get("/", response_model=list[ReporteResponse])
async def listar_reportes(
    _role: Annotated[str, Depends(require_roles("admin", "reciclador"))],
) -> list[dict]:
    return store.list()
