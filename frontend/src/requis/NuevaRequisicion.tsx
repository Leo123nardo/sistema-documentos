import { useState, useEffect } from "react";
import { api } from "../services/api";
import { ui } from "../styles/ui";

import Paso1DatosGenerales from "./pasos/Paso1DatosGenerales";
import Paso2Funciones from "./pasos/Paso2Funciones";
import Paso3Requisitos from "./pasos/Paso3Requisitos";
import Paso4Personalidad from "./pasos/Paso4Personalidad";
import Paso5PlanYFlujo from "./pasos/Paso5PlanYFlujo";

export default function NuevaRequisicion() {
  const [paso, setPaso] = useState(1);
  const [idRequisicion, setIdRequisicion] = useState<number | null>(null);
  const [estado, setEstado] = useState<string | null>(null);

  useEffect(() => {
    if (!idRequisicion) return;

    api
      .get(`/requisiciones/${idRequisicion}`)
      .then((res) => setEstado(res.data.estado));
  }, [idRequisicion]);

  if (estado && estado !== "BORRADOR") {
    return (
      <div className="p-6 border rounded bg-yellow-50">
        <h2 className="mb-2 text-lg font-bold">Requisición en revisión</h2>
        <p>No puede modificarse.</p>
      </div>
    );
  }

  return (
    <div className={ui.layout.container}>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className={ui.text.title}>Nueva requisición</h1>
        <p className={ui.text.subtitle}>Complete el proceso paso a paso</p>
      </div>

      {/* STEPS */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((p) => (
          <div
            key={p}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
              paso === p ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            {p}
          </div>
        ))}
      </div>

      {paso === 1 && (
        <Paso1DatosGenerales
          onNext={() => setPaso(2)}
          setIdRequisicion={setIdRequisicion}
        />
      )}

      {paso === 2 && (
        <Paso2Funciones
          idRequisicion={idRequisicion}
          onNext={() => setPaso(3)}
        />
      )}

      {paso === 3 && (
        <Paso3Requisitos
          idRequisicion={idRequisicion}
          onNext={() => setPaso(4)}
        />
      )}

      {paso === 4 && (
        <Paso4Personalidad
          idRequisicion={idRequisicion}
          onNext={() => setPaso(5)}
        />
      )}

      {paso === 5 && <Paso5PlanYFlujo idRequisicion={idRequisicion} />}
    </div>
  );
}
