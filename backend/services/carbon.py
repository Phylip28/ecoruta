def calcular_impacto(kg_recolectados: float, material: str) -> dict:
    factores_co2 = {
        "plastico": 1.5,
        "carton": 0.9,
        "vidrio": 0.3,
        "mixto": 0.8,
    }

    factor = factores_co2.get(material, 0.8)
    co2_ahorrado = kg_recolectados * factor
    return {
        "kg_desviados": round(kg_recolectados, 2),
        "co2_ahorrado_kg": round(co2_ahorrado, 2),
    }
