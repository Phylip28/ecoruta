import httpx
from config import settings


async def notificar_ciudadano(telegram_id: int, mensaje: str) -> bool:
    if not settings.telegram_bot_token:
        return False

    telegram_api = (
        f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage"
    )
    payload = {"chat_id": telegram_id, "text": mensaje}

    async with httpx.AsyncClient(timeout=8) as client:
        response = await client.post(telegram_api, json=payload)

    return response.status_code == 200
