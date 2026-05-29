-- CreateEnum
CREATE TYPE "firmas_digitales_tipo" AS ENUM ('drawn', 'typed', 'image', 'password_confirm', 'cert');

-- CreateEnum
CREATE TYPE "perfiles_vacante_sexo" AS ENUM ('F', 'M', 'NA');

-- CreateEnum
CREATE TYPE "perfiles_vacante_horario_laboral" AS ENUM ('Turnos', 'Oficinas');

-- CreateEnum
CREATE TYPE "perfiles_vacante_grado_estudio" AS ENUM ('Profesionista', 'Tecnico', 'Becario', 'Practicante');

-- CreateTable
CREATE TABLE "departamentos" (
    "ID_Departamento" SERIAL NOT NULL,
    "nombre_departamento" VARCHAR(60) NOT NULL,
    "codigo_departamento" VARCHAR(45) NOT NULL,

    CONSTRAINT "departamentos_pkey" PRIMARY KEY ("ID_Departamento")
);

-- CreateTable
CREATE TABLE "roles" (
    "ID_Rol" SERIAL NOT NULL,
    "nombre_rol" VARCHAR(60) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("ID_Rol")
);

-- CreateTable
CREATE TABLE "puestos" (
    "ID_Puesto" SERIAL NOT NULL,
    "nombre" VARCHAR(65) NOT NULL,

    CONSTRAINT "puestos_pkey" PRIMARY KEY ("ID_Puesto")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "ID_Usuario" SERIAL NOT NULL,
    "nombre_usuario" VARCHAR(100) NOT NULL,
    "correo_electronico" VARCHAR(100) NOT NULL,
    "contrasena" VARCHAR(100) NOT NULL,
    "ID_Departamento" INTEGER,
    "ID_Puesto" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("ID_Usuario")
);

-- CreateTable
CREATE TABLE "usuario_roles" (
    "ID_Usuario" INTEGER NOT NULL,
    "ID_Rol" INTEGER NOT NULL,

    CONSTRAINT "usuario_roles_pkey" PRIMARY KEY ("ID_Usuario","ID_Rol")
);

-- CreateTable
CREATE TABLE "aprobaciones" (
    "ID_Aprobacion" SERIAL NOT NULL,
    "ID_RF" INTEGER NOT NULL,
    "ID_FlujosPasos" INTEGER NOT NULL,
    "aprobador_user_id" INTEGER,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    "comentario" VARCHAR(300),
    "firmado_en" TIMESTAMP(3),
    "firmado_desde_ip" VARCHAR(45),
    "user_agent" VARCHAR(200),

    CONSTRAINT "aprobaciones_pkey" PRIMARY KEY ("ID_Aprobacion")
);

-- CreateTable
CREATE TABLE "conocimientos" (
    "ID_Conocimiento" SERIAL NOT NULL,
    "descripcion" VARCHAR(65) NOT NULL,

    CONSTRAINT "conocimientos_pkey" PRIMARY KEY ("ID_Conocimiento")
);

-- CreateTable
CREATE TABLE "equipos_maquinaria" (
    "ID_EquiposM" SERIAL NOT NULL,
    "nombre" VARCHAR(65) NOT NULL,

    CONSTRAINT "equipos_maquinaria_pkey" PRIMARY KEY ("ID_EquiposM")
);

-- CreateTable
CREATE TABLE "firmas_digitales" (
    "ID_FirmaDigital" SERIAL NOT NULL,
    "ID_Aprobacion" INTEGER NOT NULL,
    "tipo" "firmas_digitales_tipo" NOT NULL,
    "hash" CHAR(64) NOT NULL,
    "archivo_ruta" VARCHAR(255),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "firmas_digitales_pkey" PRIMARY KEY ("ID_FirmaDigital")
);

-- CreateTable
CREATE TABLE "flujos" (
    "ID_Flujo" SERIAL NOT NULL,
    "nombre_flujo" VARCHAR(60) NOT NULL,
    "version" VARCHAR(20) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "flujos_pkey" PRIMARY KEY ("ID_Flujo")
);

-- CreateTable
CREATE TABLE "flujos_pasos" (
    "ID_FlujosPasos" SERIAL NOT NULL,
    "ID_Flujo" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,
    "titulo" VARCHAR(80) NOT NULL,
    "obligatorio" BOOLEAN NOT NULL DEFAULT true,
    "ID_Rol" INTEGER,
    "ID_Puesto" INTEGER,
    "ID_Departamento" INTEGER,

    CONSTRAINT "flujos_pasos_pkey" PRIMARY KEY ("ID_FlujosPasos")
);

