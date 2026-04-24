from services.carbon import calcular_impacto
from services.routing import calcular_ruta


def test_calcular_impacto_por_material() -> None:
    impacto = calcular_impacto(10, "plastico")
    assert impacto["kg_desviados"] == 10
    assert impacto["co2_ahorrado_kg"] == 15


def test_calcular_ruta_nearest_neighbor() -> None:
    solicitudes = [
        {"id": 1, "latitud": 6.2500, "longitud": -75.5900},
        {"id": 2, "latitud": 6.2600, "longitud": -75.6000},
        {"id": 3, "latitud": 6.2442, "longitud": -75.5812},
    ]

    orden, distancia_total = calcular_ruta(6.2440, -75.5810, solicitudes)

    assert [item["id"] for item in orden] == [3, 1, 2]
    assert distancia_total > 0
