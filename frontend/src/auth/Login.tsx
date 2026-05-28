import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import { useAuth } from "./useAuth";
import logo from "../assets/GECVAC.png";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email.trim(), password.trim());
      navigate("/dashboard");
    } catch {
      setError("Usuario o contraseña incorrectos");
    }
  }
  return (
    <AuthLayout>
      <div className="w-full max-w-lg p-10 bg-white shadow-lg rounded-xl">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="Automation & Engineering"
            className="mb-4 h-14"
          />
          <h1 className="text-lg font-semibold text-gray-700">
            Inicio de sesión
          </h1>
        </div>

        {error && (
          <p className="mb-4 text-sm text-center text-red-600">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-600">Usuario</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" />
            <span>Recordar contraseña</span>
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white transition bg-green-600 rounded hover:bg-green-700"
          >
            Ingresar
          </button>

          <div className="text-sm text-center">
            <Link to="/reset" className="text-blue-600 hover:underline">
              ¿Olvidó su contraseña?
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
