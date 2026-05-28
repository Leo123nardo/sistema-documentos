/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PDFDocument, rgb } from 'pdf-lib';
import { readFileSync } from 'fs';
import { join } from 'path';
import fontkit from '@pdf-lib/fontkit';

@Injectable()
export class PdfService {
  constructor(private readonly prisma: PrismaService) {}

  async generarRequisicionPDF(requisicionId: number): Promise<Buffer> {
    const requisicion = await this.prisma.requisicion.findUnique({
      where: { id: requisicionId },
      include: {
        departamento: true,
        firmadoPor: true,

        perfil: {
          include: {
            // Punto II
            planCarrera: {
              include: {
                puesto: true,
              },
            },

            // Punto III
            idiomas: {
              include: {
                idioma: true,
              },
            },
            formaciones: {
              include: {
                formacion: true,
              },
            },
            habilidades: {
              include: {
                habilidad: true,
              },
            },
            equipos: {
              include: {
                equipo: true,
              },
            },
            conocimientos: {
              include: {
                conocimiento: true,
              },
            },

            // Punto IV
            rasgos: {
              include: {
                rasgo: true,
              },
            },
          },
        },

        funcionPrincipals: true,

        flujo: {
          include: {
            aprobaciones: {
              include: {
                aprobador: true,
                paso: true,
              },
            },
          },
        },
      },
    });

    const mapGradoEstudio = (grado?: string | null): string => {
      switch (grado) {
        case 'SECUNDARIA':
          return 'Secundaria';
        case 'TECNICO_PREPARATORIA':
          return 'Técnico / Preparatoria';
        case 'PROFESIONISTA':
          return 'Profesional';
        case 'ESPECIALIZACION':
          return 'Especialización';
        case 'MAESTRIA':
          return 'Maestría';
        case 'ESTUDIANTE_UNIVERSITARIO':
          return 'Estudiante Universitario';
        default:
          return 'No especificado';
      }
    };

    const FORMACION_ORDEN = [
      { id: 1, label: 'Secundaria', nivel: 1 },
      { id: 2, label: 'Técnico / Preparatoria', nivel: 2 },
      { id: 3, label: 'Profesional', nivel: 3 },
      { id: 4, label: 'Especialización', nivel: 4 },
      { id: 5, label: 'Maestría', nivel: 5 },
      { id: 6, label: 'Estudiante Universitario', nivel: 2 },
    ];

    if (!requisicion) {
      throw new NotFoundException('Requisición no encontrada');
    }

    const perfil = requisicion.perfil;
    // =========================
    // PDF + FUENTE
    // =========================
    const pdf = await PDFDocument.create();
    let page = pdf.addPage([595, 842]);
    pdf.registerFontkit(fontkit);

    const fontBytes = readFileSync(
      join(process.cwd(), 'assets/fonts/NotoSans-VariableFont_wdth,wght.ttf'),
    );
    const font = await pdf.embedFont(fontBytes);
    const bold = font;

    let y = page.getHeight() - 40;

    // 🔥 helper caja (FIX DEFINITIVO)
    const drawBox = (
      x: number,
      y: number,
      w: number,
      h: number,
      label: string,
      value?: string,
    ) => {
      // borde correcto (CLAVE)
      page.drawRectangle({
        x,
        y: y - h,
        width: w,
        height: h,
        borderWidth: 1,
        borderColor: rgb(0, 0, 0),
      });

      // label
      page.drawText(label, {
        x: x + 6,
        y: y - 12,
        size: 7,
        font: bold,
      });

      if (value !== undefined) {
        page.drawLine({
          start: { x: x + 4, y: y - 16 },
          end: { x: x + w - 4, y: y - 16 },
          thickness: 0.5,
        });

        page.drawText(value || '—', {
          x: x + 6,
          y: y - 28,
          size: 9,
          font,
        });
      }
    };

    // =========================//EZADO
    // =========================

    const headerTopY = y;

    const logoBytes = readFileSync(
      join(process.cwd(), 'assets/images/GECVAC.png'),
    );
    const logo = await pdf.embedPng(logoBytes);

    page.drawImage(logo, {
      x: 50,
      y: headerTopY - 50,
      width: 50,
      height: 40,
    });

    page.drawText('Requisición de Personal', {
      x: 595 / 2 - 130,
      y: headerTopY - 28,
      size: 15,
      font: bold,
    });

    // 🔥 TABLA DERECHA
    const boxWidth = 110;
    const boxX = 595 - boxWidth - 40;
    const rowHeight = 28;

    const drawHeaderTableRow = (x, y, width, height, label, value) => {
      page.drawRectangle({
        x,
        y: y - height,
        width,
        height,
        borderWidth: 1,
        borderColor: rgb(0, 0, 0),
      });

      page.drawText(label, { x: x + 5, y: y - 11, size: 7, font: bold });

      page.drawLine({
        start: { x: x + 4, y: y - 15 },
        end: { x: x + width - 4, y: y - 15 },
        thickness: 0.5,
      });

      page.drawText(value, { x: x + 5, y: y - 25, size: 9, font });
    };

    let tableY = headerTopY - 12;

    drawHeaderTableRow(
      boxX,
      tableY,
      boxWidth,
      rowHeight,
      'Folio',
      requisicion.folio,
    );

    tableY -= rowHeight;

    const f = requisicion.fechaSolicitud;

    drawHeaderTableRow(
      boxX,
      tableY,
      boxWidth,
      rowHeight,
      'Fecha',
      `${f.getDate()} / ${f.getMonth() + 1} / ${f.getFullYear()}`,
    );

    y = headerTopY - 85;

    // =========================
    // I. INFORMACIÓN DEL PUESTO
    // =========================

    const startX = 50;
    const totalW = 495;

    page.drawRectangle({
      x: startX,
      y: y - 18,
      width: totalW,
      height: 18,
      color: rgb(0, 0, 0),
    });

    page.drawText('I. INFORMACIÓN DEL PUESTO', {
      x: startX + 10,
      y: y - 14,
      size: 10,
      font: bold,
      color: rgb(1, 1, 1),
    });

    y -= 30;

    const h = 48;

    drawBox(
      startX,
      y,
      totalW / 2,
      h,
      'Jefe directo',
      requisicion.nombreJefe ?? '',
    );
    drawBox(
      startX + totalW / 2,
      y,
      totalW / 2,
      h,
      'Puesto',
      requisicion.puestoSolicitado ?? '',
    );

    y -= h + 4;

    const col4 = totalW / 4;

    drawBox(
      startX,
      y,
      col4,
      h,
      'Departamento',
      requisicion.departamento?.nombre ?? '',
    );
    drawBox(
      startX + col4,
      y,
      col4,
      h,
      'Personal',
      String(requisicion.personalCargo ?? ''),
    );
    drawBox(
      startX + col4 * 2,
      y,
      col4,
      h,
      'Proyecto',
      requisicion.proyectoPlanta ?? '',
    );
    drawBox(startX + col4 * 3, y, col4, h, 'Cantidad', '1');

    y -= h + 10;

    // =========================
    // DATOS GENERALES
    // =========================

    const blockHx = 60;
    const blockGap = 15;

    // 🔹 Datos Generales (4 columnas)
    const colDG = totalW / 4;

    drawBox(
      startX,
      y,
      colDG,
      blockHx,
      'Edad Min',
      String(perfil?.edadMinima ?? ''),
    );
    drawBox(
      startX + colDG,
      y,
      colDG,
      blockHx,
      'Edad Max',
      String(perfil?.edadMaxima ?? ''),
    );
    drawBox(startX + colDG * 2, y, colDG, blockHx, 'Sexo', perfil?.sexo ?? '');
    drawBox(
      startX + colDG * 3,
      y,
      colDG,
      blockHx,
      'Experiencia',
      `${perfil?.anosExperiencia ?? ''} años`,
    );

    y -= blockHx + blockGap;

    // =========================
    // SUELDO
    // =========================

    const colSal = totalW / 2;

    drawBox(
      startX,
      y,
      colSal,
      blockHx,
      'Sueldo mínimo',
      String(perfil?.sueldoMin ?? ''),
    );
    drawBox(
      startX + colSal,
      y,
      colSal,
      blockHx,
      'Sueldo máximo',
      String(perfil?.sueldoMax ?? ''),
    );

    y -= blockHx + blockGap;

    // =========================
    // NIVEL Y VACANTE
    // =========================

    drawBox(
      startX,
      y,
      colSal,
      blockHx,
      'Nivel puesto',
      perfil?.nivelPuesto ?? '',
    );
    drawBox(
      startX + colSal,
      y,
      colSal,
      blockHx,
      'Generación vacante',
      perfil?.generacionVacante ?? '',
    );

    y -= blockHx + 25;

    // =========================
    // II. FUNCIONES
    // =========================

    page.drawRectangle({
      x: 50,
      y: y - 18,
      width: 495,
      height: 18,
      color: rgb(0, 0, 0),
    });

    page.drawText('II. FUNCIONES PRINCIPALES', {
      x: 55,
      y: y - 14,
      size: 9,
      font: bold,
      color: rgb(1, 1, 1),
    });

    y -= 30;

    // CONFIG
    const leftX = 50;
    const rightX = 305;
    const colWidth2 = 220;

    // datos
    const funciones = (requisicion.funcionPrincipals ?? []).sort(
      (a, b) => a.orden - b.orden,
    );

    // dividir columnas
    const mitad = Math.ceil(funciones.length / 2);

    // helper
    const draw = (x: number, y: number, num: number, txt?: string) => {
      page.drawText(`${num}.-`, { x, y, size: 9, font });

      if (txt) {
        page.drawText(txt, {
          x: x + 18,
          y,
          size: 9,
          font,
          maxWidth: colWidth2 - 20,
        });
      }

      page.drawLine({
        start: { x, y: y - 4 },
        end: { x: x + colWidth2, y: y - 4 },
        thickness: 0.7,
      });
    };

    let yLeftFunc = y;
    let yRightFunc = y;
    const rowHeightFunc = 22;

    let counter = 1;

    for (let i = 0; i < mitad; i++) {
      const fLeft = funciones[i];
      const fRight = funciones[i + mitad];

      // izquierda
      draw(leftX, yLeftFunc, counter++, fLeft?.descripcion ?? '');

      // derecha SOLO si existe
      if (fRight) {
        draw(rightX, yRightFunc, counter++, fRight.descripcion);
      }

      yLeftFunc -= rowHeightFunc;
      yRightFunc -= rowHeightFunc;
    }

    y = Math.min(yLeftFunc, yRightFunc) - 5;

    const getGradoEstudioFinal = (): string => {
      // 1️⃣ si viene directo del perfil
      if (perfil?.gradoEstudio) {
        return mapGradoEstudio(perfil.gradoEstudio);
      }

      // 2️⃣ inferir desde formaciones
      if (perfil?.formaciones?.length) {
        const mejor = perfil.formaciones
          .map((f) => {
            const def = FORMACION_ORDEN.find((o) => o.id === f.formacionId);
            return def ? def.nivel : 0;
          })
          .reduce((a, b) => Math.max(a, b), 0);

        const match = FORMACION_ORDEN.find((o) => o.nivel === mejor);
        if (match) return match.label;
      }
      return 'No especificado';
    };

    // =========================
    // III. NECESIDADES ADICIONALES
    // =========================

    // 🔴 encabezado negro
    page.drawRectangle({
      x: 50,
      y: y - 18,
      width: 495,
      height: 18,
      color: rgb(0, 0, 0),
    });

    page.drawText('III. NECESIDADES ADICIONALES ESPECÍFICAS DEL PUESTO', {
      x: 55,
      y: y - 14,
      size: 9,
      font: bold,
      color: rgb(1, 1, 1),
    });

    y -= 30;

    // 🔹 helper checkbox (FIX con borde)
    const drawCheck = (
      x: number,
      y: number,
      label: string,
      checked?: boolean,
    ) => {
      page.drawRectangle({
        x,
        y: y - 10,
        width: 10,
        height: 10,
        borderWidth: 1,
        borderColor: rgb(0, 0, 0),
      });

      if (checked) {
        page.drawText('X', {
          x: x + 2,
          y: y - 9,
          size: 8,
          font: bold,
        });
      }

      page.drawText(label, {
        x: x + 15,
        y: y - 8,
        size: 9,
        font,
      });
    };

    const colHalf = totalW / 2;
    const blockH = 85;

    // =========================
    // BLOQUE IZQUIERDO (FORMACIÓN)
    // =========================

    page.drawRectangle({
      x: startX,
      y: y - blockH,
      width: colHalf,
      height: blockH,
      borderWidth: 1,
      borderColor: rgb(0, 0, 0),
    });

    page.drawText('FORMACIÓN ACADÉMICA', {
      x: startX + 10,
      y: y - 12,
      size: 9,
      font: bold,
    });

    // valor seleccionado
    const grado = getGradoEstudioFinal();

    let fy = y - 18;

    [
      'Secundaria',
      'Técnico / Preparatoria',
      'Profesional',
      'Especialización',
      'Maestría',
    ].forEach((f) => {
      drawCheck(
        startX + 10,
        fy,
        f,
        grado?.toLowerCase().trim() === f.toLowerCase(),
      );
      fy -= 13;
    });

    // =========================
    // BLOQUE DERECHO (IDIOMAS)
    // =========================

    page.drawRectangle({
      x: startX + colHalf,
      y: y - blockH,
      width: colHalf,
      height: blockH,
      borderWidth: 1,
      borderColor: rgb(0, 0, 0),
    });

    page.drawText('IDIOMAS Y DISPONIBILIDAD', {
      x: startX + colHalf + 10,
      y: y - 12,
      size: 9,
      font: bold,
    });

    let iy = y - 26;

    // idiomas
    (perfil?.idiomas ?? []).forEach((i) => {
      page.drawText(
        `${i.idioma.nombre} (${i.pctEscrito}-${i.pctHablado}-${i.pctLeido})`,
        {
          x: startX + colHalf + 10,
          y: iy,
          size: 8,
          font,
        },
      );
      iy -= 12;
    });

    // disponibilidad
    iy -= 3;

    drawCheck(startX + colHalf + 10, iy, 'Viajar', perfil?.viaje);
    iy -= 13;

    drawCheck(startX + colHalf + 10, iy, 'Automóvil', perfil?.auto);
    iy -= 13;

    drawCheck(
      startX + colHalf + 10,
      iy,
      'Cambio residencia',
      perfil?.cambioResidencia,
    );

    y -= blockH + 12;

    // =========================
    // HABILIDADES + EQUIPO
    // =========================

    const tableH = 50;

    page.drawRectangle({
      x: startX,
      y: y - tableH,
      width: totalW,
      height: tableH,
      borderWidth: 1,
      borderColor: rgb(0, 0, 0),
    });

    // headers
    page.drawText('HABILIDADES', {
      x: startX + 10,
      y: y - 12,
      size: 9,
      font: bold,
    });

    page.drawText('EQUIPO', {
      x: startX + totalW / 2 + 10,
      y: y - 12,
      size: 9,
      font: bold,
    });

    // línea vertical
    page.drawLine({
      start: { x: startX + totalW / 2, y },
      end: { x: startX + totalW / 2, y: y - tableH },
      thickness: 1,
    });

    let ry = y - 25;

    const maxRows = Math.max(
      perfil?.habilidades?.length ?? 0,
      perfil?.equipos?.length ?? 0,
    );

    for (let i = 0; i < maxRows; i++) {
      const h = perfil?.habilidades?.[i];
      const e = perfil?.equipos?.[i];

      if (h) {
        page.drawText(h.habilidad.nombre, {
          x: startX + 10,
          y: ry,
          size: 9,
          font,
        });
      }

      if (e) {
        page.drawText(e.equipo.nombre, {
          x: startX + totalW / 2 + 10,
          y: ry,
          size: 9,
          font,
        });
      }

      ry -= 13;
    }

    y -= tableH + 12;
    const rowH = 22;

    const conocimientos = perfil?.conocimientos ?? [];

    // altura total estimada
    const estimatedH = (conocimientos.length + 1) * rowH + 20;

    // ✅ fuerza salto de página si no cabe
    if (y - estimatedH < 120) {
      page = pdf.addPage([595, 842]);
      y = 780;
    }
    // =========================
    // CONOCIMIENTOS
    // =========================

    // header
    page.drawRectangle({
      x: startX,
      y: y - rowH,
      width: totalW,
      height: rowH,
      borderWidth: 1,
      borderColor: rgb(0, 0, 0),
    });

    page.drawText('CONOCIMIENTO', {
      x: startX + 10,
      y: y - 15,
      size: 9,
      font: bold,
    });

    page.drawText('TIEMPO (MESES)', {
      x: startX + totalW - 130,
      y: y - 15,
      size: 9,
      font: bold,
    });

    y -= rowH;

    // filas
    (perfil?.conocimientos ?? []).forEach((c) => {
      page.drawRectangle({
        x: startX,
        y: y - rowH,
        width: totalW,
        height: rowH,
        borderWidth: 1,
        borderColor: rgb(0, 0, 0),
      });

      page.drawText(c.conocimiento.descripcion, {
        x: startX + 10,
        y: y - 15,
        size: 9,
        font,
      });

      page.drawText(String(c.tiempoMeses), {
        x: startX + totalW - 50,
        y: y - 15,
        size: 9,
        font,
      });

      y -= rowH;
    });

    y -= 30;

    const checkPageSpace = (minY = 120) => {
      if (y < minY) {
        page = pdf.addPage([595, 842]);
        y = 780;
      }
    };
    checkPageSpace();

    // =========================
    // IV. CARACTERÍSTICAS DE PERSONALIDAD
    // =========================

    // 🔴 encabezado
    page.drawRectangle({
      x: 50,
      y: y - 18,
      width: 495,
      height: 18,
      color: rgb(0, 0, 0),
    });

    page.drawText('IV. CARACTERÍSTICAS DE PERSONALIDAD DEL CANDIDATO', {
      x: 55,
      y: y - 14,
      size: 9,
      font: bold,
      color: rgb(1, 1, 1),
    });

    y -= 30;

    // ✅ RESET REAL (FIX CRÍTICO)
    const colWidth = 220;

    // datos
    const rasgos = perfil?.rasgos ?? [];
    const total = Math.max(rasgos.length, 4);

    const drawRow = (x: number, y: number, num: number, txt?: string) => {
      page.drawText(`${num}.-`, { x, y, size: 9, font });

      if (txt) {
        page.drawText(txt, {
          x: x + 18,
          y,
          size: 9,
          font,
          maxWidth: colWidth - 20,
        });
      }

      page.drawLine({
        start: { x, y: y - 4 },
        end: { x: x + colWidth, y: y - 4 },
        thickness: 0.7,
      });
    };

    let yLeftPers = y;
    let yRightPers = y;
    const rowHeightPers = 22;

    for (let i = 0; i < Math.ceil(total / 2); i++) {
      const rLeft = rasgos[i];
      const rRight = rasgos[i + 2];

      drawRow(leftX, yLeftPers, i + 1, rLeft?.rasgo?.descripcion);
      drawRow(rightX, yRightPers, i + 3, rRight?.rasgo?.descripcion);

      yLeftPers -= rowHeightPers;
      yRightPers -= rowHeightPers;
    }

    y = Math.min(yLeftPers, yRightPers) - 15;
    checkPageSpace();

    // =========================// V. PLAN DE VIDA Y DESARROLLO
    // =========================

    // 🔴 encabezado
    page.drawRectangle({
      x: 50,
      y: y - 18,
      width: 495,
      height: 18,
      color: rgb(0, 0, 0),
    });

    page.drawText(
      'V. PLAN DE VIDA Y DESARROLLO DEL PUESTO A MEDIANO Y LARGO PLAZO',
      {
        x: 55,
        y: y - 14,
        size: 9,
        font: bold,
        color: rgb(1, 1, 1),
      },
    );

    y -= 30;

    // descripción
    page.drawText(
      '(Puestos a los que puede llegar a subir o aspirar el candidato de acuerdo a su desempeño)',
      {
        x: 50,
        y,
        size: 8,
        font,
      },
    );

    y -= 18;

    // 🔥 datos
    const planMediano =
      perfil?.planCarrera?.find((p) => p.orden === 1)?.puesto?.nombre ?? '';

    const planLargo =
      perfil?.planCarrera?.find((p) => p.orden === 2)?.puesto?.nombre ?? '';

    // 🔥 columnas
    const colW = 220;

    page.drawText('1.-', { x: 50, y, size: 9, font });
    page.drawText(planMediano, {
      x: 70,
      y,
      size: 9,
      font,
      maxWidth: colW,
    });

    page.drawLine({
      start: { x: 50, y: y - 3 },
      end: { x: 50 + colW, y: y - 3 },
      thickness: 0.7,
    });

    page.drawText('2.-', { x: 305, y, size: 9, font });
    page.drawText(planLargo, {
      x: 325,
      y,
      size: 9,
      font,
      maxWidth: colW,
    });

    page.drawLine({
      start: { x: 305, y: y - 3 },
      end: { x: 305 + colW, y: y - 3 },
      thickness: 0.7,
    });

    y -= 25;

    // =========================
    // OBTENER FIRMAS
    // =========================

    const aprobaciones = requisicion.flujo?.aprobaciones ?? [];

    const ROL_GERENCIA = 2;
    const ROL_COORDINADOR = 3;

    const firmaPorRol = {
      GERENCIA: aprobaciones.find(
        (a) => a.paso?.rolId === ROL_GERENCIA && a.estado === 'APROBADO',
      ),
      COORDINADOR: aprobaciones.find(
        (a) => a.paso?.rolId === ROL_COORDINADOR && a.estado === 'APROBADO',
      ),
    };

    // ✅ FIX IMPORTANTE (usar nombreJefe)
    const firmaSolicitante = {
      nombre: requisicion.nombreJefe ?? null,
      fecha: requisicion.firmadoEn ?? null,
    };

    // =========================
    // V. FIRMAS
    // =========================
    // NO resetear y ✅
    // usar el flujo natural

    // =========================
    // CONFIG TABLA (AGREGADO)
    // =========================

    const startXD = 50;
    const colWidthD = 170;
    const rowHeightD = 90;

    // =========================
    // FORMAT FECHA
    // =========================

    const formatFecha = (date?: Date | null) =>
      date
        ? date.toLocaleDateString('es-MX') +
          ' ' +
          date.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '';

    // =========================
    // CELDA FIRMA
    // =========================

    const drawCell = (
      x: number,
      titulo: string,
      nombre?: string | null,
      fecha?: Date | null,
    ) => {
      const baseY = y;

      // borde
      page.drawRectangle({
        x,
        y: baseY - rowHeightD,
        width: colWidthD,
        height: rowHeightD,
        borderWidth: 1,
        borderColor: rgb(0, 0, 0),
      });

      // línea firme arriba (mejor alineación)
      page.drawLine({
        start: { x: x + 10, y: baseY - 25 },
        end: { x: x + colWidthD - 10, y: baseY - 25 },
        thickness: 1,
      });

      // nombre
      if (nombre) {
        page.drawText(nombre, {
          x: x + 8,
          y: baseY - 40,
          size: 9,
          font: bold,
        });
      }

      // rol
      page.drawText(titulo, {
        x: x + 8,
        y: baseY - 60,
        size: 8,
        font,
      });

      // fecha
      if (fecha) {
        page.drawText(formatFecha(fecha), {
          x: x + 8,
          y: baseY - 75,
          size: 7,
          font,
        });
      }
    };

    // =========================
    // RENDER TABLA
    // =========================

    drawCell(
      startXD,
      'Solicitante',
      firmaSolicitante.nombre,
      firmaSolicitante.fecha,
    );

    drawCell(
      startXD + colWidthD,
      'Gerencia',
      firmaPorRol.GERENCIA?.aprobador?.nombre ?? null,
      firmaPorRol.GERENCIA?.firmadoEn ?? null,
    );

    drawCell(
      startXD + colWidthD * 2,
      'Coordinador Administrativo',
      firmaPorRol.COORDINADOR?.aprobador?.nombre ?? null,
      firmaPorRol.COORDINADOR?.firmadoEn ?? null,
    );

    // =========================
    // ESPACIO ANTES DEL SELLO (FIX)
    // =========================

    y -= rowHeightD + 40;

    // =========================
    // SELLO
    // =========================

    const todasAprobadas = firmaPorRol.GERENCIA && firmaPorRol.COORDINADOR;

    if (todasAprobadas) {
      page.drawText('AUTORIZADA', {
        x: startXD + colWidthD + 20,
        y,
        size: 18,
        font: bold,
        color: rgb(0, 0.6, 0),
      });
    }

    // =========================
    // FOOTER DOCUMENTO
    // =========================

    const footerY = 40;

    // lado izquierdo
    page.drawText('F-RH-10', {
      x: 50,
      y: footerY,
      size: 8,
      font,
    });

    // lado derecho
    page.drawText('REV 04', {
      x: 480,
      y: footerY,
      size: 8,
      font,
    });

    // =========================
    // FINAL PDF
    // =========================

    const bytes = await pdf.save();
    return Buffer.from(bytes);
  }
}