-- CreateTable
CREATE TABLE "formacion_academica" (
    "ID_FormacionAcademica" SERIAL NOT NULL,
    "nombre" VARCHAR(45) NOT NULL,

    CONSTRAINT "formacion_academica_pkey" PRIMARY KEY ("ID_FormacionAcademica")
);

-- CreateTable
CREATE TABLE "funciones_principales" (
    "ID_FP" SERIAL NOT NULL,
    "requisicion_id" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,
    "descripcion" VARCHAR(65) NOT NULL,

    CONSTRAINT "funciones_principales_pkey" PRIMARY KEY ("ID_FP")
);

-- CreateTable
CREATE TABLE "habilidades_informaticas" (
    "ID_Habilidad" SERIAL NOT NULL,
    "nombre" VARCHAR(65) NOT NULL,

    CONSTRAINT "habilidades_informaticas_pkey" PRIMARY KEY ("ID_Habilidad")
);

-- CreateTable
CREATE TABLE "idiomas" (
    "ID_Idioma" SERIAL NOT NULL,
    "nombre_idioma" VARCHAR(65) NOT NULL,

    CONSTRAINT "idiomas_pkey" PRIMARY KEY ("ID_Idioma")
);

-- CreateTable
CREATE TABLE "perfil_conocimiento" (
    "ID_PC" SERIAL NOT NULL,
    "Perfiles_Vacante_ID_Vacante" INTEGER NOT NULL,
    "Conocimientos_ID_Conocimiento" INTEGER NOT NULL,
    "tiempo_meses" INTEGER,

    CONSTRAINT "perfil_conocimiento_pkey" PRIMARY KEY ("ID_PC")
);

-- CreateTable
CREATE TABLE "perfil_equiposm" (
    "Perfiles_Vacante_ID_Vacante" INTEGER NOT NULL,
    "Equipos_Maquinaria_ID_EquiposM" INTEGER NOT NULL,

    CONSTRAINT "perfil_equiposm_pkey" PRIMARY KEY ("Perfiles_Vacante_ID_Vacante","Equipos_Maquinaria_ID_EquiposM")
);

-- CreateTable
CREATE TABLE "perfil_formacionesa" (
    "Perfiles_Vacante_ID_Vacante" INTEGER NOT NULL,
    "Formacion_Academica_ID_FormacionAcademica" INTEGER NOT NULL,

    CONSTRAINT "perfil_formacionesa_pkey" PRIMARY KEY ("Perfiles_Vacante_ID_Vacante","Formacion_Academica_ID_FormacionAcademica")
);

-- CreateTable
CREATE TABLE "perfil_habilidadesi" (
    "Perfiles_Vacante_ID_Vacante" INTEGER NOT NULL,
    "Habilidades_Informaticas_ID_Habilidad" INTEGER NOT NULL,

    CONSTRAINT "perfil_habilidadesi_pkey" PRIMARY KEY ("Perfiles_Vacante_ID_Vacante","Habilidades_Informaticas_ID_Habilidad")
);

-- CreateTable
CREATE TABLE "perfil_idiomas" (
    "ID_PI" SERIAL NOT NULL,
    "Perfiles_Vacante_ID_Vacante" INTEGER NOT NULL,
    "Idiomas_ID_Idioma" INTEGER NOT NULL,
    "pct_leido" INTEGER NOT NULL DEFAULT 0,
    "pct_hablado" INTEGER NOT NULL DEFAULT 0,
    "pct_escrito" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "perfil_idiomas_pkey" PRIMARY KEY ("ID_PI")
);

-- CreateTable
CREATE TABLE "perfil_plan_carrera" (
    "ID_PerfilPC" SERIAL NOT NULL,
    "Perfiles_Vacante_ID_Vacante" INTEGER NOT NULL,
    "ID_Puesto" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "perfil_plan_carrera_pkey" PRIMARY KEY ("ID_PerfilPC")
);

