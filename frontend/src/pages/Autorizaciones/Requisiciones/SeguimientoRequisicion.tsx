import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../services/api";
import PdfPreview from "../../../components/PdfPreview";
import { ui } from "../../../styles/ui";
/* ================================
   TIPOS
================================ */

interface PasoSeguimiento {
  orden: number;
  titulo: string;
  rol: string;
  estado: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  firmadoEn?: string | null;
  comentario?: string | null;
}

interface FlujoSeguimiento {
  requisicionId: number;
  flujoId: number;
  pasoActivoOrden: number | null;
  pasos: PasoSeguimiento[];
}

/* ================================
   COMPONENTE
================================ */

export default function SeguimientoRequisicion() {
  const { id } = useParams<{ id: string }>();
  const [flujo, setFlujo] = useState<FlujoSeguimiento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarSeguimiento();
  }, []);

  async function cargarSeguimiento() {
    try {
      const res = await api.get<FlujoSeguimiento>(
        `/requisiciones/${id}/autorizaciones`,
      );
      setFlujo(res.data);
    } catch (error) {
      console.error(error);
      alert("No fue posible cargar el seguimiento de la requisición");
    } finally {
      setLoading(false);
    }
  }

  if (loading || !flujo) {
    return <p>Cargando seguimiento...</p>;
  }

  const flujoFinalizado = flujo.pasoActivoOrden === null;
  const flujoRechazado = flujo.pasos.some((p) => p.estado === "RECHAZADO");

  return (
    <div className={ui.layout.container}>
      <div className="mb-6">
        <h1 className={ui.text.title}>
          Seguimiento de requisición #{flujo.requisicionId}
        </h1>
      </div>

      {flujoRechazado && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">
          Requisición rechazada
        </div>
      )}

      {flujoFinalizado && !flujoRechazado && (
        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">
          Requisición autorizada
        </div>
      )}

      <div className="mb-6 space-y-4">
        {flujo.pasos.map((paso) => (
          <div
            key={paso.orden}
            className={`p-4 rounded-lg border ${
              paso.estado === "APROBADO"
                ? "bg-green-50 border-green-300"
                : paso.estado === "RECHAZADO"
                  ? "bg-red-50 border-red-300"
                  : "bg-yellow-50 border-yellow-300"
            }`}
          >
            <div className="font-semibold">
              {paso.orden}. {paso.titulo}
            </div>

            <div className="text-sm text-gray-600">{paso.rol}</div>

            <div className="text-sm font-medium">{paso.estado}</div>
          </div>
        ))}
      </div>

      <PdfPreview requisicionId={Number(id)} height="450px" />

      <div className="mt-4">
        <a
          href={`http://localhost:3000/api/requisiciones/${id}/pdf?dl=1`}
          className="text-blue-600 hover:underline"
        >
          Descargar PDF
        </a>
      </div>
    </div>
  );
}
