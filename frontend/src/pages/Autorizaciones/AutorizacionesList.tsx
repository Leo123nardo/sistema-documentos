import type { AutorizacionPendiente } from "../../types/autorizaciones";
import { ui } from "../../styles/ui";
interface Props {
  data: AutorizacionPendiente[];
  loading: boolean;
  onRevisar: (a: AutorizacionPendiente) => void;
}

export function AutorizacionesList({ data, loading, onRevisar }: Props) {
  if (loading) {
    return <p>Cargando autorizaciones…</p>;
  }

  if (data.length === 0) {
    return <p>No tienes autorizaciones pendientes.</p>;
  }

  return (
    <div className={ui.grid.responsive}>
      {data.map((item) => (
        <div
          key={item.aprobacionId}
          className={`${ui.card.base} ${ui.card.padding}`}
        >
          <div className="mb-2 text-lg font-bold text-gray-800">
            {item.folio}
          </div>

          <div className="text-sm text-gray-500 mb-1">
            {item.rol === "RH" ? "Recepción RH" : item.rol}
          </div>

          <div className="text-sm text-gray-600 mb-3">{item.puesto}</div>

          <div className="mb-4">
            <span className={`${ui.badge.base} ${ui.badge.pendiente}`}>
              {item.progreso || "Pendiente"}
            </span>
          </div>

          <button
            onClick={() => onRevisar(item)}
            className="w-full px-3 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Revisar →
          </button>
        </div>
      ))}
    </div>
  );
}
