export const ui = {
  layout: {
    container: "p-8",
    section: "mb-8",
  },

  text: {
    title: "text-3xl font-bold text-gray-800",
    subtitle: "text-sm text-gray-500",
    label: "text-sm text-gray-600",
  },

  card: {
    base: "bg-white border rounded-xl shadow-sm hover:shadow-md transition",
    padding: "p-5",
  },

  grid: {
    responsive: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  },

  badge: {
    base: "px-3 py-1 text-xs font-semibold rounded-full inline-block",
    aprobado: "bg-green-100 text-green-700",
    pendiente: "bg-yellow-100 text-yellow-700",
    rechazado: "bg-red-100 text-red-700",
  },

  button: {
    primary:
      "px-6 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition",
    link: "text-blue-600 text-sm font-medium hover:underline",
  },

  input: {
    base: "w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-green-500",
  },
};
