import { useNavigate } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import logo from "../assets/GECVAC.png";

export default function ResetPassword() {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="Automation & Engineering"
            className="h-14 mb-4"
          />
          <h1 className="text-lg font-semibold">Nueva contraseña</h1>
        </div>

        <input
          type="password"
          placeholder="Nueva contraseña"
          className="w-full bg-gray-200 border rounded px-3 py-2 mb-6"
        />

        <div className="flex gap-4">
          <button className="flex-1 bg-green-600 text-white py-2 rounded">
            Confirmar
          </button>

          <button
            className="flex-1 bg-red-600 text-white py-2 rounded"
            onClick={() => navigate("/")}
          >
            Regresar
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
