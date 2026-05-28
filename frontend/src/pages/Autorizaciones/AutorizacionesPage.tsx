import { useEffect, useState } from "react";
import { AutorizacionesList } from "./AutorizacionesList";
import AutorizacionDetalle from "./AutorizacionDetalle";
import type { AutorizacionPendiente } from "../../types/autorizaciones";
import { api } from "../../services/api";
import { ui } from "../../styles/ui";
import { usePageTitle } from "../../../Hooks/usePageTitle";
export default function AutorizacionesPage() {
  const [pendientes, setPendientes] = useState<AutorizacionPendiente[]>([]);
  const [seleccionada, setSeleccionada] =
    useState<AutorizacionPendiente | null>(null);
  const [loading, setLoading] = useState(true);

  async function cargarPendientes() {
    try {
      setLoading(true);
      const res = await api.get("/aprobaciones/pendientes");
      setPendientes(res.data);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar las autorizaciones pendientes");
    } finally {
      setLoading(false);
    }
  }

  usePageTitle("Autorizaciones");

  useEffect(() => {
    cargarPendientes();
  }, []);

  if (seleccionada) {
    return (
      <AutorizacionDetalle
        autorizacion={seleccionada}
        onCerrar={() => setSeleccionada(null)}
        onActualizado={cargarPendientes}
      />
    );
  }

  return (
    <div className={ui.layout.container}>
      <div className="mb-6">
        <h1 className={ui.text.title}>Autorizaciones pendientes</h1>
        <p className={ui.text.subtitle}>
          Requisiciones en espera de revisión y aprobación
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando autorizaciones...</p>
      ) : pendientes.length === 0 ? (
        <div className="p-6 text-center text-gray-500 bg-white border shadow rounded-xl">
          No tienes autorizaciones pendientes ✅
        </div>
      ) : (
        <AutorizacionesList
          data={pendientes}
          loading={loading}
          onRevisar={setSeleccionada}
        />
      )}
    </div>
  );
}
