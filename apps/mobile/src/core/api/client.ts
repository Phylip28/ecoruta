import { env } from "../../config/env";

export async function getHealth(): Promise<{ status: string; service: string }> {
  const response = await fetch(`${env.apiUrl}/health`);

  if (!response.ok) {
    throw new Error("No fue posible conectar con el backend");
  }

  return response.json();
}
