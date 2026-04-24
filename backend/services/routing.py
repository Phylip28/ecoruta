import math


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    earth_radius_km = 6371.0

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return earth_radius_km * c


def calcular_ruta(
    reciclador_lat: float,
    reciclador_lon: float,
    solicitudes: list[dict],
) -> tuple[list[dict], float]:
    pendientes = solicitudes.copy()
    ruta_ordenada: list[dict] = []

    actual_lat = reciclador_lat
    actual_lon = reciclador_lon
    distancia_total = 0.0

    while pendientes:
        siguiente = min(
            pendientes,
            key=lambda s: haversine_km(
                actual_lat,
                actual_lon,
                s["latitud"],
                s["longitud"],
            ),
        )

        distancia_total += haversine_km(
            actual_lat,
            actual_lon,
            siguiente["latitud"],
            siguiente["longitud"],
        )
        ruta_ordenada.append(siguiente)

        actual_lat = siguiente["latitud"]
        actual_lon = siguiente["longitud"]
        pendientes.remove(siguiente)

    return ruta_ordenada, round(distancia_total, 2)
