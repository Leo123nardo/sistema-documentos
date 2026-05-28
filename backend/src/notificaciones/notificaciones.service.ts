import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificacionesService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // ✅ PASO 3.2: enviar correo de aprobación
  async enviarCorreoPasoAprobado(data: {
    destinatario: string;
    requisicionId: number;
    paso: string;
    aprobadoPor: string;
  }) {
    try {
      await this.transporter.sendMail({
        from: `"Sistema RH" <${process.env.SMTP_USER}>`,
        to: data.destinatario,
        subject: '✅ Paso aprobado en requisición',
        html: `
          <p>Hola,</p>
          <p>El siguiente paso ha sido aprobado:</p>
          <ul>
            <li><strong>Requisición:</strong> ${data.requisicionId}</li>
            <li><strong>Paso:</strong> ${data.paso}</li>
            <li><strong>Aprobado por:</strong> ${data.aprobadoPor}</li>
          </ul>
          <p>Saludos,<br/>Sistema de Requisiciones RH</p>
        `,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error enviando correo de aprobación',
      );
    }
  }

  // ✅ PASO 3.3: enviar correo de paso pendiente
  async enviarCorreoPasoPendiente(data: {
    destinatario: string;
    requisicionId: number;
    paso: string;
  }) {
    try {
      await this.transporter.sendMail({
        from: `"Sistema RH" <${process.env.SMTP_USER}>`,
        to: data.destinatario,
        subject: '📢 Requisición pendiente de aprobación',
        html: `
          <p>Hola,</p>
          <p>Tienes una requisición pendiente de aprobación:</p>
          <ul>
            <li><strong>Requisición:</strong> ${data.requisicionId}</li>
            <li><strong>Paso:</strong> ${data.paso}</li>
          </ul>
          <p>Por favor ingresa al sistema.</p>
          <p>Saludos,<br/>Sistema de Requisiciones RH</p>
        `,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error enviando correo de paso pendiente',
      );
    }
  }

  notificarAprobacionPaso(data: {
    requisicionId: number;
    pasoAprobado: string;
    aprobadoPor: string;
  }) {
    console.log('==============================');
    console.log('✅ NOTIFICACIÓN: PASO APROBADO');
    console.log(`Requisición: ${data.requisicionId}`);
    console.log(`Paso aprobado: ${data.pasoAprobado}`);
    console.log(`Aprobado por: ${data.aprobadoPor}`);
    console.log('==============================');
  }

  notificarPasoPendiente(data: {
    requisicionId: number;
    pasoPendiente: string;
    destino: string;
  }) {
    console.log('==============================');
    console.log('📢 NOTIFICACIÓN: PASO PENDIENTE');
    console.log(`Requisición: ${data.requisicionId}`);
    console.log(`Paso pendiente: ${data.pasoPendiente}`);
    console.log(`Notificar a: ${data.destino}`);
    console.log('==============================');
  }
}
