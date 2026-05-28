-- CreateTable
CREATE TABLE `departamentos` (
    `ID_Departamento` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_departamento` VARCHAR(60) NOT NULL,
    `codigo_departamento` VARCHAR(45) NOT NULL,

    UNIQUE INDEX `departamentos_codigo_departamento_key`(`codigo_departamento`),
    PRIMARY KEY (`ID_Departamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `ID_Rol` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_rol` VARCHAR(60) NOT NULL,

    UNIQUE INDEX `roles_nombre_rol_key`(`nombre_rol`),
    PRIMARY KEY (`ID_Rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `puestos` (
    `ID_Puesto` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(65) NOT NULL,

    UNIQUE INDEX `puestos_nombre_key`(`nombre`),
    PRIMARY KEY (`ID_Puesto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `ID_Usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_usuario` VARCHAR(100) NOT NULL,
    `correo_electronico` VARCHAR(100) NOT NULL,
    `contrasena` VARCHAR(100) NOT NULL,
    `ID_Departamento` INTEGER NULL,
    `ID_Puesto` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_correo_electronico_key`(`correo_electronico`),
    PRIMARY KEY (`ID_Usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario_roles` (
    `ID_Usuario` INTEGER NOT NULL,
    `ID_Rol` INTEGER NOT NULL,

    PRIMARY KEY (`ID_Usuario`, `ID_Rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aprobaciones` (
    `ID_Aprobacion` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_RF` INTEGER NOT NULL,
    `ID_FlujosPasos` INTEGER NOT NULL,
    `aprobador_user_id` INTEGER NULL,
    `estado` VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    `comentario` VARCHAR(300) NULL,
    `firmado_en` DATETIME(3) NULL,
    `firmado_desde_ip` VARCHAR(45) NULL,
    `user_agent` VARCHAR(200) NULL,

    UNIQUE INDEX `aprobaciones_ID_RF_ID_FlujosPasos_key`(`ID_RF`, `ID_FlujosPasos`),
    PRIMARY KEY (`ID_Aprobacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conocimientos` (
    `ID_Conocimiento` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(65) NOT NULL,

    UNIQUE INDEX `conocimientos_descripcion_key`(`descripcion`),
    PRIMARY KEY (`ID_Conocimiento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipos_maquinaria` (
    `ID_EquiposM` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(65) NOT NULL,

    UNIQUE INDEX `equipos_maquinaria_nombre_key`(`nombre`),
    PRIMARY KEY (`ID_EquiposM`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `firmas_digitales` (
    `ID_FirmaDigital` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_Aprobacion` INTEGER NOT NULL,
    `tipo` ENUM('drawn', 'typed', 'image', 'password_confirm', 'cert') NOT NULL,
    `hash` CHAR(64) NOT NULL,
    `archivo_ruta` VARCHAR(255) NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ID_FirmaDigital`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flujos` (
    `ID_Flujo` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_flujo` VARCHAR(60) NOT NULL,
    `version` VARCHAR(20) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `flujos_nombre_flujo_version_key`(`nombre_flujo`, `version`),
    PRIMARY KEY (`ID_Flujo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `flujos_pasos` (
    `ID_FlujosPasos` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_Flujo` INTEGER NOT NULL,
    `orden` INTEGER NOT NULL,
    `titulo` VARCHAR(80) NOT NULL,
    `obligatorio` BOOLEAN NOT NULL DEFAULT true,
    `ID_Rol` INTEGER NULL,
    `ID_Puesto` INTEGER NULL,
    `ID_Departamento` INTEGER NULL,

    UNIQUE INDEX `flujos_pasos_ID_Flujo_orden_key`(`ID_Flujo`, `orden`),
    PRIMARY KEY (`ID_FlujosPasos`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `formacion_academica` (
    `ID_FormacionAcademica` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,

    UNIQUE INDEX `formacion_academica_nombre_key`(`nombre`),
    PRIMARY KEY (`ID_FormacionAcademica`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `funciones_principales` (
    `ID_FP` INTEGER NOT NULL AUTO_INCREMENT,
    `requisicion_id` INTEGER NOT NULL,
    `orden` INTEGER NOT NULL,
    `descripcion` VARCHAR(65) NOT NULL,

    UNIQUE INDEX `funciones_principales_requisicion_id_orden_key`(`requisicion_id`, `orden`),
    PRIMARY KEY (`ID_FP`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `habilidades_informaticas` (
    `ID_Habilidad` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(65) NOT NULL,

    UNIQUE INDEX `habilidades_informaticas_nombre_key`(`nombre`),
    PRIMARY KEY (`ID_Habilidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `idiomas` (
    `ID_Idioma` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_idioma` VARCHAR(65) NOT NULL,

    UNIQUE INDEX `idiomas_nombre_idioma_key`(`nombre_idioma`),
    PRIMARY KEY (`ID_Idioma`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfil_conocimiento` (
    `ID_PC` INTEGER NOT NULL AUTO_INCREMENT,
    `Perfiles_Vacante_ID_Vacante` INTEGER NOT NULL,
    `Conocimientos_ID_Conocimiento` INTEGER NOT NULL,
    `tiempo_meses` INTEGER NULL,

    UNIQUE INDEX `perfil_conocimiento_Perfiles_Vacante_ID_Vacante_Conocimiento_key`(`Perfiles_Vacante_ID_Vacante`, `Conocimientos_ID_Conocimiento`),
    PRIMARY KEY (`ID_PC`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfil_equiposm` (
    `Perfiles_Vacante_ID_Vacante` INTEGER NOT NULL,
    `Equipos_Maquinaria_ID_EquiposM` INTEGER NOT NULL,

    PRIMARY KEY (`Perfiles_Vacante_ID_Vacante`, `Equipos_Maquinaria_ID_EquiposM`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfil_formacionesa` (
    `Perfiles_Vacante_ID_Vacante` INTEGER NOT NULL,
    `Formacion_Academica_ID_FormacionAcademica` INTEGER NOT NULL,

    PRIMARY KEY (`Perfiles_Vacante_ID_Vacante`, `Formacion_Academica_ID_FormacionAcademica`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfil_habilidadesi` (
    `Perfiles_Vacante_ID_Vacante` INTEGER NOT NULL,
    `Habilidades_Informaticas_ID_Habilidad` INTEGER NOT NULL,

    PRIMARY KEY (`Perfiles_Vacante_ID_Vacante`, `Habilidades_Informaticas_ID_Habilidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfil_idiomas` (
    `ID_PI` INTEGER NOT NULL AUTO_INCREMENT,
    `Perfiles_Vacante_ID_Vacante` INTEGER NOT NULL,
    `Idiomas_ID_Idioma` INTEGER NOT NULL,
    `pct_leido` INTEGER NOT NULL DEFAULT 0,
    `pct_hablado` INTEGER NOT NULL DEFAULT 0,
    `pct_escrito` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `perfil_idiomas_Perfiles_Vacante_ID_Vacante_Idiomas_ID_Idioma_key`(`Perfiles_Vacante_ID_Vacante`, `Idiomas_ID_Idioma`),
    PRIMARY KEY (`ID_PI`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfil_plan_carrera` (
    `ID_PerfilPC` INTEGER NOT NULL AUTO_INCREMENT,
    `Perfiles_Vacante_ID_Vacante` INTEGER NOT NULL,
    `ID_Puesto` INTEGER NOT NULL,
    `orden` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `perfil_plan_carrera_Perfiles_Vacante_ID_Vacante_ID_Puesto_key`(`Perfiles_Vacante_ID_Vacante`, `ID_Puesto`),
    PRIMARY KEY (`ID_PerfilPC`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfil_rasgosp` (
    `Perfiles_Vacante_ID_Vacante` INTEGER NOT NULL,
    `Rasgos_Personalidad_ID_Rasgo` INTEGER NOT NULL,

    PRIMARY KEY (`Perfiles_Vacante_ID_Vacante`, `Rasgos_Personalidad_ID_Rasgo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfiles_vacante` (
    `ID_Vacante` INTEGER NOT NULL AUTO_INCREMENT,
    `edad_minima` INTEGER NULL,
    `edad_maxima` INTEGER NULL,
    `sexo` ENUM('F', 'M', 'NA') NULL,
    `anos_experiencia` INTEGER NULL,
    `horarioLaboral` ENUM('Turnos', 'Oficinas') NULL,
    `gradoEstudio` ENUM('Profesionista', 'Tecnico', 'Becario', 'Practicante') NULL,
    `generacion_vacante` VARCHAR(65) NULL,
    `viaje` BOOLEAN NOT NULL DEFAULT false,
    `auto` BOOLEAN NOT NULL DEFAULT false,
    `cambio_residencia` BOOLEAN NOT NULL DEFAULT false,
    `Requisiciones_ID_Requisicion` INTEGER NOT NULL,

    UNIQUE INDEX `perfiles_vacante_Requisiciones_ID_Requisicion_key`(`Requisiciones_ID_Requisicion`),
    PRIMARY KEY (`ID_Vacante`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rasgos_personalidad` (
    `ID_Rasgo` INTEGER NOT NULL AUTO_INCREMENT,
    `descripcion` VARCHAR(65) NOT NULL,

    UNIQUE INDEX `rasgos_personalidad_descripcion_key`(`descripcion`),
    PRIMARY KEY (`ID_Rasgo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `requisicion_flujo` (
    `ID_RF` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_Requisicion` INTEGER NOT NULL,
    `ID_Flujo` INTEGER NOT NULL,
    `estado` VARCHAR(20) NOT NULL DEFAULT 'EN_REVISION',
    `iniciado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `finalizado_en` DATETIME(3) NULL,

    UNIQUE INDEX `requisicion_flujo_ID_Requisicion_key`(`ID_Requisicion`),
    PRIMARY KEY (`ID_RF`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `requisiciones` (
    `ID_Requisicion` INTEGER NOT NULL AUTO_INCREMENT,
    `folio` VARCHAR(45) NOT NULL,
    `fecha_solicitud` DATE NOT NULL,
    `departamento_area` INTEGER NOT NULL,
    `nombre_jefe` VARCHAR(65) NULL,
    `personal_cargo` INTEGER NULL,
    `puesto_solicitado` VARCHAR(65) NULL,
    `proyecto_planta` VARCHAR(65) NULL,
    `cantidad_requerida` INTEGER NOT NULL DEFAULT 1,
    `estado_requisicion` VARCHAR(45) NOT NULL DEFAULT 'BORRADOR',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `requisiciones_folio_key`(`folio`),
    PRIMARY KEY (`ID_Requisicion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_ID_Departamento_fkey` FOREIGN KEY (`ID_Departamento`) REFERENCES `departamentos`(`ID_Departamento`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_ID_Puesto_fkey` FOREIGN KEY (`ID_Puesto`) REFERENCES `puestos`(`ID_Puesto`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_roles` ADD CONSTRAINT `usuario_roles_ID_Usuario_fkey` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuarios`(`ID_Usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_roles` ADD CONSTRAINT `usuario_roles_ID_Rol_fkey` FOREIGN KEY (`ID_Rol`) REFERENCES `roles`(`ID_Rol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aprobaciones` ADD CONSTRAINT `aprobaciones_ID_RF_fkey` FOREIGN KEY (`ID_RF`) REFERENCES `requisicion_flujo`(`ID_RF`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aprobaciones` ADD CONSTRAINT `aprobaciones_ID_FlujosPasos_fkey` FOREIGN KEY (`ID_FlujosPasos`) REFERENCES `flujos_pasos`(`ID_FlujosPasos`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aprobaciones` ADD CONSTRAINT `aprobaciones_aprobador_user_id_fkey` FOREIGN KEY (`aprobador_user_id`) REFERENCES `usuarios`(`ID_Usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `firmas_digitales` ADD CONSTRAINT `firmas_digitales_ID_Aprobacion_fkey` FOREIGN KEY (`ID_Aprobacion`) REFERENCES `aprobaciones`(`ID_Aprobacion`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flujos_pasos` ADD CONSTRAINT `flujos_pasos_ID_Flujo_fkey` FOREIGN KEY (`ID_Flujo`) REFERENCES `flujos`(`ID_Flujo`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flujos_pasos` ADD CONSTRAINT `flujos_pasos_ID_Rol_fkey` FOREIGN KEY (`ID_Rol`) REFERENCES `roles`(`ID_Rol`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flujos_pasos` ADD CONSTRAINT `flujos_pasos_ID_Puesto_fkey` FOREIGN KEY (`ID_Puesto`) REFERENCES `puestos`(`ID_Puesto`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flujos_pasos` ADD CONSTRAINT `flujos_pasos_ID_Departamento_fkey` FOREIGN KEY (`ID_Departamento`) REFERENCES `departamentos`(`ID_Departamento`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `funciones_principales` ADD CONSTRAINT `funciones_principales_requisicion_id_fkey` FOREIGN KEY (`requisicion_id`) REFERENCES `requisiciones`(`ID_Requisicion`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfil_conocimiento` ADD CONSTRAINT `perfil_conocimiento_Perfiles_Vacante_ID_Vacante_fkey` FOREIGN KEY (`Perfiles_Vacante_ID_Vacante`) REFERENCES `perfiles_vacante`(`ID_Vacante`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfil_conocimiento` ADD CONSTRAINT `perfil_conocimiento_Conocimientos_ID_Conocimiento_fkey` FOREIGN KEY (`Conocimientos_ID_Conocimiento`) REFERENCES `conocimientos`(`ID_Conocimiento`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfil_equiposm` ADD CONSTRAINT `perfil_equiposm_Perfiles_Vacante_ID_Vacante_fkey` FOREIGN KEY (`Perfiles_Vacante_ID_Vacante`) REFERENCES `perfiles_vacante`(`ID_Vacante`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfil_equiposm` ADD CONSTRAINT `perfil_equiposm_Equipos_Maquinaria_ID_EquiposM_fkey` FOREIGN KEY (`Equipos_Maquinaria_ID_EquiposM`) REFERENCES `equipos_maquinaria`(`ID_EquiposM`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfil_formacionesa` ADD CONSTRAINT `perfil_formacionesa_Perfiles_Vacante_ID_Vacante_fkey` FOREIGN KEY (`Perfiles_Vacante_ID_Vacante`) REFERENCES `perfiles_vacante`(`ID_Vacante`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfil_formacionesa` ADD CONSTRAINT `perfil_formacionesa_Formacion_Academica_ID_FormacionAcademi_fkey` FOREIGN KEY (`Formacion_Academica_ID_FormacionAcademica`) REFERENCES `formacion_academica`(`ID_FormacionAcademica`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfil_habilidadesi` ADD CONSTRAINT `perfil_habilidadesi_Perfiles_Vacante_ID_Vacante_fkey` FOREIGN KEY (`Perfiles_Vacante_ID_Vacante`) REFERENCES `perfiles_vacante`(`ID_Vacante`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfil_habilidadesi` ADD CONSTRAINT `perfil_habilidadesi_Habilidades_Informaticas_ID_Habilidad_fkey` FOREIGN KEY (`Habilidades_Informaticas_ID_Habilidad`) REFERENCES `habilidades_informaticas`(`ID_Habilidad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfil_idiomas` ADD CONSTRAINT `perfil_idiomas_Perfiles_Vacante_ID_Vacante_fkey` FOREIGN KEY (`Perfiles_Vacante_ID_Vacante`) REFERENCES `perfiles_vacante`(`ID_Vacante`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfil_idiomas` ADD CONSTRAINT `perfil_idiomas_Idiomas_ID_Idioma_fkey` FOREIGN KEY (`Idiomas_ID_Idioma`) REFERENCES `idiomas`(`ID_Idioma`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfil_plan_carrera` ADD CONSTRAINT `perfil_plan_carrera_Perfiles_Vacante_ID_Vacante_fkey` FOREIGN KEY (`Perfiles_Vacante_ID_Vacante`) REFERENCES `perfiles_vacante`(`ID_Vacante`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfil_plan_carrera` ADD CONSTRAINT `perfil_plan_carrera_ID_Puesto_fkey` FOREIGN KEY (`ID_Puesto`) REFERENCES `puestos`(`ID_Puesto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfil_rasgosp` ADD CONSTRAINT `perfil_rasgosp_Perfiles_Vacante_ID_Vacante_fkey` FOREIGN KEY (`Perfiles_Vacante_ID_Vacante`) REFERENCES `perfiles_vacante`(`ID_Vacante`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfil_rasgosp` ADD CONSTRAINT `perfil_rasgosp_Rasgos_Personalidad_ID_Rasgo_fkey` FOREIGN KEY (`Rasgos_Personalidad_ID_Rasgo`) REFERENCES `rasgos_personalidad`(`ID_Rasgo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfiles_vacante` ADD CONSTRAINT `perfiles_vacante_Requisiciones_ID_Requisicion_fkey` FOREIGN KEY (`Requisiciones_ID_Requisicion`) REFERENCES `requisiciones`(`ID_Requisicion`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `requisicion_flujo` ADD CONSTRAINT `requisicion_flujo_ID_Requisicion_fkey` FOREIGN KEY (`ID_Requisicion`) REFERENCES `requisiciones`(`ID_Requisicion`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `requisicion_flujo` ADD CONSTRAINT `requisicion_flujo_ID_Flujo_fkey` FOREIGN KEY (`ID_Flujo`) REFERENCES `flujos`(`ID_Flujo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `requisiciones` ADD CONSTRAINT `requisiciones_departamento_area_fkey` FOREIGN KEY (`departamento_area`) REFERENCES `departamentos`(`ID_Departamento`) ON DELETE RESTRICT ON UPDATE CASCADE;
