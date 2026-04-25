import { useEffect, useState } from "react";
import { Info, Save } from "lucide-react";

const defaultApiUrl = "http://localhost:8000";

export function SettingsPanel() {
  const [apiUrl, setApiUrl] = useState(() => import.meta.env.VITE_API_URL ?? defaultApiUrl);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ecoruta_admin_vite_api_url");
    if (stored) {
      setApiUrl(stored);
    }
  }, []);

  return (
    <div className="max-w-2xl space-y-eco-4">
      <p className="max-w-3xl font-sans text-body-sm text-eco-gray-600">
        Preferencias solo en este navegador. El client HTTP real sigue usando variables de Vite al compilar; aquí podés anotar la
        base URL y exportar al portapapeles o guardar en <span className="font-mono text-code">localStorage</span> para
        pruebas manuales.
      </p>

      <div
        className="flex items-start gap-eco-2 rounded-eco-md border border-eco-teal/20 bg-[rgba(0,92,83,0.06)] px-eco-3 py-eco-2 font-sans text-body-sm text-eco-gray-700"
        role="status"
      >
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-eco-teal" aria-hidden />
        <p>
          Token admin actual (build): <code className="font-mono text-code text-eco-navy">VITE_ADMIN_TOKEN</code> (no se muestra
          en pantalla).
        </p>
      </div>

      <div className="rounded-eco-lg border border-eco-gray-200 bg-eco-white p-6 shadow-eco-sm">
        <h2 className="font-display text-h3 text-eco-navy">Conexión API</h2>
        <label className="mt-4 block font-sans text-label text-eco-gray-700" htmlFor="api-url">
          Base URL
        </label>
        <input
          id="api-url"
          name="api-url"
          type="url"
          value={apiUrl}
          onChange={(e) => {
            setApiUrl(e.target.value);
            setSaved(false);
          }}
          className="mt-2 w-full rounded-eco-md border border-eco-gray-200 bg-eco-gray-50 px-eco-3 py-2.5 font-mono text-body-sm text-eco-navy outline-none ring-eco-teal/0 transition focus:border-eco-teal focus:ring-2 focus:ring-eco-teal/20"
        />
        <p className="mt-2 font-sans text-caption text-eco-gray-500">Ej.: {defaultApiUrl}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(apiUrl);
            }}
            className="inline-flex h-10 items-center justify-center rounded-eco-md border border-eco-gray-200 bg-eco-white px-4 font-sans text-label text-eco-teal shadow-eco-sm transition hover:bg-eco-gray-50"
          >
            Copiar URL
          </button>
          <button
            type="button"
            onClick={() => {
              localStorage.setItem("ecoruta_admin_vite_api_url", apiUrl);
              setSaved(true);
            }}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-eco-md bg-eco-teal px-5 font-sans text-label text-eco-white shadow-eco-md transition duration-eco-fast hover:brightness-110"
          >
            <Save className="h-4 w-4" aria-hidden />
            Guardar en el navegador
          </button>
        </div>
        {saved ? (
          <p className="mt-3 font-sans text-caption text-eco-success">Guardado. Revisá <span className="font-mono">.env</span> para un cambio real del bundle.</p>
        ) : null}
      </div>
    </div>
  );
}
