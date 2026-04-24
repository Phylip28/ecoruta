from api.router import api_router
from config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.store import store

app = FastAPI(title=settings.app_name, version=settings.app_version)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

# Seed demo data so the admin dashboard shows real points on first load.
# Coordenadas representativas de comunas de Medellín.
_SEED: list[dict] = [
    {"latitud": 6.2518, "longitud": -75.5636, "material": "plastico",  "kg_estimados": 4.0, "ciudadano_telegram_id": 111, "estado": "pendiente"},
    {"latitud": 6.2393, "longitud": -75.5727, "material": "carton",    "kg_estimados": 7.5, "ciudadano_telegram_id": 222, "estado": "pendiente"},
    {"latitud": 6.2601, "longitud": -75.5801, "material": "vidrio",    "kg_estimados": 3.2, "ciudadano_telegram_id": 333, "estado": "en_camino"},
    {"latitud": 6.2310, "longitud": -75.5900, "material": "mixto",     "kg_estimados": 6.0, "ciudadano_telegram_id": 444, "estado": "pendiente"},
    {"latitud": 6.2710, "longitud": -75.5678, "material": "plastico",  "kg_estimados": 2.5, "ciudadano_telegram_id": 555, "estado": "completado"},
    {"latitud": 6.2455, "longitud": -75.5580, "material": "carton",    "kg_estimados": 9.0, "ciudadano_telegram_id": 666, "estado": "pendiente"},
    {"latitud": 6.2200, "longitud": -75.5750, "material": "vidrio",    "kg_estimados": 1.8, "ciudadano_telegram_id": 777, "estado": "completado"},
]

for _item in _SEED:
    store.create({
        "tipo": "solicitud",
        "latitud": _item["latitud"],
        "longitud": _item["longitud"],
        "foto_url": None,
        "descripcion": "Solicitud demo",
        "material": _item["material"],
        "ciudadano_telegram_id": _item["ciudadano_telegram_id"],
        "reciclador_id": None,
        "kg_estimados": _item["kg_estimados"],
        "estado": _item["estado"],
    })


@app.get("/health", tags=["health"])
async def healthcheck() -> dict:
    return {"status": "ok", "service": settings.app_name}
