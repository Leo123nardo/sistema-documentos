import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { ui } from "../../styles/ui";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { usePageTitle } from "../../../Hooks/usePageTitle";
interface Item {
  folio: string;
  paso: string;
  estado: string;
  usuario: string;
  fecha?: string;
}

interface RequisicionAgrupada {
  folio: string;
  pasos: Item[];
}

export default function HistorialGlobal() {
  const [data, setData] = useState<Item[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");

  const [pagina, setPagina] = useState(1);
  const porPagina = 6;
  usePageTitle("Historial");

  useEffect(() => {
    api
      .get("/requisiciones/historial-global")
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setPagina(1);
  }, [busqueda, filtroEstado]);
  const agrupado = Object.values(
    data.reduce<Record<string, RequisicionAgrupada>>((acc, item) => {
      if (!acc[item.folio]) {
        acc[item.folio] = {
          folio: item.folio,
          pasos: [],
        };
      }
      acc[item.folio].pasos.push(item);
      return acc;
    }, {}),
  );

  const aprobados = agrupado.filter((req) =>
    req.pasos.every((p) => p.estado === "APROBADO"),
  ).length;

  const rechazados = agrupado.filter((req) =>
    req.pasos.some((p) => p.estado === "RECHAZADO"),
  ).length;

  const pendientes = agrupado.filter((req) =>
    req.pasos.some((p) => p.estado === "PENDIENTE"),
  ).length;

  const dataChart = [
    { name: "Aprobado", value: aprobados },
    { name: "Rechazado", value: rechazados },
    { name: "Pendiente", value: pendientes },
  ];

  const dataFiltrada = agrupado.filter((req) => {
    const coincideBusqueda = req.folio
      ?.toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === "TODOS" ||
      req.pasos.some((p) => p.estado === filtroEstado);

    return coincideBusqueda && coincideEstado;
  });

  const totalPaginas = Math.ceil(dataFiltrada.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const fin = inicio + porPagina;
  const dataPaginada = dataFiltrada.slice(inicio, fin);

  return (
    <div className={ui.layout.container}>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className={ui.text.title}>Historial general de requisiciones</h1>
        <p className={ui.text.subtitle}>
          Vista global del flujo de autorizaciones
        </p>
      </div>

      {/* TARJETAS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 text-white bg-green-500 rounded-xl">
           Aprobadas
          <div className="text-2xl font-bold">{aprobados}</div>
        </div>

        <div className="p-4 text-white bg-red-500 rounded-xl">
           Rechazadas
          <div className="text-2xl font-bold">{rechazados}</div>
        </div>

        <div className="p-4 text-white bg-yellow-500 rounded-xl">
           Pendientes
          <div className="text-2xl font-bold">{pendientes}</div>
        </div>
      </div>

      {/* GRÁFICA */}
      <div className="flex justify-center mb-6">
        <PieChart width={300} height={300}>
          <Pie data={dataChart} dataKey="value" outerRadius={100}>
            <Cell fill="#22c55e" />
            <Cell fill="#ef4444" />
            <Cell fill="#eab308" />
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar requisición (folio)..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className={`${ui.input.base} mb-4`}
      />

      {/* FILTROS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["TODOS", "APROBADO", "RECHAZADO", "PENDIENTE"].map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              filtroEstado === estado
                ? "bg-green-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {estado}
          </button>
        ))}
      </div>

      {/*  GRID */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {dataPaginada.map((req, i) => (
          <div key={i} className="p-4 bg-white border shadow-sm rounded-xl">
            {/* FOLIO */}
            <div className="mb-3 text-lg font-bold text-gray-800">
              {req.folio}
            </div>

            {/* FLOW */}
            <div className="flex flex-wrap items-center gap-2">
              {req.pasos.map((p, index) => {
                const color =
                  p.estado === "APROBADO"
                    ? "bg-green-500"
                    : p.estado === "RECHAZADO"
                      ? "bg-red-500"
                      : "bg-yellow-500";

                return (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full ${color}`}
                      title={`${p.paso} - ${p.estado}`}
                    />

                    <span className="text-xs text-gray-600">{p.paso}</span>

                    {index < req.pasos.length - 1 && (
                      <span className="text-gray-400">→</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* FECHA */}
            <div className="mt-4 text-xs text-gray-500">
              {(() => {
                const ultimaFecha = req.pasos[req.pasos.length - 1]?.fecha;

                if (!ultimaFecha) {
                  return "Último movimiento: Sin fecha";
                }

                return `Último movimiento: ${new Date(ultimaFecha).toLocaleString()}`;
              })()}
            </div>
          </div>
        ))}
      </div>

      {/*  PAGINADOR */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            onClick={() => setPagina(i + 1)}
            className={`px-3 py-1 rounded ${
              pagina === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* INFO */}
      <p className="mt-4 text-sm text-center text-gray-500">
        Mostrando {dataPaginada.length} de {dataFiltrada.length} requisiciones
      </p>
    </div>
  );
}
