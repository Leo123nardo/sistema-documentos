import { useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ui } from "../../styles/ui";
interface Props {
  idRequisicion: number | null;
}

interface Requisicion {
  id: number;
  estado: "BORRADOR" | "EN_REVISION" | "AUTORIZADA" | string;
}

interface PasoAutorizacion {
  id: number;
  orden: number;
  titulo: string;
  rol: string;
  estado: "PENDIENTE" | "APROBADO";
  puedeFirmar: boolean;
  firmadoEn: string | null;
  comentario?: string | null;
}

interface FlujoRequisicion {
  requisicionId: number;
  flujoId: number;
  pasoActivoOrden: number | null;
  pasos: PasoAutorizacion[];
}

export default function Paso5PlanYFlujo({ idRequisicion }: Props) {
  const navigate = useNavigate();

  const [planMediano, setPlanMediano] = useState("");
  const [planLargo, setPlanLargo] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [requisicion, setRequisicion] = useState<Requisicion | null>(null);
  const [cargando, setCargando] = useState(true);

  const yaFirmada = requisicion?.estado !== "BORRADOR";
  const [flujo, setFlujo] = useState<FlujoRequisicion | null>(null);
  useEffect(() => {
    if (!idRequisicion) return;

    api
      .get(`/requisiciones/${idRequisicion}`)
      .then((res) => {
        setRequisicion(res.data);
        if (res.data.estado !== "BORRADOR") {
          api
            .get(`/requisiciones/${idRequisicion}/autorizaciones`)
            .then((r) => setFlujo(r.data))
            .catch((e) => console.error("Error cargando flujo", e));
        }
      })
      .catch((err) => {
        console.error("Error al cargar requisición", err);
      })
      .finally(() => {
        setCargando(false);
      });
  }, [idRequisicion]);

  async function firmarRequisicion() {
    if (!idRequisicion || guardando) return;

    try {
      setGuardando(true);
      await api.post(`/requisiciones/${idRequisicion}/firmar`);
      alert("Requisición firmada y enviada a autorización");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al firmar la requisición");
    } finally {
      setGuardando(false);
    }
  }

  async function aprobarPaso(aprobacionId: number) {
    try {
      await api.post(`/requisiciones/aprobaciones/${aprobacionId}/aprobar`);

      alert("Paso aprobado correctamente");

      const res = await api.get(
        `/requisiciones/${idRequisicion}/autorizaciones`,
      );

      setFlujo(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al aprobar");
    }
  }

  return (
    <div className={`${ui.card.base} ${ui.card.padding}`}>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className={ui.text.title}>Plan de desarrollo y autorización</h1>
        <p className={ui.text.subtitle}>
          Defina el crecimiento del puesto y gestione el flujo de aprobación
        </p>
      </div>

      {/* PLAN DE VIDA */}
      <section className="mb-10">
        <h3 className="mb-3 text-lg font-semibold text-gray-700">
          Plan de desarrollo
        </h3>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className={ui.text.label}>Plan a mediano plazo</label>
            <textarea
              rows={4}
              className={ui.input.base}
              placeholder="Describa objetivos a mediano plazo"
              value={planMediano}
              onChange={(e) => setPlanMediano(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className={ui.text.label}>Plan a largo plazo</label>
            <textarea
              rows={4}
              className={ui.input.base}
              placeholder="Describa objetivos a largo plazo"
              value={planLargo}
              onChange={(e) => setPlanLargo(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* FLUJO */}
      <section className="mb-10">
        <h3 className="mb-4 text-lg font-semibold text-gray-700">
          Flujo de autorización
        </h3>
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="text-gray-700 bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Paso</th>
                <th className="px-3 py-2 text-left">Rol</th>
                <th className="px-3 py-2 text-left">Estado</th>
                <th className="px-3 py-2 text-left">Fecha</th>
                <th className="px-3 py-2 text-left">Acción</th>
              </tr>
            </thead>
            <tbody>
              {flujo?.pasos?.length ? (
                flujo.pasos.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-3 py-2">{p.orden}</td>
                    <td className="px-3 py-2">{p.titulo}</td>
                    <td className="px-3 py-2">
                      <span
                        className={
                          p.estado === "APROBADO"
                            ? "text-green-600 font-semibold"
                            : "text-yellow-600 font-semibold"
                        }
                      >
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {p.firmadoEn
                        ? new Date(p.firmadoEn).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-3 py-2">
                      {p.puedeFirmar && (
                        <button
                          onClick={() => aprobarPaso(p.id)}
                          className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                        >
                          Aprobar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    El flujo se generará al firmar la requisición
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* PDF */}
      <section className="mb-10">
        <h3 className="mb-3 text-lg font-semibold text-gray-700">
          Vista previa
        </h3>

        <iframe
          src={`http://localhost:3000/api/requisiciones/${idRequisicion}/pdf`}
          className="w-full border rounded-lg"
          style={{ height: "600px" }}
          title="Vista previa requisición"
        />
      </section>

      {/* ACCIONES PDF */}
      <div className="flex items-center justify-between mb-8">
        <button
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
          onClick={() =>
            window.open(
              `http://localhost:3000/api/requisiciones/${idRequisicion}/pdf?dl=1`,
              "_blank",
            )
          }
        >
          Descargar PDF
        </button>
      </div>

      {/* ESTADO */}
      {yaFirmada && (
        <div className="p-4 mb-6 text-green-800 bg-green-100 border border-green-300 rounded">
          Requisición firmada correctamente
        </div>
      )}

      {!yaFirmada && (
        <div className="flex justify-end">
          <button
            type="button"
            disabled={guardando || cargando}
            onClick={firmarRequisicion}
            className="px-8 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {guardando ? "Firmando..." : "Firmar y enviar a autorización"}
          </button>
        </div>
      )}
    </div>
  );
}
