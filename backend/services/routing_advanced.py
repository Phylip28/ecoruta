import math

from services.ors import ORSClient


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def _calcular_ruta_haversine(
    reciclador_lat: float,
    reciclador_lon: float,
    solicitudes: list[dict],
) -> tuple[list[dict], float, float]:
    """Nearest-neighbor con distancia Haversine. Fallback cuando ORS no está disponible."""
    pendientes = solicitudes.copy()
    ruta_ordenada: list[dict] = []
    actual_lat, actual_lon = reciclador_lat, reciclador_lon
    distancia_total = 0.0

    while pendientes:
        siguiente = min(
            pendientes,
            key=lambda s: _haversine_km(actual_lat, actual_lon, s["latitud"], s["longitud"]),
        )
        distancia_total += _haversine_km(actual_lat, actual_lon, siguiente["latitud"], siguiente["longitud"])
        ruta_ordenada.append(siguiente)
        actual_lat, actual_lon = siguiente["latitud"], siguiente["longitud"]
        pendientes.remove(siguiente)

    # Estimate 20 km/h average cycling speed
    tiempo_min = round((distancia_total / 20) * 60, 2)
    return ruta_ordenada, round(distancia_total, 2), tiempo_min


async def calcular_ruta_avanzada(
    reciclador_lat: float,
    reciclador_lon: float,
    solicitudes: list[dict],
) -> tuple[list[dict], float, float]:
    """
    Calcula la ruta óptima utilizando distancias reales de calles vía OpenRouteService.
    Si ORS no está configurado, hace fallback a Nearest-Neighbor con Haversine.
    Retorna: (ruta_ordenada, distancia_total_km, tiempo_total_min)
    """
    if not solicitudes:
        return [], 0.0, 0.0

    try:
        client = ORSClient()

        # Preparamos las localizaciones: [lon, lat] para ORS
        locations = [[reciclador_lon, reciclador_lat]]
        for s in solicitudes:
            locations.append([s["longitud"], s["latitud"]])

        matrix_data = await client.get_matrix(locations)
        distances = matrix_data["distances"]  # km
        durations = matrix_data["durations"]  # seconds

        ruta_ordenada: list[dict] = []
        pendientes_idx = list(range(1, len(locations)))
        actual_idx = 0
        distancia_total = 0.0
        tiempo_total_seg = 0.0

        while pendientes_idx:
            siguiente_idx = min(
                pendientes_idx,
                key=lambda idx: distances[actual_idx][idx],
            )
            distancia_total += distances[actual_idx][siguiente_idx]
            tiempo_total_seg += durations[actual_idx][siguiente_idx]
            ruta_ordenada.append(solicitudes[siguiente_idx - 1])
            pendientes_idx.remove(siguiente_idx)
            actual_idx = siguiente_idx

        return ruta_ordenada, round(distancia_total, 2), round(tiempo_total_seg / 60, 2)

    except (ValueError, Exception):
        # Fallback: ORS no configurado o error de red
        return _calcular_ruta_haversine(reciclador_lat, reciclador_lon, solicitudes)
