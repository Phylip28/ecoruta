from api.routes import estadisticas, reportes, rutas, solicitudes
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(reportes.router, prefix="/reportes", tags=["reportes"])
api_router.include_router(
    solicitudes.router, prefix="/solicitudes", tags=["solicitudes"]
)
api_router.include_router(rutas.router, prefix="/rutas", tags=["rutas"])
api_router.include_router(
    estadisticas.router, prefix="/estadisticas", tags=["estadisticas"]
)
