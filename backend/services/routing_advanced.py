from services.ors import ORSClient

async def calcular_ruta_avanzada(
    reciclador_lat: float,
    reciclador_lon: float,
    solicitudes: list[dict],
) -> tuple[list[dict], float, float]:
    """
    Calcula la ruta óptima utilizando distancias reales de calles vía OpenRouteService.
    Retorna: (ruta_ordenada, distancia_total_km, tiempo_total_min)
    """
    if not solicitudes:
        return [], 0.0, 0.0

    client = ORSClient()
    
    # Preparamos las localizaciones: [lon, lat] para ORS
    # El primer punto es el origen (reciclador)
    locations = [[reciclador_lon, reciclador_lat]]
    for s in solicitudes:
        locations.append([s["longitud"], s["latitud"]])

    # Obtenemos la matriz de distancias y duraciones
    matrix_data = await client.get_matrix(locations)
    distances = matrix_data["distances"] # Matrix de distancias en KM
    durations = matrix_data["durations"] # Matrix de duraciones en Segundos

    ruta_ordenada = []
    pendientes_idx = list(range(1, len(locations)))
    actual_idx = 0
    distancia_total = 0.0
    tiempo_total_seg = 0.0

    while pendientes_idx:
        # Buscamos el punto más cercano (en distancia real) desde el punto actual
        siguiente_idx = min(
            pendientes_idx,
            key=lambda idx: distances[actual_idx][idx]
        )

        distancia_total += distances[actual_idx][siguiente_idx]
        tiempo_total_seg += durations[actual_idx][siguiente_idx]
        
        # El índice de la solicitud en la lista original es (siguiente_idx - 1)
        ruta_ordenada.append(solicitudes[siguiente_idx - 1])
        
        pendientes_idx.remove(siguiente_idx)
        actual_idx = siguiente_idx

    return ruta_ordenada, round(distancia_total, 2), round(tiempo_total_seg / 60, 2)
