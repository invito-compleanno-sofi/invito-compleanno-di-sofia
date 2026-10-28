// =========================================================================================
// GOOGLE APPS SCRIPT PER IL FOGLIO GOOGLE DI SOFIA
// Foglio collegato: https://docs.google.com/spreadsheets/d/1xBK6YMW120YQ6AJDF6sALsAgM0srQnbQUYMM---PgIk/edit
// =========================================================================================
// ISTRUZIONI DI ATTIVAZIONE (richiede 1 minuto):
// 1. Apri il tuo foglio Google: https://docs.google.com/spreadsheets/d/1xBK6YMW120YQ6AJDF6sALsAgM0srQnbQUYMM---PgIk/edit
// 2. Nel menu in alto clicca su: Estensioni -> Apps Script
// 3. Cancella tutto il codice presente e INCOLLA questo file per intero
// 4. Clicca sul pulsante blu in alto a destra: "Distribuisci" -> "Nuova distribuzione"
// 5. Clicca sull'icona dell'ingranaggio accanto a "Seleziona tipo" e scegli "Applicazione web"
//    - Descrizione: Invito 18 Sofia
//    - Esegui come: "Utente corrente" (Me)
//    - Chi ha accesso: "Chiunque" (Anyone) -> (Consente la ricezione delle conferme mantenendo il foglio 100% PRIVATO solo a te!)
// 6. Clicca su "Distribuisci" e autorizza l'accesso se richiesto
// 7. Copia l'URL dell'applicazione web fornito (es. https://script.google.com/macros/s/.../exec)
// =========================================================================================

var SPREADSHEET_ID = "1xBK6YMW120YQ6AJDF6sALsAgM0srQnbQUYMM---PgIk";

function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheets()[0];
    
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }
    
    var nome = (data.nome || "").trim();
    var cognome = (data.cognome || "").trim();
    
    // Presenza: ESCLUSIVAMENTE "Sì" oppure "No"
    var presenza = (data.attendance === "yes" || data.presenza === "Sì" || data.presenza === "Si") ? "Sì" : "No";
    
    // Intolleranze
    var hasIntol = (data.hasIntolerance === true || data.hasIntolerance === "true" || data.intolleranze === "Sì" || data.intolleranze === "Si");
    var specificato = (data.tipoIntolleranza || data.dettaglioIntolleranze || data.intolleranzeDettaglio || "").trim();
    if (!specificato && data.intolleranze && data.intolleranze !== "Sì" && data.intolleranze !== "Si" && data.intolleranze !== "No") {
      specificato = data.intolleranze.trim();
    }
    if (specificato && specificato.toLowerCase() !== "no" && specificato.toLowerCase() !== "nessuna") {
      hasIntol = true;
    }

    // Tipo di intolleranza: scrive il tipo effettivo (es. "Celiachia", "Lattosio") oppure "No" se non ne ha
    var tipoIntolleranza = hasIntol ? (specificato || "Sì") : "No";
    var intolleranzeSiNo = hasIntol ? "Sì" : "No";
    
    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "Europe/Rome", "dd/MM/yyyy HH:mm:ss");
    
    // Scrive a partire dalla RIGA 2 (lasciando la riga 1 per i titoli)
    var lastRow = sheet.getLastRow();
    var targetRow = Math.max(2, lastRow + 1);
    
    // Leggi le intestazioni della riga 1 per abbinare le colonne esatte del tuo foglio
    var numCols = Math.max(5, sheet.getLastColumn());
    var headers = sheet.getRange(1, 1, 1, numCols).getValues()[0];
    
    // Verifica se nel foglio esiste una colonna separata esplicitamente per il tipo/dettagli
    var hasSeparateTipoCol = false;
    for (var k = 0; k < headers.length; k++) {
      var headerStr = String(headers[k]).toLowerCase().trim();
      if (headerStr.indexOf("tipo") !== -1 || headerStr.indexOf("quali") !== -1 || headerStr.indexOf("dettagl") !== -1 || headerStr.indexOf("specific") !== -1) {
        hasSeparateTipoCol = true;
        break;
      }
    }
    
    var rowValues = [];
    var mapped = false;
    
    if (headers && headers.length > 0 && headers[0] !== "") {
      mapped = true;
      for (var i = 0; i < headers.length; i++) {
        var h = String(headers[i]).toLowerCase().trim();
        if (h.indexOf("cognome") !== -1) {
          rowValues.push(cognome);
        } else if (h.indexOf("nome e cognome") !== -1 || h.indexOf("invitato") !== -1) {
          rowValues.push(nome + " " + cognome);
        } else if (h.indexOf("nome") !== -1) {
          rowValues.push(nome);
        } else if (h.indexOf("presenz") !== -1 || h.indexOf("partecip") !== -1) {
          rowValues.push(presenza); // Solo "Sì" o "No"
        } else if (h.indexOf("tipo") !== -1 || h.indexOf("quali") !== -1 || h.indexOf("dettagli") !== -1 || h.indexOf("note") !== -1 || h.indexOf("specific") !== -1) {
          // Colonna Tipo di Intolleranza -> scrive il tipo esatto (es. "Celiachia", "Lattosio" oppure "No")
          rowValues.push(tipoIntolleranza);
        } else if (h.indexOf("intolleran") !== -1 || h.indexOf("allerg") !== -1) {
          if (hasSeparateTipoCol) {
            rowValues.push(intolleranzeSiNo); // Solo "Sì" o "No" se c'è una colonna separata per il tipo
          } else {
            rowValues.push(tipoIntolleranza); // Altrimenti scrive direttamente il tipo (es. "Celiachia" o "No")
          }
        } else if (h.indexOf("data") !== -1 || h.indexOf("ora") !== -1 || h.indexOf("orario") !== -1) {
          rowValues.push(timestamp);
        } else {
          rowValues.push("");
        }
      }
    }
    
    // Se le colonne non avevano intestazioni riconosciute, usa l'ordine standard pulito:
    // Col 1: Nome | Col 2: Cognome | Col 3: Presenza (Sì/No) | Col 4: Tipo di Intolleranza (es. Celiachia o No) | Col 5: Data Registrazione
    if (!mapped || rowValues.every(function(v) { return v === ""; })) {
      rowValues = [
        nome,
        cognome,
        presenza,              // "Sì" o "No"
        tipoIntolleranza,      // es. "Celiachia" oppure "No"
        timestamp
      ];
    }
    
    // Scrive la riga a partire dalla riga 2
    sheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", row: targetRow }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Servizio Google Sheet di Sofia attivo e collegato al foglio!")
    .setMimeType(ContentService.MimeType.TEXT);
}
