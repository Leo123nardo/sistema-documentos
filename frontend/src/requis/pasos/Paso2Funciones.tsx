import { useState } from "react";
import { api } from "../../services/api";
import { ui } from "../../styles/ui";

interface Props {
  idRequisicion: number | null;
  onNext: () => void;
}

interface Funcion {
  orden: number;
  descripcion: string;
}

export default function Paso2Funciones({ idRequisicion, onNext }: Props) {
  const [funciones, setFunciones] = useState<Funcion[]>([
    { orden: 1, descripcion: "" },
    { orden: 2, descripcion: "" },
    { orden: 3, descripcion: "" },
    { orden: 4, descripcion: "" },
    { orden: 5, descripcion: "" },
  ]);

  function handleChange(index: number, value: string) {
    const copia = [...funciones];
    copia[index].descripcion = value;
    setFunciones(copia);
  }

  function agregarFuncion() {
    setFunciones([
      ...funciones,
      { orden: funciones.length + 1, descripcion: "" },
    ]);
  }

  async function guardarYContinuar() {
    try {
      if (!idRequisicion) return;

      const funcionesValidas = funciones.filter(
        (f) => f.descripcion.trim() !== "",
      );

      for (const f of funcionesValidas) {
        await api.post(`/requisiciones/${idRequisicion}/funciones`, {
          orden: f.orden,
          descripcion: f.descripcion.trim(),
        });
      }

      onNext();
    } catch (error) {
      console.error(error);
      alert("Error al guardar funciones");
    }
  }

  return (
    <div className={`${ui.card.base} ${ui.card.padding}`}>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className={ui.text.title}>Funciones del puesto</h1>
        <p className={ui.text.subtitle}>
          Enumere en orden de prioridad las funciones principales
        </p>
      </div>

      {/* CONTENEDOR FUNCIONES */}
      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
        {funciones.map((funcion, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50"
          >
            {/* NUMERO */}
            <div className="w-8 text-sm font-bold text-gray-500">
              {funcion.orden}.
            </div>

            {/* INPUT */}
            <textarea
              rows={3}
              placeholder={`Función ${funcion.orden}`}
              className={`${ui.input.base}`}
              value={funcion.descripcion}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* BOTÓN AGREGAR */}
      <div className="flex justify-center mb-8">
        <button
          onClick={agregarFuncion}
          className="px-4 py-2 text-sm font-medium text-white transition bg-orange-500 rounded hover:bg-orange-600"
        >
          + Agregar función
        </button>
      </div>

      {/* ACCIONES */}
      <div className="flex justify-end">
        <button onClick={guardarYContinuar} className={ui.button.primary}>
          Siguiente →
        </button>
      </div>
    </div>
  );
}
