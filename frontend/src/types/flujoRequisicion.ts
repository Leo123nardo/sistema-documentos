export type PasoFlujo = {
  id: number;
  orden: number;
  titulo: string;
  obligatorio: boolean;
  aprobado: boolean;
  aprobadoPor: {
    id: number;
    nombre: string;
    email: string;
  } | null;
  aprobadoEn: string | null;
  comentario: string | null;
};

export type FlujoRequisicion = {
  requisicionId: number;
  estado: string;
  pasos: PasoFlujo[];
  siguientePaso?: {
    id: number;
    orden: number;
    titulo: string;
  };
};

export interface FlujoAutorizaciones {
  requisicionId: number;
  flujoId: number;
  pasoActivoOrden: number | null;
  pasos: PasoAutorizacion[];
}

export interface PasoAutorizacion {
  orden: number;
  titulo: string;
  rol: string;
  estado: "PENDIENTE" | "APROBADA" | "RECHAZADA";
  puedeFirmar: boolean;
  firmadoEn?: string | null;
  comentario?: string | null;
}
