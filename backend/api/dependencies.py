from collections.abc import Callable
from typing import Annotated

from config import settings
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security = HTTPBearer(auto_error=True)

ROLE_BY_TOKEN = {
    settings.ciudadano_token: "ciudadano",
    settings.reciclador_token: "reciclador",
    settings.admin_token: "admin",
}


async def get_current_role(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
) -> str:
    role = ROLE_BY_TOKEN.get(credentials.credentials)
    if role is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalido o expirado",
        )
    return role


def require_roles(*allowed_roles: str) -> Callable:
    async def _require_role(
        role: Annotated[str, Depends(get_current_role)],
    ) -> str:
        if role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para esta accion",
            )
        return role

    return _require_role
