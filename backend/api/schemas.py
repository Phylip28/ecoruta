from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

TipoReporte = Literal["emergencia", "solicitud"]
EstadoSolicitud = Literal["pendiente", "en_camino", "completado"]
Material = Literal["carton", "vidrio", "plastico", "mixto"]


class ReporteCreate(BaseModel):
    tipo: TipoReporte = "emergencia"
    latitud: float = Field(..., ge=-90, le=90)
    longitud: float = Field(..., ge=-180, le=180)
    foto_url: str | None = None
    descripcion: str | None = None


class SolicitudCreate(BaseModel):
    latitud: float = Field(..., ge=-90, le=90)
    longitud: float = Field(..., ge=-180, le=180)
    foto_url: str | None = None
    descripcion: str | None = None
    material: Material
    ciudadano_telegram_id: int
    kg_estimados: float = Field(0, ge=0)


class EstadoUpdate(BaseModel):
    estado: EstadoSolicitud


class ReporteResponse(BaseModel):
    id: int
    tipo: TipoReporte
    estado: EstadoSolicitud
    latitud: float
    longitud: float
    foto_url: str | None = None
    descripcion: str | None = None
    material: Material | None = None
    ciudadano_telegram_id: int | None = None
    reciclador_id: int | None = None
    kg_estimados: float
    created_at: datetime
    updated_at: datetime


class RutaResponse(BaseModel):
    reciclador_id: int
    orden: list[ReporteResponse]
    distancia_total_km: float
    tiempo_estimado_min: float | None = None


class HeatmapPoint(BaseModel):
    latitud: float
    longitud: float
    peso: int


class ImpactoResponse(BaseModel):
    kg_desviados_total: float
    co2_ahorrado_total_kg: float
    por_material: dict[str, float]


class HistorialCiudadanoItemResponse(BaseModel):
    id: str
    tipo: TipoReporte
    estado: EstadoSolicitud
    fecha: datetime
    descripcion: str | None = None
    material: Material | None = None
    reciclador_id: int | None = None
    reciclador_nombre: str | None = None
    miniatura_uri: str | None = None
    kg_estimados: float = 0