-- CreateTable
CREATE TABLE "perfil_rasgosp" (
    "Perfiles_Vacante_ID_Vacante" INTEGER NOT NULL,
    "Rasgos_Personalidad_ID_Rasgo" INTEGER NOT NULL,

    CONSTRAINT "perfil_rasgosp_pkey" PRIMARY KEY ("Perfiles_Vacante_ID_Vacante","Rasgos_Personalidad_ID_Rasgo")
);

-- CreateTable
CREATE TABLE "perfiles_vacante" (
    "ID_Vacante" SERIAL NOT NULL,
    "edad_minima" INTEGER,
    "edad_maxima" INTEGER,
    "sexo" "perfiles_vacante_sexo",
    "anos_experiencia" INTEGER,
    "sueldoMin" INTEGER,
    "sueldoMax" INTEGER,
    "nivelPuesto" TEXT,
    "horarioLaboral" "perfiles_vacante_horario_laboral",
    "gradoEstudio" "perfiles_vacante_grado_estudio",
    "generacion_vacante" VARCHAR(65),
    "viaje" BOOLEAN NOT NULL DEFAULT false,
    "auto" BOOLEAN NOT NULL DEFAULT false,
    "cambio_residencia" BOOLEAN NOT NULL DEFAULT false,
    "Requisiciones_ID_Requisicion" INTEGER NOT NULL,

    CONSTRAINT "perfiles_vacante_pkey" PRIMARY KEY ("ID_Vacante")
);

-- CreateTable
CREATE TABLE "rasgos_personalidad" (
    "ID_Rasgo" SERIAL NOT NULL,
    "descripcion" VARCHAR(65) NOT NULL,

    CONSTRAINT "rasgos_personalidad_pkey" PRIMARY KEY ("ID_Rasgo")
);

-- CreateTable
CREATE TABLE "requisicion_flujo" (
    "ID_RF" SERIAL NOT NULL,
    "ID_Requisicion" INTEGER NOT NULL,
    "ID_Flujo" INTEGER NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'EN_REVISION',
    "iniciado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalizado_en" TIMESTAMP(3),

    CONSTRAINT "requisicion_flujo_pkey" PRIMARY KEY ("ID_RF")
);

-- CreateTable
CREATE TABLE "requisiciones" (
    "ID_Requisicion" SERIAL NOT NULL,
    "folio" VARCHAR(45) NOT NULL,
    "fecha_solicitud" DATE NOT NULL,
    "departamento_area" INTEGER NOT NULL,
    "nombre_jefe" VARCHAR(65),
    "personal_cargo" INTEGER,
    "puesto_solicitado" VARCHAR(65),
    "proyecto_planta" VARCHAR(65),
    "cantidad_requerida" INTEGER NOT NULL DEFAULT 1,
    "estado_requisicion" VARCHAR(45) NOT NULL DEFAULT 'BORRADOR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firmadoPorId" INTEGER,
    "firmadoEn" TIMESTAMP(3),

    CONSTRAINT "requisiciones_pkey" PRIMARY KEY ("ID_Requisicion")
);

-- CreateIndex
CREATE UNIQUE INDEX "departamentos_codigo_departamento_key" ON "departamentos"("codigo_departamento");

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_rol_key" ON "roles"("nombre_rol");

-- CreateIndex
CREATE UNIQUE INDEX "puestos_nombre_key" ON "puestos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_electronico_key" ON "usuarios"("correo_electronico");

-- CreateIndex
CREATE UNIQUE INDEX "aprobaciones_ID_RF_ID_FlujosPasos_key" ON "aprobaciones"("ID_RF", "ID_FlujosPasos");

-- CreateIndex
CREATE UNIQUE INDEX "conocimientos_descripcion_key" ON "conocimientos"("descripcion");

-- CreateIndex
CREATE UNIQUE INDEX "equipos_maquinaria_nombre_key" ON "equipos_maquinaria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "flujos_nombre_flujo_version_key" ON "flujos"("nombre_flujo", "version");

