import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../auth/Login";
import ResetPassword from "../auth/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../dashboard/Dashboard";
import DashboardLayout from "../layout/DashboardLayout";
import HistorialRequisicion from "../pages/Autorizaciones/Requisiciones/HistorialRequisicion";
import NuevaRequisicion from "../requis/NuevaRequisicion";
import AutorizacionesPage from "../pages/Autorizaciones/AutorizacionesPage";
import SeguimientoRequisicion from "../pages/Autorizaciones/Requisiciones/SeguimientoRequisicion";
import HistorialGlobal from "../pages/Autorizaciones/HistorialGlobal";
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/reset" element={<ResetPassword />} />

        {/* DASHBOARD (RUTAS PROTEGIDAS + LAYOUT) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Vista principal del dashboard */}
          <Route index element={<Dashboard />} />

          {/* AUTORIZACIONES */}
          <Route path="autorizaciones" element={<AutorizacionesPage />} />

          {/* NUEVA REQUISICIÓN (DENTRO DEL DASHBOARD) */}
          <Route path="requisiciones/nueva" element={<NuevaRequisicion />} />

          {/* SEGUIMIENTO DEL SOLICITANTE */}
          <Route
            path="requisiciones/:id/seguimiento"
            element={<SeguimientoRequisicion />}
          />

          {/* HISTORIAL DE REQUISICIONES */}
          <Route
            path="requisiciones/:id/historial"
            element={<HistorialRequisicion />}
          />

          {/* HISTORIAL GLOBAL */}
          <Route path="historial" element={<HistorialGlobal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
