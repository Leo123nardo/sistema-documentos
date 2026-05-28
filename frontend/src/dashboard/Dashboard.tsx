import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Link } from "react-router-dom";
import { ui } from "../styles/ui";

interface Requisicion {
  id: number;
  folio: string;
  estado: string;
}

export default function Dashboard() {
  const [requisiciones, setRequisiciones] = useState<Requisicion[]>([]);
  const [pagina, setPagina] = useState(1);
  const porPagina = 6;

  useEffect(() => {
    document.title = "Dashboard | GEC‑VAC";

    api
      .get("/requisiciones")
      .then((res) => setRequisiciones(res.data))
      .catch(console.error);
  }, []);

  const inicio = (pagina - 1) * porPagina;
  const fin = inicio + porPagina;

  const dataPaginada = requisiciones.slice(inicio, fin);
  const totalPaginas = Math.ceil(requisiciones.length / porPagina);

  return (
    <div className={ui.layout.container}>
      {/* HEADER */}
      <div className={ui.layout.section}>
        <h1 className={ui.text.title}>Requisiciones</h1>
        <p className={ui.text.subtitle}>
          Gestión y seguimiento de requisiciones
        </p>
      </div>

      {/* GRID */}
      <div className={ui.grid.responsive}>
        {dataPaginada.map((r) => {
          const estadoClass =
            r.estado === "AUTORIZADA"
              ? ui.badge.aprobado
              : r.estado === "EN_REVISION"
                ? ui.badge.pendiente
                : ui.badge.rechazado;

          return (
            <div key={r.id} className={`${ui.card.base} ${ui.card.padding}`}>
              <div className="mb-2 text-lg font-bold text-gray-800">
                {r.folio}
              </div>

              <div className={`${ui.badge.base} ${estadoClass}`}>
                {r.estado.replace("_", " ")}
              </div>

              <div className="mt-4">
                <Link
                  to={`/dashboard/requisiciones/${r.id}/seguimiento`}
                  className={ui.button.link}
                >
                  Ver seguimiento →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINACIÓN */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            onClick={() => setPagina(i + 1)}
            className={`px-3 py-1 rounded ${
              pagina === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