-- CreateIndex
CREATE UNIQUE INDEX "flujos_pasos_ID_Flujo_orden_key" ON "flujos_pasos"("ID_Flujo", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "formacion_academica_nombre_key" ON "formacion_academica"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "funciones_principales_requisicion_id_orden_key" ON "funciones_principales"("requisicion_id", "orden");

-- CreateIndex
CREATE UNIQUE INDEX "habilidades_informaticas_nombre_key" ON "habilidades_informaticas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "idiomas_nombre_idioma_key" ON "idiomas"("nombre_idioma");

-- CreateIndex
CREATE UNIQUE INDEX "perfil_conocimiento_Perfiles_Vacante_ID_Vacante_Conocimient_key" ON "perfil_conocimiento"("Perfiles_Vacante_ID_Vacante", "Conocimientos_ID_Conocimiento");

-- CreateIndex
CREATE UNIQUE INDEX "perfil_idiomas_Perfiles_Vacante_ID_Vacante_Idiomas_ID_Idiom_key" ON "perfil_idiomas"("Perfiles_Vacante_ID_Vacante", "Idiomas_ID_Idioma");

-- CreateIndex
CREATE UNIQUE INDEX "perfil_plan_carrera_Perfiles_Vacante_ID_Vacante_ID_Puesto_key" ON "perfil_plan_carrera"("Perfiles_Vacante_ID_Vacante", "ID_Puesto");

-- CreateIndex
CREATE UNIQUE INDEX "perfiles_vacante_Requisiciones_ID_Requisicion_key" ON "perfiles_vacante"("Requisiciones_ID_Requisicion");

-- CreateIndex
CREATE UNIQUE INDEX "rasgos_personalidad_descripcion_key" ON "rasgos_personalidad"("descripcion");

-- CreateIndex
CREATE UNIQUE INDEX "requisicion_flujo_ID_Requisicion_key" ON "requisicion_flujo"("ID_Requisicion");

-- CreateIndex
CREATE UNIQUE INDEX "requisiciones_folio_key" ON "requisiciones"("folio");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_ID_Departamento_fkey" FOREIGN KEY ("ID_Departamento") REFERENCES "departamentos"("ID_Departamento") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_ID_Puesto_fkey" FOREIGN KEY ("ID_Puesto") REFERENCES "puestos"("ID_Puesto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "usuario_roles_ID_Usuario_fkey" FOREIGN KEY ("ID_Usuario") REFERENCES "usuarios"("ID_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "usuario_roles_ID_Rol_fkey" FOREIGN KEY ("ID_Rol") REFERENCES "roles"("ID_Rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprobaciones" ADD CONSTRAINT "aprobaciones_ID_RF_fkey" FOREIGN KEY ("ID_RF") REFERENCES "requisicion_flujo"("ID_RF") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprobaciones" ADD CONSTRAINT "aprobaciones_ID_FlujosPasos_fkey" FOREIGN KEY ("ID_FlujosPasos") REFERENCES "flujos_pasos"("ID_FlujosPasos") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aprobaciones" ADD CONSTRAINT "aprobaciones_aprobador_user_id_fkey" FOREIGN KEY ("aprobador_user_id") REFERENCES "usuarios"("ID_Usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "firmas_digitales" ADD CONSTRAINT "firmas_digitales_ID_Aprobacion_fkey" FOREIGN KEY ("ID_Aprobacion") REFERENCES "aprobaciones"("ID_Aprobacion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flujos_pasos" ADD CONSTRAINT "flujos_pasos_ID_Flujo_fkey" FOREIGN KEY ("ID_Flujo") REFERENCES "flujos"("ID_Flujo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flujos_pasos" ADD CONSTRAINT "flujos_pasos_ID_Rol_fkey" FOREIGN KEY ("ID_Rol") REFERENCES "roles"("ID_Rol") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flujos_pasos" ADD CONSTRAINT "flujos_pasos_ID_Puesto_fkey" FOREIGN KEY ("ID_Puesto") REFERENCES "puestos"("ID_Puesto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flujos_pasos" ADD CONSTRAINT "flujos_pasos_ID_Departamento_fkey" FOREIGN KEY ("ID_Departamento") REFERENCES "departamentos"("ID_Departamento") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funciones_principales" ADD CONSTRAINT "funciones_principales_requisicion_id_fkey" FOREIGN KEY ("requisicion_id") REFERENCES "requisiciones"("ID_Requisicion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_conocimiento" ADD CONSTRAINT "perfil_conocimiento_Perfiles_Vacante_ID_Vacante_fkey" FOREIGN KEY ("Perfiles_Vacante_ID_Vacante") REFERENCES "perfiles_vacante"("ID_Vacante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_conocimiento" ADD CONSTRAINT "perfil_conocimiento_Conocimientos_ID_Conocimiento_fkey" FOREIGN KEY ("Conocimientos_ID_Conocimiento") REFERENCES "conocimientos"("ID_Conocimiento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_equiposm" ADD CONSTRAINT "perfil_equiposm_Perfiles_Vacante_ID_Vacante_fkey" FOREIGN KEY ("Perfiles_Vacante_ID_Vacante") REFERENCES "perfiles_vacante"("ID_Vacante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_equiposm" ADD CONSTRAINT "perfil_equiposm_Equipos_Maquinaria_ID_EquiposM_fkey" FOREIGN KEY ("Equipos_Maquinaria_ID_EquiposM") REFERENCES "equipos_maquinaria"("ID_EquiposM") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_formacionesa" ADD CONSTRAINT "perfil_formacionesa_Perfiles_Vacante_ID_Vacante_fkey" FOREIGN KEY ("Perfiles_Vacante_ID_Vacante") REFERENCES "perfiles_vacante"("ID_Vacante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_formacionesa" ADD CONSTRAINT "perfil_formacionesa_Formacion_Academica_ID_FormacionAcadem_fkey" FOREIGN KEY ("Formacion_Academica_ID_FormacionAcademica") REFERENCES "formacion_academica"("ID_FormacionAcademica") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_habilidadesi" ADD CONSTRAINT "perfil_habilidadesi_Perfiles_Vacante_ID_Vacante_fkey" FOREIGN KEY ("Perfiles_Vacante_ID_Vacante") REFERENCES "perfiles_vacante"("ID_Vacante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_habilidadesi" ADD CONSTRAINT "perfil_habilidadesi_Habilidades_Informaticas_ID_Habilidad_fkey" FOREIGN KEY ("Habilidades_Informaticas_ID_Habilidad") REFERENCES "habilidades_informaticas"("ID_Habilidad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_idiomas" ADD CONSTRAINT "perfil_idiomas_Perfiles_Vacante_ID_Vacante_fkey" FOREIGN KEY ("Perfiles_Vacante_ID_Vacante") REFERENCES "perfiles_vacante"("ID_Vacante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_idiomas" ADD CONSTRAINT "perfil_idiomas_Idiomas_ID_Idioma_fkey" FOREIGN KEY ("Idiomas_ID_Idioma") REFERENCES "idiomas"("ID_Idioma") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_plan_carrera" ADD CONSTRAINT "perfil_plan_carrera_Perfiles_Vacante_ID_Vacante_fkey" FOREIGN KEY ("Perfiles_Vacante_ID_Vacante") REFERENCES "perfiles_vacante"("ID_Vacante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_plan_carrera" ADD CONSTRAINT "perfil_plan_carrera_ID_Puesto_fkey" FOREIGN KEY ("ID_Puesto") REFERENCES "puestos"("ID_Puesto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_rasgosp" ADD CONSTRAINT "perfil_rasgosp_Perfiles_Vacante_ID_Vacante_fkey" FOREIGN KEY ("Perfiles_Vacante_ID_Vacante") REFERENCES "perfiles_vacante"("ID_Vacante") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfil_rasgosp" ADD CONSTRAINT "perfil_rasgosp_Rasgos_Personalidad_ID_Rasgo_fkey" FOREIGN KEY ("Rasgos_Personalidad_ID_Rasgo") REFERENCES "rasgos_personalidad"("ID_Rasgo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perfiles_vacante" ADD CONSTRAINT "perfiles_vacante_Requisiciones_ID_Requisicion_fkey" FOREIGN KEY ("Requisiciones_ID_Requisicion") REFERENCES "requisiciones"("ID_Requisicion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisicion_flujo" ADD CONSTRAINT "requisicion_flujo_ID_Requisicion_fkey" FOREIGN KEY ("ID_Requisicion") REFERENCES "requisiciones"("ID_Requisicion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisicion_flujo" ADD CONSTRAINT "requisicion_flujo_ID_Flujo_fkey" FOREIGN KEY ("ID_Flujo") REFERENCES "flujos"("ID_Flujo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisiciones" ADD CONSTRAINT "requisiciones_departamento_area_fkey" FOREIGN KEY ("departamento_area") REFERENCES "departamentos"("ID_Departamento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisiciones" ADD CONSTRAINT "requisiciones_firmadoPorId_fkey" FOREIGN KEY ("firmadoPorId") REFERENCES "usuarios"("ID_Usuario") ON DELETE SET NULL ON UPDATE CASCADE;
