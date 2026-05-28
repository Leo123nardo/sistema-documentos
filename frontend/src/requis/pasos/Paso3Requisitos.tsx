import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { ui } from "../../styles/ui";
interface Props {
  idRequisicion: number | null;
  onNext: () => void;
}

export default function Paso3Requisitos({ idRequisicion, onNext }: Props) {
  const [formacion, setFormacion] = useState<string[]>([]);
  const [catalogoFormacion, setCatalogoFormacion] = useState<
    { id: number; nombre: string }[]
  >([]);
  const [catalogoIdiomas, setCatalogoIdiomas] = useState<
    { id: number; nombre: string }[]
  >([]);
  const [catalogoHabilidades, setCatalogoHabilidades] = useState<
    { id: number; nombre: string }[]
  >([]);
  const [catalogoEquipos, setCatalogoEquipos] = useState<
    { id: number; nombre: string }[]
  >([]);
  const [idiomas, setIdiomas] = useState({
    ingles: false,
    japones: false,
    aleman: false,
    italiano: false,
    pctEscrito: "",
    pctHablado: "",
    pctLeido: "",
  });
  const [disponibilidad, setDisponibilidad] = useState({
    viajar: false,
    automovil: false,
    cambioResidencia: false,
  });
  const [habilidadesInfo, setHabilidadesInfo] = useState<string[]>([]);
  const [habilidadOtro, setHabilidadOtro] = useState("");
  const [equipoUtilizar, setEquipoUtilizar] = useState<string[]>([]);
  //const [equipoOtro, setEquipoOtro] = useState("");
  const [conocimientos, setConocimientos] = useState([
    { descripcion: "", tiempo: "" },
  ]);

  useEffect(() => {
    api.get("/formacion-academica").then((res) => {
      setCatalogoFormacion(res.data);
    });
  }, []);

  useEffect(() => {
    api.get("/formacion-academica").then((res) => {
      setCatalogoFormacion(res.data);
    });

    api.get("/idiomas").then((res) => {
      setCatalogoIdiomas(res.data);
    });

    api.get("/habilidades-informaticas").then((res) => {
      setCatalogoHabilidades(res.data);

      api
        .get("/equipos-maquinaria")
        .then((res) => setCatalogoEquipos(res.data));
    });
  }, []);

  function toggleArray(
    value: string,
    array: string[],
    setter: (val: string[]) => void,
  ) {
    if (array.includes(value)) {
      setter(array.filter((v) => v !== value));
    } else {
      setter([...array, value]);
    }
  }

  function actualizarConocimiento(
    index: number,
    campo: "descripcion" | "tiempo",
    valor: string,
  ) {
    const copia = [...conocimientos];
    copia[index][campo] = valor;
    setConocimientos(copia);
  }

  function agregarConocimiento() {
    setConocimientos([...conocimientos, { descripcion: "", tiempo: "" }]);
  }

  async function guardarYContinuar() {
    if (!idRequisicion) return;

    const req = await api.get(`/requisiciones/${idRequisicion}`);

    const perfilId = req.data.perfil.id;

    await api.put(`/perfil-vacante/${perfilId}`, {
      viaje: disponibilidad.viajar,
      auto: disponibilidad.automovil,
      cambioResidencia: disponibilidad.cambioResidencia,
    });

    for (const f of formacion) {
      const formacionObj = catalogoFormacion.find((c) => c.nombre === f);

      if (!formacionObj) continue;

      await api.post(`/perfil-vacante/${perfilId}/formacion`, {
        formacionId: formacionObj.id,
      });
    }

    const idiomasSeleccionados = [
      { activo: idiomas.ingles, nombre: "Inglés" },
      { activo: idiomas.japones, nombre: "Japonés" },
      { activo: idiomas.aleman, nombre: "Alemán" },
      { activo: idiomas.italiano, nombre: "Italiano" },
    ];

    for (const i of idiomasSeleccionados) {
      if (!i.activo) continue;

      const idiomaObj = catalogoIdiomas.find((c) => c.nombre === i.nombre);

      if (!idiomaObj) continue;

      await api.post(`/perfil-vacante/${perfilId}/idiomas`, {
        idiomaId: idiomaObj.id,
        pctEscrito: Number(idiomas.pctEscrito),
        pctHablado: Number(idiomas.pctHablado),
        pctLeido: Number(idiomas.pctLeido),
      });
    }

    for (const h of habilidadesInfo) {
      const nombreHabilidad = h === "Otro" ? habilidadOtro : h;

      const habilidadObj = catalogoHabilidades.find(
        (c) => c.nombre === nombreHabilidad,
      );

      if (!habilidadObj) continue;

      await api.post(`/perfil-vacante/${perfilId}/habilidades`, {
        habilidadId: habilidadObj.id,
      });
    }

    for (const e of equipoUtilizar) {
      const equipoObj = catalogoEquipos.find((c) => c.nombre === e);

      if (!equipoObj) {
        console.warn("Equipo no encontrado en catálogo:", e);
        continue;
      }

      await api.post(`/perfil-vacante/${perfilId}/equipos`, {
        equipoId: equipoObj.id,
      });
    }

    for (const c of conocimientos) {
      if (!c.descripcion.trim()) continue;
      if (!c.tiempo || isNaN(Number(c.tiempo))) continue;

      await api.post(`/perfil-vacante/${perfilId}/conocimientos`, {
        descripcion: c.descripcion.trim(),
        tiempoMeses: Number(c.tiempo),
      });
    }
    onNext();
  }

  return (
    <div className={`${ui.card.base} ${ui.card.padding}`}>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className={ui.text.title}>Requisitos del puesto</h1>
        <p className={ui.text.subtitle}>
          Defina necesidades adicionales y perfil requerido
        </p>
      </div>

      {/* ───────── FORMACIÓN ───────── */}
      <section className="mb-8">
        <h3 className="mb-3 text-lg font-semibold text-gray-700">
          Formación académica
        </h3>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {[
            "Secundaria",
            "Técnico / Preparatoria",
            "Profesional",
            "Especialización",
            "Maestría",
            "Estudiante universitario",
          ].map((f) => (
            <label
              key={f}
              className="flex items-center gap-2 p-2 rounded bg-gray-50"
            >
              <input
                type="checkbox"
                checked={formacion.includes(f)}
                onChange={() => toggleArray(f, formacion, setFormacion)}
              />
              {f}
            </label>
          ))}
        </div>
      </section>

      {/* ───────── IDIOMAS ───────── */}
      <section className="mb-8">
        <h3 className="mb-3 text-lg font-semibold text-gray-700">Idiomas</h3>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {[
              { key: "ingles", label: "Inglés" },
              { key: "japones", label: "Japonés" },
              { key: "aleman", label: "Alemán" },
              { key: "italiano", label: "Italiano" },
            ].map((i) => (
              <label key={i.key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={idiomas[i.key as keyof typeof idiomas] as boolean}
                  onChange={() =>
                    setIdiomas({
                      ...idiomas,
                      [i.key]: !idiomas[i.key as keyof typeof idiomas],
                    })
                  }
                />
                {i.label}
              </label>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input
              placeholder="% Escrito"
              className={ui.input.base}
              value={idiomas.pctEscrito}
              onChange={(e) =>
                setIdiomas({
                  ...idiomas,
                  pctEscrito: e.target.value,
                })
              }
            />
            <input
              placeholder="% Hablado"
              className={ui.input.base}
              value={idiomas.pctHablado}
              onChange={(e) =>
                setIdiomas({
                  ...idiomas,
                  pctHablado: e.target.value,
                })
              }
            />
            <input
              placeholder="% Leído"
              className={ui.input.base}
              value={idiomas.pctLeido}
              onChange={(e) =>
                setIdiomas({
                  ...idiomas,
                  pctLeido: e.target.value,
                })
              }
            />
          </div>
        </div>
      </section>

      {/* ───────── DISPONIBILIDAD ───────── */}
      <section className="mb-8">
        <h3 className="mb-3 text-lg font-semibold text-gray-700">
          Disponibilidad
        </h3>

        <div className="flex flex-wrap gap-6">
          {[
            { key: "viajar", label: "Viajar" },
            { key: "automovil", label: "Automóvil" },
            { key: "cambioResidencia", label: "Cambio de residencia" },
          ].map((d) => (
            <label key={d.key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={disponibilidad[d.key as keyof typeof disponibilidad]}
                onChange={() =>
                  setDisponibilidad({
                    ...disponibilidad,
                    [d.key]:
                      !disponibilidad[d.key as keyof typeof disponibilidad],
                  })
                }
              />
              {d.label}
            </label>
          ))}
        </div>
      </section>

      {/* ───────── HABILIDADES ───────── */}
      <section className="mb-8">
        <h3 className="mb-3 text-lg font-semibold text-gray-700">
          Habilidades informáticas
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {[
            "Manejo Windows / Office",
            "Correo electrónico / Base de datos",
          ].map((h) => (
            <label key={h} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={habilidadesInfo.includes(h)}
                onChange={() =>
                  toggleArray(h, habilidadesInfo, setHabilidadesInfo)
                }
              />
              {h}
            </label>
          ))}

          <div className="flex items-center col-span-2 gap-2">
            <input
              type="checkbox"
              checked={habilidadesInfo.includes("Otro")}
              onChange={() =>
                toggleArray("Otro", habilidadesInfo, setHabilidadesInfo)
              }
            />
            <span>Otro:</span>
            <input
              className={ui.input.base}
              placeholder="Especifique"
              value={habilidadOtro}
              onChange={(e) => setHabilidadOtro(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ───────── EQUIPO ───────── */}
      <section className="mb-8">
        <h3 className="mb-3 text-lg font-semibold text-gray-700">
          Equipo / maquinaria
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {["Robótica", "PLC", "HMI", "Sistemas eléctricos"].map((e) => (
            <label key={e} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={equipoUtilizar.includes(e)}
                onChange={() =>
                  toggleArray(e, equipoUtilizar, setEquipoUtilizar)
                }
              />
              {e}
            </label>
          ))}
        </div>
      </section>

      {/* ───────── CONOCIMIENTOS ───────── */}
      <section className="mb-8">
        <h3 className="mb-3 text-lg font-semibold text-gray-700">
          Conocimientos requeridos
        </h3>

        {conocimientos.map((c, i) => (
          <div key={i} className="grid grid-cols-2 gap-4 mb-3">
            <input
              placeholder="Descripción"
              className={ui.input.base}
              value={c.descripcion}
              onChange={(e) =>
                actualizarConocimiento(i, "descripcion", e.target.value)
              }
            />
            <input
              placeholder="Meses experiencia"
              className={ui.input.base}
              value={c.tiempo}
              onChange={(e) =>
                actualizarConocimiento(i, "tiempo", e.target.value)
              }
            />
          </div>
        ))}

        <button
          onClick={agregarConocimiento}
          className="px-4 py-2 mt-3 text-white bg-orange-500 rounded hover:bg-orange-600"
        >
          + Agregar conocimiento
        </button>
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
