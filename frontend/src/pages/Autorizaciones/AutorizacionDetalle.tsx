import { useEffect, useState } from "react";
import type { AutorizacionPendiente } from "../../types/autorizaciones";
import { api } from "../../services/api";
import PdfPreview from "../../components/PdfPreview";
import { ui } from "../../styles/ui";
interface PasoAutorizacion {
  id: number;
  orden: number;
  titulo: string;
  rol: string;
  estado: "PENDIENTE" | "APROBADO";
  puedeFirmar: boolean;
  firmadoEn?: string | null;
  firmadoPor?: string | null;
}

interface FlujoAutorizaciones {
  requisicionId: number;
  flujoId: number;
  pasoActivoOrden: number | null;
  pasos: PasoAutorizacion[];
}

interface Props {
  autorizacion: AutorizacionPendiente;
  onCerrar: () => void;
  onActualizado: () => void;
}

export default function AutorizacionDetalle({
  autorizacion,
  onCerrar,
  onActualizado,
}: Props) {
  const [flujo, setFlujo] = useState<FlujoAutorizaciones | null>(null);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    cargarFlujo();
  }, []);

  async function cargarFlujo() {
    try {
      const res = await api.get<FlujoAutorizaciones>(
        `/requisiciones/${autorizacion.requisicionId}/autorizaciones`,
      );
      setFlujo(res.data);
    } catch (error) {
      console.error(error);
      alert("Error cargando el flujo de la requisición");
    } finally {
      setLoading(false);
    }
  }

  if (loading || !flujo) {
    return <p>Cargando detalle de la requisición...</p>;
  }

  const terminado = flujo.pasos.every((p) => p.estado === "APROBADO");

  const pasoActivo = flujo.pasos.find((p) => p.estado === "PENDIENTE");
  const puedeFirmar = pasoActivo?.puedeFirmar ?? false;

  async function aprobar() {
    if (!pasoActivo) return;

    setEnviando(true);
    try {
      await api.post("/aprobaciones/aprobar", {
        aprobacionId: pasoActivo.id,
        comentario,
      });

      await cargarFlujo();
      onActualizado();
    } catch (error) {
      console.error(error);
      alert("No fue posible aprobar el paso");
    } finally {
      setEnviando(false);
    }
  }

  async function rechazar() {
    if (!pasoActivo) return;

    setEnviando(true);
    try {
      await api.post("/aprobaciones/rechazar", {
        aprobacionId: pasoActivo.id,
        comentario,
      });

      onActualizado();
      onCerrar();
    } catch (error) {
      console.error(error);
      alert("No fue posible rechazar el paso");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className={`${ui.card.base} ${ui.card.padding}`}>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className={ui.text.title}>
          Revisión de requisición {autorizacion.folio}
        </h1>
        <p className={ui.text.subtitle}>Validación y autorización del flujo</p>
      </div>

      {terminado && (
        <div className="p-4 mb-6 text-green-800 bg-green-100 border border-green-300 rounded">
          ✅ Requisición AUTORIZADA
        </div>
      )}

      {/* FLUJO */}
      <div className="space-y-3 mb-6">
        {flujo.pasos.map((paso) => (
          <div
            key={paso.orden}
            className={`p-4 rounded-lg border ${
              paso.estado === "APROBADO"
                ? "bg-green-50 border-green-300"
                : paso.puedeFirmar
                  ? "bg-yellow-50 border-yellow-300"
                  : "bg-gray-50"
            }`}
          >
            <div className="font-semibold">
              {paso.orden}. {paso.titulo}
            </div>

            <div className="text-sm text-gray-600">Rol: {paso.rol}</div>

            <div
              className={`text-sm font-medium ${
                paso.estado === "APROBADO"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              Estado: {paso.estado}
            </div>

            {paso.firmadoEn && (
              <div className="text-xs text-gray-500 mt-1">
                📅 {new Date(paso.firmadoEn).toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* COMENTARIO */}
      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        className={`${ui.input.base} mb-6`}
        placeholder="Comentario (opcional)"
      />

      {/* PDF */}
      <div className="mb-6">
        <PdfPreview requisicionId={autorizacion.requisicionId} height="400px" />
      </div>

      {/* ACCIONES */}
      <div className="flex gap-3 items-center">
        <button
          onClick={aprobar}
          disabled={!puedeFirmar || enviando}
          className={`px-4 py-2 rounded text-white ${
            puedeFirmar ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
          }`}
        >
          {pasoActivo?.rol === "RH" ? "Recibir" : "Firmar"}
        </button>

        <button
          onClick={rechazar}
          disabled={!puedeFirmar || enviando}
          className={`px-4 py-2 rounded text-white ${
            puedeFirmar ? "bg-red-600 hover:bg-red-700" : "bg-gray-400"
          }`}
        >
          Rechazar
        </button>

        <button
          onClick={onCerrar}
          className="ml-auto px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
