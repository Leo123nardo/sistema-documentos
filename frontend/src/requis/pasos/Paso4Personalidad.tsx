import { useState } from "react";
import { api } from "../../services/api";
import { ui } from "../../styles/ui";
interface Props {
  idRequisicion: number | null;
  onNext: () => void;
}

export default function Paso4Personalidad({ idRequisicion, onNext }: Props) {
  const [rasgos, setRasgos] = useState(["", "", "", ""]);

  function handleChange(index: number, value: string) {
    const copia = [...rasgos];
    copia[index] = value;
    setRasgos(copia);
  }

  async function guardarYContinuar() {
    if (!idRequisicion) return;

    const req = await api.get(`/requisiciones/${idRequisicion}`);
    const perfilId = req.data.perfil.id;

    for (const r of rasgos) {
      if (!r.trim()) continue;

      await api.post(`/perfil-vacante/${perfilId}/rasgos`, {
        descripcion: r.trim(),
      });
    }
    onNext();
  }

  return (
    <div className={`${ui.card.base} ${ui.card.padding}`}>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className={ui.text.title}>Características de personalidad</h1>
        <p className={ui.text.subtitle}>
          Defina los rasgos clave del candidato ideal
        </p>
      </div>

      {/* LISTA DE RASGOS */}
      <section className="mb-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {rasgos.map((rasgo, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50"
            >
              {/* NÚMERO */}
              <div className="w-8 text-sm font-bold text-gray-500">
                {index + 1}.
              </div>

              {/* INPUT */}
              <input
                type="text"
                placeholder={`Rasgo ${index + 1}`}
                className={ui.input.base}
                value={rasgo}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ACCIÓN */}
      <div className="flex justify-end">
        <button onClick={guardarYContinuar} className={ui.button.primary}>
          Siguiente →
        </button>
      </div>
    </div>
  );
}
