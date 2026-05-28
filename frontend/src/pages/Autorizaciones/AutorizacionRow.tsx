import type { AutorizacionPendiente } from "../../types/autorizaciones";

interface Props {
  item: AutorizacionPendiente;
  onRevisar: () => void;
}

export function AutorizacionRow({ item, onRevisar }: Props) {
  return (
    <tr>
      <td className="px-3 py-2 border">{item.folio}</td>

      <td className="px-3 py-2 border">
        {item.rol === "RH" ? "Recepción RH" : item.rol}
      </td>

      <td className="px-3 py-2 border">{item.puesto}</td>

      <td className="px-3 py-2 text-center border">{item.progreso || "—"}</td>
       console.log("ITEM:", item);
      <td className="px-3 py-2 text-right border">
        <button
          onClick={onRevisar}
          className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Revisar
        </button>
      </td>
    </tr>
  );
}
