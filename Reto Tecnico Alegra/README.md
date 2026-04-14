# DOCUMENTACIÓN TÉCNICA: SISTEMA DE FEEDBACK INTELIGENTE - ALEGRA

* ========================================================================
* DATOS DEL CANDIDATO:
* - Nombre: Yeferson Alexander García Giraldo
* - Rol: Automation Support Intern (Aprendiz SENA)
* - Contacto: yeffergarciagi4@gmail.com | 311 384 5892
* ========================================================================

* ------------------------------------------------------------------------
* 1. DESCRIPCIÓN GENERAL
* ------------------------------------------------------------------------
* Solución integral desarrollada para capturar, procesar y analizar el 
* feedback de los usuarios de Alegra POS, Contabilidad y Nómina. 
* El sistema utiliza Inteligencia Artificial para automatizar la 
* clasificación de datos y mejorar la toma de decisiones.

* ------------------------------------------------------------------------
* 2. ARQUITECTURA Y DESPLIEGUE (ENTORNO CLOUD)
* ------------------------------------------------------------------------
* Este proyecto está diseñado para ejecutarse nativamente en Google Apps Script.
* El código fuente presente en este repositorio es una representación fiel
* de los archivos alojados en la nube.
*
* NOTA TÉCNICA: Se utiliza la metodología de Scriptlets de GAS (<?!= ... ?>)
* para la inyección de estilos y modularización del HTML, asegurando una
* estructura limpia y mantenible dentro del servidor de aplicaciones.

* ------------------------------------------------------------------------
* 3. ENLACES DEL PROYECTO
* ------------------------------------------------------------------------

* - Demo en Vivo (Web App): https://script.google.com/macros/s/AKfycbxzYLFVtmfKLroya7Pz-pUhu6yJNgCbyZIi6hPlL820AGTyMpk2UtRc3KAki8H9rxkW/exec

* - Panel de Métricas (Looker Studio): https://datastudio.google.com/s/lARerELLAWM

* - Dataset (Google Sheets): https://docs.google.com/spreadsheets/d/1-qOZWX3HALZoLntDld7zwHBFnrk_T08nlGG8pBY_2qA/edit?usp=sharing

* ------------------------------------------------------------------------
* 4. COMPONENTES DEL SISTEMA
* ------------------------------------------------------------------------
* A. INTERFAZ DE CAPTURA (Frontend):
* - Web App responsiva construida con HTML5 y Tailwind CSS.
* - Validación de campos obligatorios y gestión de estados de carga.
*
* B. PROCESAMIENTO COGNITIVO (Gemini AI):
* - Integración con el modelo Gemini 3 Flash.
* - Prompt Engineering: Respuesta en formato JSON determinístico para
* garantizar la estabilidad del procesamiento de datos.
*
* C. PERSISTENCIA DE DATOS (Backend):
* - Google Sheets como base de datos centralizada para el registro histórico.
*
* D. ANALÍTICA (Looker Studio):
* - Dashboard interactivo con filtros por fecha, producto y sentimiento.

* ------------------------------------------------------------------------
* 5. SEGURIDAD Y BUENAS PRÁCTICAS
* ------------------------------------------------------------------------
* - GESTIÓN DE CREDENCIALES: Para propósitos de esta evaluación, la 
* API Key se encuentra declarada como constante global. En entornos 
* productivos se recomienda el uso de 'PropertiesService' para el 
* manejo seguro de variables de entorno.
*
* - AISLAMIENTO DE PROCESOS: La llamada a la API de IA está encapsulada 
* en bloques Try-Catch. Si el servicio de IA falla, el feedback se registra 
* igualmente para evitar pérdida de información crítica, marcando el 
* análisis como "Pendiente".

* ------------------------------------------------------------------------
* 6. INSTRUCCIONES DE INSTALACIÓN (REPLICACIÓN)
* ------------------------------------------------------------------------
* 1. Crear un nuevo proyecto en Google Apps Script.
* 2. Replicar la estructura de archivos de este repositorio:
* - Codigo.js -> (Renombrar a Codigo.gs en el editor de Apps Script)
* - index.html
* - Metrics.html
* - Estilos.html
* 3. Configurar la API Key de Gemini en la constante GEMINI_API_KEY.
* 4. Implementar como "Aplicación Web" (Configuración: Ejecutar como "Yo" 
* y Acceso para "Cualquier persona").

* ------------------------------------------------------------------------
* 7. DECISIONES DE DISEÑO
* ------------------------------------------------------------------------
* - Se eligió Gemini 3 Flash por su baja latencia y alta eficiencia en 
* tareas de clasificación y síntesis de texto.
* - La interfaz utiliza un estilo visual alineado a la identidad de marca
* de Alegra, priorizando la usabilidad y la tipografía Inter.

* ========================================================================
* Fin de la Documentación - Abril 2026
* ========================================================================