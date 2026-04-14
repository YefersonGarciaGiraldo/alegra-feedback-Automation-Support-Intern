/**
 * @fileoverview Middleware de integración entre Interfaz Web, Google Sheets y Google AI (Gemini).
 * Optimizado para la persistencia de feedback y análisis de sentimiento automatizado.
 * * Desarrollado para: Reto Técnico - Yeferson Alexander García
 */

// Configuración de constantes globales
const GEMINI_API_KEY = "AIzaSyD-aKZRTpoHOHYahsObJV61iOIRuNreEEc";
const SPREADSHEET_ID = "1-qOZWX3HALZoLntDld7zwHBFnrk_T08nlGG8pBY_2qA";
const SHEET_NAME = "Feedback_Reto_Tecnico_Alegra";

/**
 * Gestiona las solicitudes GET para la navegación de la Web App.
 * Permite el renderizado dinámico de múltiples vistas (Formulario y Métricas).
 * * @param {Object} e Evento de solicitud que contiene los parámetros de la URL.
 * @return {HtmlOutput} Contenido HTML evaluado para su visualización.
 */
function doGet(e) {
  // Extraer el parámetro 'page' para determinar la ruta de navegación
  var page = e.parameter.page;
  
  // RUTA POR DEFECTO: Interfaz de Recolección de Feedback
  if (!page || page == 'index') {
    return HtmlService.createTemplateFromFile('index')
        .evaluate()
        .setTitle('Feedback Alegra | Captura de Datos')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } 
  
  // RUTA ADMINISTRATIVA: Panel de Métricas y Analítica (Looker Studio)
  else if (page == 'metrics') {
    return HtmlService.createTemplateFromFile('Metrics')
        .evaluate()
        .setTitle('Admin Metrics | Dashboard Alegra')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

/**
 * Endpoint principal para la recepción de solicitudes POST.
 * Coordina la lógica de negocio y la persistencia en el dataset.
 * * @param {Object} e Objeto de evento con los metadatos de la solicitud.
 * @return {ContentService.TextOutput} Respuesta JSON estandarizada.
 */
function doPost(e) {
  try {
    // Verificación de integridad del payload de entrada
    if (!e || !e.postData) {
      throw new Error("Solicitud malformada: No se detectó el cuerpo del mensaje.");
    }

    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    // Parámetros por defecto para el procesamiento cognitivo
    let sentimiento = "Pendiente de Análisis";
    let resumen = "Servicio no disponible";

    // Aislamiento del proceso de IA para evitar interrupciones en el flujo de datos principal
    try {
      const iaResult = analizarConGemini(data.comentario);
      sentimiento = iaResult.sentimiento || "Indefinido";
      resumen = iaResult.resumen || "Análisis no generado";
    } catch (iaError) {
      console.error("Excepción en capa de IA: " + iaError.toString());
      sentimiento = "Fallo de Integración";
      resumen = "Log técnico: " + iaError.toString().substring(0, 50);
    }

    // Estructuración de la fila para persistencia (Trazabilidad completa)
    const row = [
      new Date(),                      // Auditoría temporal
      data.producto || "N/A",          // Entidad afectada
      data.comentario || "",           // Feedback original
      data.nombre || "Anónimo",        // Autoría
      sentimiento,                     // Resultado de clasificación
      resumen                          // Síntesis ejecutiva
    ];

    // Escritura atómica en el dataset
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      "status": "success",
      "message": "Datos registrados exitosamente"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Gestión de fallos críticos de infraestructura
    console.error("Error crítico en doPost: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": "Fallo interno en la persistencia de datos"
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Conector técnico con el modelo Gemini 3 Flash.
 * Implementa autenticación vía cabeceras HTTP y saneamiento de buffer JSON.
 * * @param {string} texto El contenido textual a procesar.
 * @return {Object} Objeto estructurado con los atributos analizados.
 * @throws {Error} En caso de respuesta inválida o error de API.
 */
function analizarConGemini(texto) {
  // Endpoint v1beta actualizado según estándares de 2026
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';

  // Ingeniería de prompt para respuesta determinística
  const payload = {
    "contents": [{
      "parts": [{
        "text": "Analiza el sentimiento de este comentario: '" + texto + "'. Responde estrictamente en formato JSON con llaves 'sentimiento' (Positivo, Neutro o Negativo) y 'resumen' (máximo 10 palabras). No incluyas texto explicativo adicional."
      }]
    }]
  };

  const options = {
    "method": "post",
    "contentType": "application/json",
    "headers": {
      "x-goog-api-key": GEMINI_API_KEY // Autenticación por Header según documentación oficial
    },
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  // Ejecución de la solicitud HTTP
  const response = UrlFetchApp.fetch(url, options);
  const responseText = response.getContentText();
  const resJson = JSON.parse(responseText);

  // Validación de la integridad de la respuesta del proveedor
  if (resJson.error) {
    throw new Error("Google API: " + resJson.error.message);
  }

  if (resJson.candidates && resJson.candidates.length > 0) {
    let rawContent = resJson.candidates[0].content.parts[0].text;
    
    // Saneamiento de la cadena: Eliminación de bloques markdown y caracteres de escape
    const cleanJson = rawContent.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } else {
    throw new Error("El modelo no retornó candidatos válidos.");
  }
}