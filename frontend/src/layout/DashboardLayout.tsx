import { useState } from "react";
import { Folder, CheckSquare, History } from "lucide-react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function DashboardLayout() {
  const { usuario, logout } = useAuth();
  const [formatosOpen, setFormatosOpen] = useState(false);
  const [rhOpen, setRhOpen] = useState(false);
  const [userCardOpen, setUserCardOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 text-white bg-green-600 shadow h-14">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-xl">
          ☰
        </button>

        <div className="relative">
          <button
            onClick={() => setUserCardOpen(!userCardOpen)}
            className="flex items-center justify-center font-bold text-green-700 bg-white rounded-full w-9 h-9"
          >
            {usuario?.nombre?.charAt(0) ?? "U"}
          </button>
          {userCardOpen && (
            <div className="absolute right-0 z-50 p-4 mt-2 bg-white border shadow w-72 rounded-xl">
              {/* NOMBRE */}
              <div className="text-lg font-semibold text-gray-800">
                {usuario?.nombre}
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="w-full py-1 mt-4 text-white bg-red-600 rounded hover:bg-red-700"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        {/* SIDEBAR */}
        {menuOpen && (
          <aside className="p-6 text-green-700 bg-white border-r w-80">
            {/* LOGO CLICKABLE */}
            <h2
              onClick={() => navigate("/dashboard")}
              className="mb-8 text-2xl font-bold text-center cursor-pointer hover:text-green-800"
            >
              GEC‑VAC
            </h2>

            <ul className="space-y-4 text-base font-medium">
              {/* REQUISICIONES */}
              <li>
                <button
                  className="flex items-center w-full gap-3 p-2 rounded hover:bg-green-100"
                  onClick={() => setFormatosOpen(!formatosOpen)}
                >
                  <Folder size={22} />
                  Requisiciones
                </button>

                {formatosOpen && (
                  <div className="mt-2 ml-6 space-y-2">
                    <button
                      className="block hover:text-green-800"
                      onClick={() => setRhOpen(!rhOpen)}
                    >
                      Recursos Humanos
                    </button>

                    {rhOpen && (
                      <div className="p-2 ml-4 rounded bg-green-50">
                        <button
                          className="block w-full p-2 text-left rounded hover:bg-green-100"
                          onClick={() =>
                            navigate("/dashboard/requisiciones/nueva")
                          }
                        >
                          F‑RH‑10 Requisición de Personal
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>

              {/* AUTORIZACIONES */}
              <li
                onClick={() => navigate("/dashboard/autorizaciones")}
                className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-green-100"
              >
                <CheckSquare size={22} />
                Autorizaciones
              </li>

              {/* HISTORIAL */}
              <li
                onClick={() => navigate("/dashboard/historial")}
                className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-green-100"
              >
                <History size={22} />
                Historial
              </li>
            </ul>
          </aside>
        )}

        {/* MAIN */}
        <main className="flex-1 p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
