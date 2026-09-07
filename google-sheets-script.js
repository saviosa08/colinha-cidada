/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT - Coleta Silenciosa de Métricas da Colinha Lelo Couto
 * ==============================================================================
 * 
 * Este script recebe os dados em segundo plano sempre que alguém clica em
 * "Baixar Santinho" e insere uma nova linha na sua Planilha Google.
 * 
 * ------------------------------------------------------------------------------
 * COMO RESOLVER O ERRO "NÃO FOI POSSÍVEL ABRIR O ARQUIVO" NO GOOGLE DRIVE:
 * Esse erro ocorre quando você possui mais de uma conta Google logada no navegador
 * ao mesmo tempo.
 * 
 * Siga uma das duas opções abaixo para criar sem erro:
 * 
 * OPÇÃO A (Recomendada - Direto pelo Apps Script):
 * 1. Abra o link: https://script.google.com/home/start (de preferência em Janela Anônima)
 * 2. Clique no botão "+ Novo projeto".
 * 3. Apague o código padrão e cole o código deste arquivo.
 * 4. Na linha 39 abaixo, cole o ID da sua planilha onde diz 'COLE_AQUI_O_ID_DA_SUA_PLANILHA'
 *    (O ID é o código longo na URL da planilha: docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit)
 * 5. Clique em "Implantar" (Deploy) > "Nova implantação".
 * 6. Tipo: "App da Web" (Web App).
 * 7. Executar como: "Eu", Quem pode acessar: "Qualquer pessoa" (Anyone).
 * 8. Clique em "Implantar", copie a "URL do app da Web" gerada.
 * 9. Cole essa URL no arquivo `assets/js/config.js` na propriedade `metricsWebhookUrl`.
 * 
 * OPÇÃO B (Pelo menu da Planilha):
 * 1. Abra uma Janela Anônima no navegador (Ctrl + Shift + N).
 * 2. Faça login apenas na sua conta Google.
 * 3. Abra a Planilha > Extensões > Apps Script.
 * 4. Cole este código e faça a implantação como App da Web.
 * ------------------------------------------------------------------------------
 */

// Se você criar o script como projeto independente (Opção A), coloque o ID da planilha abaixo.
// Se criar direto pelo menu da planilha (Opção B), pode deixar vazio ''.
var SPREADSHEET_ID = ''; 

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
