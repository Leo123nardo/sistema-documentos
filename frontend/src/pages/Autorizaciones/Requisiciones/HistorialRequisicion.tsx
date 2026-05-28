import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../services/api";
import { ui } from "../../../styles/ui";
interface ItemHistorial {
  paso: string;
  estado: string;
  usuario: string;
  fecha?: string;
  comentario?: string;
}

export default function HistorialRequisicion() {
  const { id } = useParams<{ id: string }>();

  const [historial, setHistorial] = useState<ItemHistorial[]>([]);

  useEffect(() => {
    if (!id) return;

    api
      .get(`/requisiciones/${id}/historial`)
      .then((res) => {
        // ✅ ordenar: más reciente primero
        const ordenado = res.data.sort((a: ItemHistorial, b: ItemHistorial) => {
          return (
            new Date(b.fecha ?? 0).getTime() - new Date(a.fecha ?? 0).getTime()
          );
        });
        setHistorial(ordenado);
      })
      .catch(console.error);
  }, [id]);

  return (
    <div className={ui.layout.container}>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className={ui.text.title}>Historial de requisición #{id}</h1>
        <p className={ui.text.subtitle}>
          Registro de movimientos y autorizaciones
        </p>
      </div>

      {historial.length === 0 && (
        <div className="p-6 bg-white rounded-xl border shadow text-center text-gray-500">
          Sin movimientos registrados
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {historial.map((h, i) => {
          const config =
            h.estado === "RECHAZADO"
              ? {
                  bg: "bg-red-50 border-red-300",
                  text: "text-red-600",
                  icon: "❌",
                }
              : h.estado === "APROBADO"
                ? {
                    bg: "bg-green-50 border-green-300",
                    text: "text-green-600",
                    icon: "✅",
                  }
                : {
                    bg: "bg-yellow-50 border-yellow-300",
                    text: "text-yellow-600",
                    icon: "⏳",
                  };

          return (
            <div
              key={i}
              className={`p-4 rounded-xl border ${config.bg} shadow-sm`}
            >
              {/* TÍTULO */}
              <div className="flex items-center gap-2 mb-2 font-semibold">
                <span>{config.icon}</span>
                {h.paso}
              </div>

              {/* ESTADO */}
              <div className="text-sm mb-1">
                Estado:{" "}
                <span className={`font-semibold ${config.text}`}>
                  {h.estado}
                </span>
              </div>

              {/* USUARIO */}
              <div className="text-xs text-gray-600">
                {h.usuario ?? "Sin usuario"}
              </div>

              {/* FECHA */}
              {h.fecha && (
                <div className="text-xs text-gray-500">
                  {new Date(h.fecha).toLocaleString()}
                </div>
              )}

              {/* COMENTARIO */}
              {h.comentario && (
                <div className="mt-2 text-xs italic text-gray-600">
                  "{h.comentario}"
                </div>
              )}

              {/* RECHAZO */}
              {h.estado === "RECHAZADO" && (
                <div className="mt-2 text-xs font-bold text-red-700">
                  Proceso detenido
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
