import asyncio
import os
from services.routing_advanced import calcular_ruta_avanzada

async def main():
    print("--- Probando Integración con OpenRouteService ---")
    
    # Coordenadas de prueba (Medellín, Colombia)
    reciclador = {"lat": 6.2442, "lon": -75.5812} # Cerro Nutibara
    solicitudes = [
        {"id": 1, "latitud": 6.2518, "longitud": -75.5636, "descripcion": "Centro"},
        {"id": 2, "latitud": 6.2083, "longitud": -75.5678, "descripcion": "El Poblado"},
    ]

    try:
        ruta, distancia, tiempo = await calcular_ruta_avanzada(
            reciclador["lat"], 
            reciclador["lon"], 
            solicitudes
        )
        
        print("\nResultado exitoso:")
        print(f"Distancia Total: {distancia} km")
        print(f"Tiempo Estimado: {tiempo} min")
        print("\nOrden de recolección:")
        for i, s in enumerate(ruta, 1):
            print(f"{i}. {s['descripcion']} ({s['latitud']}, {s['longitud']})")
            
    except Exception as e:
        print(f"\nError durante la prueba: {e}")
        print("\nNota: Asegúrate de haber puesto tu API KEY en el archivo .env")

if __name__ == "__main__":
    asyncio.run(main())
