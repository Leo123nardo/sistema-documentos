/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import type { TDocumentDefinitions } from 'pdfmake/interfaces';

/**
 * Helper para checkboxes
 */
const check = (value?: boolean) => (value ? '☑' : '☐');

/**
 * Helper para fechas seguras
 */
const fmtDate = (d?: Date | string) => {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  return isNaN(date.getTime()) ? '' : date.toLocaleDateString();
};

export function rh10Template(req: any): TDocumentDefinitions {
  return {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 40],

    content: [
      // ===== ENCABEZADO =====
      { text: 'Requisición de Personal F-RH-10', style: 'header' },

      {
        style: 'section',
        table: {
          widths: ['auto', '*', 'auto'],
          body: [
            [
              { text: 'Folio', bold: true },
              { text: req.folio ?? '' },
              {
                text: `Fecha: ${fmtDate(req.fechaSolicitud)}`,
              },
            ],
          ],
        },
        layout: 'lightHorizontalLines',
      },

      // ===== I. INFORMACIÓN =====
      { text: 'I. INFORMACIÓN DEL PUESTO SOLICITADO', style: 'sectionTitle' },

      tableRow('Nombre Jefe Directo', req.nombreJefe),
      tableRow('Puesto Solicitado', req.puestoSolicitado),
      tableRow('Departamento', req.departamento?.nombre),
      tableRow('Proyecto / Planta', req.proyectoPlanta),
      tableRow('Cantidad requerida', String(req.cantidadRequerida ?? '')),

      // ===== II. FUNCIONES =====
      { text: 'II. FUNCIONES PRINCIPALES', style: 'sectionTitle' },

      {
        ul: Array.isArray(req.funcionesPrincipales)
          ? req.funcionesPrincipales.map(
              (f: any, i: number) => `${i + 1}. ${f.descripcion}`,
            )
          : [],
      },

      // ===== III. NECESIDADES =====
      { text: 'III. NECESIDADES ADICIONALES', style: 'sectionTitle' },

      {
        text:
          `${check(req.perfil?.tecnico)} Técnico   ` +
          `${check(req.perfil?.profesional)} Profesional   ` +
          `${check(req.perfil?.becario)} Becario`,
      },

      // ===== V. PLAN DE VIDA =====
      { text: 'V. PLAN DE VIDA Y DESARROLLO', style: 'sectionTitle' },

      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              { text: 'Mediano plazo', bold: true },
              { text: 'Largo plazo', bold: true },
            ],
            [req.planMediano || '', req.planLargo || ''],
          ],
        },
        layout: 'lightHorizontalLines',
      },

      // ===== VI. FIRMAS =====
      { text: 'VI. FIRMAS', style: 'sectionTitle' },

      {
        table: {
          widths: ['*', '*', '*'],
          body: [
            [
              { text: 'Solicitante', bold: true },
              { text: 'Gerencia', bold: true },
              { text: 'RH', bold: true },
            ],
            [
              firma(req, 'SOLICITANTE'),
              firma(req, 'GERENCIA'),
              firma(req, 'RH'),
            ],
          ],
        },
        layout: 'lightHorizontalLines',
      },
    ],

    styles: {
      header: {
        fontSize: 16,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10],
      },
      section: {
        margin: [0, 0, 0, 10],
      },
      sectionTitle: {
        margin: [0, 12, 0, 6],
        bold: true,
        fontSize: 11,
      },
    },
    defaultStyle: {
      fontSize: 9,
    },
  };
}

/**
 * Helper para filas tipo etiqueta/valor
 */
function tableRow(label: string, value?: string) {
  return {
    table: {
      widths: ['*', '*'],
      body: [[{ text: label, bold: true }, value || '']],
    },
    layout: 'lightHorizontalLines',
  };
}

/**
 * Helper para firmas
 */
function firma(req: any, rol: string) {
  if (rol === 'SOLICITANTE' && req.firmadoPor) {
    return `${req.firmadoPor.nombre}\n${fmtDate(req.firmadoEn)}`;
  }

  const aprobacion = req.flujo?.aprobaciones?.find(
    (a: any) => a.rol === rol && a.estado === 'APROBADO',
  );

  return aprobacion
    ? `${aprobacion.aprobador?.nombre ?? ''}\n${fmtDate(aprobacion.firmadoEn)}`
    : '';
}
