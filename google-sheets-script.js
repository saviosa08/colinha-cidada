/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT - Coleta Silenciosa de Métricas da Colinha Lelo Couto
 * ==============================================================================
 * 
 * CABEÇALHOS DA SUA PLANILHA (Linha 1):
 * Coluna A: ID
 * Coluna B: Data/Hora
 * Coluna C: Ação (Download ou WhatsApp)
 * Coluna D: Deputado Federal
 * Coluna E: Deputado Estadual
 * Coluna F: Senador 1
 * Coluna G: Senador 2
 * Coluna H: Governador
 * Coluna I: Presidente
 * Coluna J: Dispositivo
 * 
 * ------------------------------------------------------------------------------
 */

// Se você criou o script pelo link https://script.google.com/home/start, coloque o ID da planilha abaixo:
var SPREADSHEET_ID = '1lF8_5VZXCAtx3kcrCmoV1AQUg6oMRMlr_I5deeZfOzc'; 

function doPost(e) {
  try {
    var sheet;
    if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== '') {
      sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    } else {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    }
    
    var data = JSON.parse(e.postData.contents);
    
    // Insere os dados na próxima linha da planilha
    sheet.appendRow([
      data.id || '',
      data.dataHoraFormatada || data.timestamp || new Date(),
      data.acao || 'Download', // 'Download' ou 'WhatsApp'
      data.deputadoFederal || '',
      data.deputadoEstadual || '',
      data.senador1 || '',
      data.senador2 || '',
      data.governador || '',
      data.presidente || '',
      data.dispositivo || ''
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Webhook de Métricas da Colinha Lelo Couto Ativo.");
}
