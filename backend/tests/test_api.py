from fastapi.testclient import TestClient
from main import app
from services.store import store

client = TestClient(app)

ADMIN_HEADERS = {"Authorization": "Bearer admin-dev-token"}
CIUDADANO_HEADERS = {"Authorization": "Bearer ciudadano-dev-token"}
RECICLADOR_HEADERS = {"Authorization": "Bearer reciclador-dev-token"}


def setup_function() -> None:
    store.clear()


def test_healthcheck() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_solicitud_flow_y_impacto() -> None:
    create_response = client.post(
        "/api/solicitudes/",
        headers=CIUDADANO_HEADERS,
        json={
            "latitud": 6.2442,
            "longitud": -75.5812,
            "material": "plastico",
            "ciudadano_telegram_id": 123456789,
            "kg_estimados": 5,
            "descripcion": "residuos plasticos",
        },
    )
    assert create_response.status_code == 200
    solicitud_id = create_response.json()["id"]

    pendientes_response = client.get(
        "/api/solicitudes/pendientes",
        headers=RECICLADOR_HEADERS,
    )
    assert pendientes_response.status_code == 200
    assert len(pendientes_response.json()) == 1

    en_camino_response = client.patch(
        f"/api/solicitudes/{solicitud_id}/estado",
        headers=RECICLADOR_HEADERS,
        json={"estado": "en_camino"},
    )
    assert en_camino_response.status_code == 200

    completado_response = client.patch(
        f"/api/solicitudes/{solicitud_id}/estado",
        headers=RECICLADOR_HEADERS,
        json={"estado": "completado"},
    )
    assert completado_response.status_code == 200

    impacto_response = client.get("/api/estadisticas/impacto", headers=ADMIN_HEADERS)
    assert impacto_response.status_code == 200
    payload = impacto_response.json()
    assert payload["kg_desviados_total"] == 5
    assert payload["co2_ahorrado_total_kg"] == 7.5


def test_forbidden_access_to_admin_route() -> None:
    response = client.get("/api/estadisticas/impacto", headers=CIUDADANO_HEADERS)
    assert response.status_code == 403


def test_historial_ciudadano() -> None:
    # Create a reporte and a solicitud as ciudadano
    client.post(
        "/api/reportes/",
        headers=CIUDADANO_HEADERS,
        json={"tipo": "emergencia", "latitud": 6.2442, "longitud": -75.5812},
    )
    client.post(
        "/api/solicitudes/",
        headers=CIUDADANO_HEADERS,
        json={
            "latitud": 6.2442,
            "longitud": -75.5812,
            "material": "carton",
            "ciudadano_telegram_id": 123456789,
            "kg_estimados": 3,
        },
    )

    response = client.get("/api/ciudadano/historial", headers=CIUDADANO_HEADERS)
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 2
    # All items must have required fields
    for item in items:
        assert "id" in item
        assert isinstance(item["id"], str)
        assert item["tipo"] in ("emergencia", "solicitud")
        assert item["estado"] in ("pendiente", "en_camino", "completado")
        assert "fecha" in item

    # Admin may also access the historial
    admin_response = client.get("/api/ciudadano/historial", headers=ADMIN_HEADERS)
    assert admin_response.status_code == 200

    # Reciclador must be forbidden
    forbidden = client.get("/api/ciudadano/historial", headers=RECICLADOR_HEADERS)
    assert forbidden.status_code == 403
