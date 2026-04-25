import httpx
from config import settings

class ORSClient:
    def __init__(self):
        self.api_key = settings.ors_api_key
        self.base_url = "https://api.openrouteservice.org/v2"

    async def get_matrix(self, locations: list[list[float]], profile: str = "driving-car"):
        """
        Obtiene la matriz de distancias/tiempos entre múltiples puntos.
        locations: Lista de [longitud, latitud]
        """
        if not self.api_key:
            raise ValueError("ORS_API_KEY no configurada")

        url = f"{self.base_url}/matrix/{profile}"
        headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json"
        }
        body = {
            "locations": locations,
            "metrics": ["distance", "duration"],
            "units": "km"
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=body, headers=headers)
            response.raise_for_status()
            return response.json()

    async def get_directions(self, start: list[float], end: list[float], profile: str = "driving-car"):
        """
        Obtiene la ruta detallada entre dos puntos.
        start/end: [longitud, latitud]
        """
        if not self.api_key:
            raise ValueError("ORS_API_KEY no configurada")

        url = f"{self.base_url}/directions/{profile}"
        headers = {
            "Authorization": self.api_key,
        }
        params = {
            "api_key": self.api_key,
            "start": f"{start[0]},{start[1]}",
            "end": f"{end[0]},{end[1]}"
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, headers=headers)
            response.raise_for_status()
            return response.json()
