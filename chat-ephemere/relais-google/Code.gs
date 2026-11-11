/**
 * You & Me — relais Google Apps Script, stockage dans une Google Sheet.
 *
 * Installation : voir relais-google/README.md.
 *
 * Le script ne voit jamais de texte en clair : les messages arrivent déjà
 * chiffrés (AES-GCM) par le navigateur. Il les garde dans la feuille
 * « messages » jusqu'à leur remise au destinataire, puis les supprime ;
 * tout message non remis est supprimé au bout de 30 secondes.
 */

var DUREE_MESSAGE_MS = 30000; // durée de vie maximale d'un message non remis
var DUREE_PRESENCE_MS = 15000; // un client silencieux plus longtemps est considéré parti
var MAX_CHIFFRE = 16000; // taille maximale d'un message chiffré (caractères)
var MAX_ENVOIS = 10; // messages acceptés par requête
var MAX_LIGNES = 2000; // garde-fou contre le remplissage de la feuille

var RE_SALON = /^[0-9a-f]{32}$/;
var RE_CLIENT = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
var RE_CHIFFRE = /^[A-Za-z0-9+\/]+=*$/;

function doPost(e) {
  var reponse;
  try {
    reponse = traiter(JSON.parse(e.postData.contents));
  } catch (err) {
    reponse = {erreur: 'requete'};
  }
  return ContentService.createTextOutput(JSON.stringify(reponse)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doGet() {
  return ContentService.createTextOutput('You & Me : relais actif.');
}

/** À lancer une fois à la main : crée les feuilles et le nettoyage chaque minute. */
function installer() {
  feuille('presence');
  feuille('messages');
  ScriptApp.getProjectTriggers().forEach(function (d) {
    if (d.getHandlerFunction() === 'nettoyer') ScriptApp.deleteTrigger(d);
  });
  ScriptApp.newTrigger('nettoyer').timeBased().everyMinutes(1).create();
}

/** Filet de sécurité : supprime ce qui a expiré même si plus personne n'interroge le relais. */
function nettoyer() {
  var verrou = LockService.getScriptLock();
  verrou.waitLock(10000);
  try {
    var maintenant = Date.now();
    var fp = feuille('presence');
    var fm = feuille('messages');
    ecrire(fp, presenceValide(lire(fp, 3), maintenant), 3);
    ecrire(fm, messagesValides(lire(fm, 5), maintenant), 5);
  } finally {
    verrou.releaseLock();
  }
}

function traiter(req) {
  if (!req || !RE_SALON.test(req.salon) || !RE_CLIENT.test(req.moi)) {
    return {erreur: 'requete'};
  }

  // Préfixes : empêchent Sheets de convertir un identifiant en nombre.
  var salon = 's' + req.salon;
  var moi = 'c' + req.moi;

  var verrou = LockService.getScriptLock();
  verrou.waitLock(10000);

  try {
    var maintenant = Date.now();
    var fp = feuille('presence');
    var fm = feuille('messages');

    // Colonnes — presence : salon, client, vu ; messages : salon, de, pour, chiffre, date.
    var presence = presenceValide(lire(fp, 3), maintenant).filter(function (l) {
      return !(l[0] === salon && l[1] === moi);
    });
    var messages = messagesValides(lire(fm, 5), maintenant);

    if (req.quitter) {
      messages = messages.filter(function (l) {
        return !(l[0] === salon && (l[1] === moi || l[2] === moi));
      });
      ecrire(fp, presence, 3);
      ecrire(fm, messages, 5);
      return {ok: true};
    }

    var autres = presence
      .filter(function (l) {
        return l[0] === salon;
      })
      .map(function (l) {
        return l[1];
      });

    // Deux personnes au plus par salon : la troisième n'est pas inscrite
    // et ne reçoit rien.
    if (autres.length >= 2) {
      ecrire(fp, presence, 3);
      ecrire(fm, messages, 5);
      return {complet: true};
    }

    presence.push([salon, moi, maintenant]);

    var envois = Array.isArray(req.envois) ? req.envois.slice(0, MAX_ENVOIS) : [];
    envois.forEach(function (m) {
      if (!m || !RE_CLIENT.test(m.pour) || typeof m.c !== 'string') return;
      if (m.c.length > MAX_CHIFFRE || !RE_CHIFFRE.test(m.c)) return;
      if (autres.indexOf('c' + m.pour) === -1) return; // destinataire absent
      if (messages.length >= MAX_LIGNES) return;
      messages.push([salon, moi, 'c' + m.pour, 'm' + m.c, maintenant]);
    });

    // Remise : ce qui m'est destiné est renvoyé puis retiré de la feuille.
    var recus = [];
    messages = messages.filter(function (l) {
      if (l[0] === salon && l[2] === moi) {
        recus.push({de: l[1].slice(1), c: l[3].slice(1)});
        return false;
      }
      return true;
    });

    ecrire(fp, presence, 3);
    ecrire(fm, messages, 5);

    return {
      pairs: autres.map(function (c) {
        return c.slice(1);
      }),
      messages: recus
    };
  } finally {
    verrou.releaseLock();
  }
}

function presenceValide(lignes, maintenant) {
  return lignes.filter(function (l) {
    return maintenant - Number(l[2]) < DUREE_PRESENCE_MS;
  });
}

function messagesValides(lignes, maintenant) {
  return lignes.filter(function (l) {
    return maintenant - Number(l[4]) < DUREE_MESSAGE_MS;
  });
}

function feuille(nom) {
  var classeur = SpreadsheetApp.getActiveSpreadsheet();
  return classeur.getSheetByName(nom) || classeur.insertSheet(nom);
}

function lire(f, largeur) {
  var n = f.getLastRow();
  if (!n) return [];
  return f
    .getRange(1, 1, n, largeur)
    .getValues()
    .map(function (l) {
      return l.map(function (v, i) {
        return i === largeur - 1 ? Number(v) : String(v);
      });
    });
}

function ecrire(f, lignes, largeur) {
  f.clearContents();
  if (lignes.length) f.getRange(1, 1, lignes.length, largeur).setValues(lignes);
}
