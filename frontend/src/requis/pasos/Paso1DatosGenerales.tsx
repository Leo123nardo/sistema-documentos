import { useState } from "react";
import type { AxiosError } from "axios";
import { api } from "../../services/api";
import { ui } from "../../styles/ui";
import { usePageTitle } from "../../../Hooks/usePageTitle";
interface Props {
  onNext: () => void;
  setIdRequisicion: (id: number) => void;
}
export default function Paso1DatosGenerales({
  onNext,
  setIdRequisicion,
}: Props) {
  const [guardadoHora] = useState(new Date().toLocaleTimeString());
  const [sexo, setSexo] = useState<"M" | "F" | "NA" | undefined>(undefined);

  const [form, setForm] = useState({
    jefeDirecto: "",
    puestoSolicitado: "",
    departamentoArea: "",
    personalCargo: "",
    proyectoPlanta: "",
    cantidadRequerida: 1,
    edadMin: "",
    edadMax: "",
    sexo: "",
    experiencia: "",
    sueldoMin: "",
    sueldoMax: "",
    nivelPuesto: "",
    generacionVacante: "",
  });
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardarYContinuar() {
    try {
      const res = await api.post("/requisiciones", {
        fechaSolicitud: new Date().toISOString(),
        departamentoId: 1,
        cantidadRequerida: Number(form.cantidadRequerida),
        nombreJefe: form.jefeDirecto,
        puestoSolicitado: form.puestoSolicitado,
        personalCargo:
          form.personalCargo !== "" ? Number(form.personalCargo) : null,
        proyectoPlanta: form.proyectoPlanta,
      });

      const requisicionId = res.data.id;
      const perfilId = res.data.perfil.id;

      await api.put(`/perfil-vacante/${perfilId}`, {
        edadMinima: form.edadMin !== "" ? Number(form.edadMin) : null,
        edadMaxima: form.edadMax !== "" ? Number(form.edadMax) : null,
        sexo: sexo ?? null,
        anosExperiencia:
          form.experiencia !== "" ? Number(form.experiencia) : null,
        sueldoMin:
          form.sueldoMin && Number(form.sueldoMin) > 0
            ? Number(form.sueldoMin)
            : null,
        sueldoMax:
          form.sueldoMax && Number(form.sueldoMax) > 0
            ? Number(form.sueldoMax)
            : null,
        nivelPuesto: form.nivelPuesto,
        generacionVacante: form.generacionVacante,
      });

      setIdRequisicion(requisicionId);
      onNext();
    } catch (error: unknown) {
      console.error(error);

      let mensaje = "Error al guardar la requisición.";

      if (
        (error as AxiosError<{ message?: string }>)?.response?.data?.message
      ) {
        mensaje = (error as AxiosError<{ message?: string }>).response!.data!
          .message!;
      }

      alert(mensaje);
    }
  }

  usePageTitle("Nueva Requisición");

  return (
    <div className={`${ui.card.base} ${ui.card.padding}`}>
      {/* HEADER */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className={ui.text.title}>Requisición de personal</h1>
          <p className={ui.text.subtitle}>
            Complete la información inicial del puesto
          </p>
        </div>

        <span className="text-xs text-gray-400">Guardado: {guardadoHora}</span>
      </div>

      {/* SECCIÓN 1 */}
      <h2 className="mb-4 text-lg font-semibold text-gray-700">
        Información del puesto
      </h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <input
          name="jefeDirecto"
          placeholder="Nombre y puesto del jefe directo"
          className={ui.input.base}
          onChange={handleChange}
        />

        <input
          name="puestoSolicitado"
          placeholder="Nombre del puesto solicitado"
          className={ui.input.base}
          onChange={handleChange}
        />
      </div>

      {/* SECCIÓN 2 */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <input
          name="departamentoArea"
          placeholder="Departamento / Área"
          className={ui.input.base}
          onChange={handleChange}
        />

        <input
          type="number"
          min={0}
          name="personalCargo"
          placeholder="Personal a cargo"
          className={ui.input.base}
          onChange={handleChange}
        />

        <input
          name="proyectoPlanta"
          placeholder="Proyecto / Planta"
          className={ui.input.base}
          onChange={handleChange}
        />

        <input
          type="number"
          min={1}
          name="cantidadRequerida"
          value={form.cantidadRequerida}
          className={ui.input.base}
          onChange={handleChange}
        />
      </div>

      {/* DATOS GENERALES */}
      <h3 className="mb-3 text-lg font-semibold text-gray-700">
        Datos Generales
      </h3>

      <div className="grid grid-cols-5 gap-4 mb-8">
        <input
          type="number"
          min={18}
          name="edadMin"
          placeholder="Edad Min"
          className={ui.input.base}
          onChange={handleChange}
        />

        <input
          type="number"
          min={18}
          name="edadMax"
          placeholder="Edad Max"
          className={ui.input.base}
          onChange={handleChange}
        />

        <select
          className={ui.input.base}
          value={sexo ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setSexo(value === "" ? undefined : (value as "M" | "F" | "NA"));
          }}
        >
          <option value="">Sexo</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="NA">N/A</option>
        </select>

        <input
          type="number"
          min={0}
          name="experiencia"
          placeholder="Años experiencia"
          className={`col-span-2 ${ui.input.base}`}
          onChange={handleChange}
        />
      </div>

      {/* SUELDO */}
      <h3 className="mb-3 text-lg font-semibold text-gray-700">
        Rango de sueldo
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <input
          type="number"
          min={0}
          name="sueldoMin"
          placeholder="Sueldo mínimo"
          className={ui.input.base}
          onChange={handleChange}
        />

        <input
          type="number"
          min={0}
          name="sueldoMax"
          placeholder="Sueldo máximo"
          className={ui.input.base}
          onChange={handleChange}
        />
      </div>

      {/* NIVEL */}
      <div className="grid grid-cols-2 gap-6 mb-10">
        <select
          name="nivelPuesto"
          className={ui.input.base}
          onChange={handleChange}
        >
          <option value="">Nivel del puesto</option>
          <option value="PROFESIONISTA">Profesionista</option>
          <option value="TECNICO">Técnico</option>
          <option value="BECARIO">Becario</option>
        </select>

        <select
          name="generacionVacante"
          className={ui.input.base}
          onChange={handleChange}
        >
          <option value="">Generación de vacante</option>
          <option value="PROYECTO">Inicio de proyecto</option>
          <option value="REEMPLAZO">Reemplazo</option>
          <option value="NUEVA">Nueva creación</option>
        </select>
      </div>

      {/* BOTÓN */}
      <div className="flex justify-end">
        <button onClick={guardarYContinuar} className={ui.button.primary}>
          Siguiente →
        </button>
      </div>
    </div>
  );
}
