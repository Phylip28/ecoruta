from typing import Annotated

from api.dependencies import require_roles
from api.schemas import HeatmapPoint, ImpactoResponse
from fastapi import APIRouter, Depends
from services.carbon import calcular_impacto
from services.store import store

router = APIRouter()


@router.get("/heatmap", response_model=list[HeatmapPoint])
async def heatmap(
    _role: Annotated[str, Depends(require_roles("admin"))],
) -> list[dict]:
    activos = [item for item in store.list() if item["estado"] != "completado"]
    return [
        {
            "latitud": item["latitud"],
            "longitud": item["longitud"],
            "peso": 1,
        }
        for item in activos
    ]


@router.get("/impacto", response_model=ImpactoResponse)
async def impacto(
    _role: Annotated[str, Depends(require_roles("admin"))],
) -> dict:
    completadas = [
        item
        for item in store.list()
        if item["tipo"] == "solicitud" and item["estado"] == "completado"
    ]

    por_material: dict[str, float] = {
        "plastico": 0.0,
        "carton": 0.0,
        "vidrio": 0.0,
        "mixto": 0.0,
    }
    kg_total = 0.0
    co2_total = 0.0

    for solicitud in completadas:
        material = solicitud.get("material") or "mixto"
        kg = float(solicitud.get("kg_estimados") or 0)
        impacto_material = calcular_impacto(kg, material)
        kg_total += impacto_material["kg_desviados"]
        co2_total += impacto_material["co2_ahorrado_kg"]
        por_material[material] = round(
            por_material.get(material, 0.0) + impacto_material["co2_ahorrado_kg"],
            2,
        )

    return {
        "kg_desviados_total": round(kg_total, 2),
        "co2_ahorrado_total_kg": round(co2_total, 2),
        "por_material": por_material,
    }
