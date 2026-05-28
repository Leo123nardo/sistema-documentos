import robotImg from "../assets/Celda.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Imagen izquierda */}
      <div
        className="hidden bg-center bg-cover md:block"
        style={{ backgroundImage: `url(${robotImg})` }}
      />

      {/* Panel derecho */}
      <div className="flex items-center justify-center bg-gray-100">
        {children}
      </div>
    </div>
  );
}
