/*** BOOK MY KIDDUSH - BACKEND SCRIPT
 *
 * IMPORTANT: After saving this code, you MUST:
 * 1. Run the "doGet" function manually in the editor once to trigger the permissions prompt.
 * 2. Accept all permissions (including Gmail).
 * 3. Deploy > Manage deployments > pencil (Edit) > Version: "New version" > Deploy.
 *    (Edit the EXISTING deployment so the web app URL stays the same.)
 */

// CORRECTED ID FROM YOUR URL
const SHEET_ID = '1rr3mXepvQA4hEjri5ASmOglTFZ2oUI2d9DBvx-syFzE';
const SHEET_NAME = 'Bookings';
const SCRIPT_TZ = 'Europe/London';
const OFFICE_EMAIL = 'office@hwjc.org.uk';
const FROM_ALIAS = 'noreplyhwhc@gmail.com';
const ETHAN_EMAIL = 'ethansamuelross@gmail.com';

// ========= HANDLE PREFLIGHT (OPTIONS) =========
function doOptions(e) {
  return createCorsResponse({});
}

// ========= GET BOOKINGS =========
function doGet(e) {
  // This dummy log helps trigger permissions when run manually
  console.log("Checking permissions...");

  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) return createCorsResponse([]);

    var last = sheet.getLastRow();
    if (last <= 1) return createCorsResponse([]);

    var dateCells = sheet.getRange(2, 1, last - 1, 1).getValues();
    var bookings = [];

    for (var i = 0; i < dateCells.length; i++) {
      var cellValue = dateCells[i][0];
      if (cellValue === null || cellValue === undefined || String(cellValue).trim() === '') continue;
      var iso = normalizeToIso_(cellValue);
      if (iso) bookings.push({ date: iso });
    }

    return createCorsResponse(bookings);

  } catch (err) {
    console.error("doGet failed:", err);
    return createCorsResponse({ status: "error", message: String(err) });
  }
}

// ========= CREATE BOOKING =========
function doPost(e) {
  try {
    // 1. Parse Data
    var jsonString = e.postData ? e.postData.contents : '{}';
    var payload = JSON.parse(jsonString);
    var iso = String(payload.date || '').trim();
    var email = String(payload.email || '').trim().toLowerCase();

    if (!iso) {
      return createCorsResponse({ status: "error", message: "Missing date" });
    }

    // 2. Lock / Concurrency Check (Basic)
    var lock = LockService.getScriptLock();
    // Wait up to 10 seconds for other reservations to finish
    if (!lock.tryLock(10000)) {
      return createCorsResponse({ status: "error", message: "System busy, please try again." });
    }

    try {
      var sheet = getOrCreateSheet_();
      var last = sheet.getLastRow();

      // 3. Double Check Availability
      //    If the SAME person (same email) already holds this date, the browser has
      //    simply re-sent the booking. Treat that as success and do not email again.
      if (last > 1) {
        var rows = sheet.getRange(2, 1, last - 1, 3).getValues(); // date, name, email
        for (var i = 0; i < rows.length; i++) {
          var cellValue = rows[i][0];
          if (cellValue && normalizeToIso_(cellValue) === iso) {
            var existingEmail = String(rows[i][2] || '').trim().toLowerCase();
            if (email && existingEmail === email) {
              return createCorsResponse({ status: "success", duplicate: true });
            }
            return createCorsResponse({ status: "error", message: "Date was just taken by someone else." });
          }
        }
      }

      // 4. Save to Sheet
      sheet.appendRow([
        iso,
        payload.name || '',
        payload.email || '',
        payload.amount || '',
        payload.dedication || '',
        "Hadley Wood Shul",
        new Date() // Timestamp of booking
      ]);

      // Sort by date (column 1)
      var newLast = sheet.getLastRow();
      if (newLast > 2) {
        sheet.getRange(2, 1, newLast - 1, 7).sort({ column: 1, ascending: true });
      }

    } finally {
      lock.releaseLock();
    }

    // 5. Send Emails (Outside the lock to be faster)
    try {
      var parts = iso.split('-');
      var y = parseInt(parts[0], 10);
      var m = parseInt(parts[1], 10);
      var d = parseInt(parts[2], 10);
      var pretty = Utilities.formatDate(new Date(y, m - 1, d, 12), SCRIPT_TZ, 'EEEE d MMMM yyyy');

      var amt = payload.amount
        ? (String(payload.amount).indexOf("To be") === 0 ? payload.amount : '£' + payload.amount)
        : 'Standard';

      sendEmails_({
        iso: iso,
        pretty: pretty,
        amt: amt,
        fullName: payload.name || 'Guest',
        userEmail: payload.email || '',
        dedication: payload.dedication || ''
      });
    } catch (emailErr) {
      console.error("Email sending failed, but booking was saved: " + emailErr);
      // We still return success because the booking IS saved.
    }

    return createCorsResponse({ status: "success" });

  } catch (err) {
    console.error("doPost failed:", err);
    return createCorsResponse({ status: "error", message: String(err) });
  }
}

// ========= CORS RESPONSE =========
function createCorsResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ========= SEND EMAILS =========
function sendEmails_(opts) {
  var pretty = opts.pretty;
  var amt = opts.amt;
  var fullName = opts.fullName;
  var userEmail = opts.userEmail;
  var dedication = opts.dedication;

  // Validate Alias Existence
  var aliases = GmailApp.getAliases();
  var fromAddress = null; // Default to the script owner's email

  // Only use the alias if we actually have permission to send as it
  if (aliases.includes(FROM_ALIAS)) {
    fromAddress = FROM_ALIAS;
  } else {
    console.warn("Alias " + FROM_ALIAS + " not found in this account. Sending as default user.");
  }

  var bookerBody =
    '<div style="font-family: sans-serif; color: #333;">' +
    '<h2>Kiddush Booking Confirmation</h2>' +
    '<p>Hello ' + fullName + ',</p>' +
    '<p>You have successfully booked your Kiddush for <strong>' + pretty + '</strong> at Hadley Wood Synagogue.</p>' +
    '<p><strong>Package:</strong> ' + amt + '</p>' +
    '<p>If any details are incorrect, please contact the Shul office at <a href="mailto:' + OFFICE_EMAIL + '">' + OFFICE_EMAIL + '</a>.</p>' +
    '<br><p>Kind regards,<br>Hadley Wood Synagogue</p>' +
    '</div>';

  var officeBody =
    '<div style="font-family: sans-serif; color: #333;">' +
    '<h2>New Kiddush Booking</h2>' +
    '<p><strong>Date:</strong> ' + pretty + '</p>' +
    '<p><strong>Booked by:</strong> ' + fullName + ' (' + userEmail + ')</p>' +
    '<p><strong>Package:</strong> ' + amt + '</p>' +
    '<p><strong>Dedication:</strong> ' + (dedication || 'None') + '</p>' +
    '</div>';

  // Helper to send safely
  var sendSafe = function(to, subject, html, replyTo) {
    if (!to || to.indexOf("@") === -1) return;
    var options = {
      htmlBody: html,
      name: "Book My Kiddush"
    };
    if (replyTo) options.replyTo = replyTo;
    if (fromAddress) options.from = fromAddress;

    GmailApp.sendEmail(to, subject, "Please enable HTML email to view this message.", options);
  };

  // 1. Send to Booker
  try {
    sendSafe(userEmail, "Kiddush Booking Confirmation – " + pretty, bookerBody, OFFICE_EMAIL);
  } catch (e) { console.error("Error sending to booker: " + e); }

  // 2. Send to Office
  try {
    sendSafe(OFFICE_EMAIL, "New Kiddush Booking – " + pretty, officeBody, userEmail);
  } catch (e) { console.error("Error sending to office: " + e); }

  // 3. Send to Ethan
  try {
    sendSafe(ETHAN_EMAIL, "[COPY] New Kiddush – " + pretty, officeBody, userEmail);
  } catch (e) { console.error("Error sending to Ethan: " + e); }
}

// ========= HELPERS =========
function getOrCreateSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['date', 'name', 'email', 'amount', 'dedication', 'synagogue', 'timestamp']);
  }
  return sheet;
}

function normalizeToIso_(val) {
  if (val === null || val === undefined) return '';
  if (val instanceof Date && !isNaN(val.getTime())) {
    return Utilities.formatDate(val, SCRIPT_TZ, 'yyyy-MM-dd');
  }
  var s = String(val).trim();
  if (!s) return '';
  if (s.charAt(0) === "'") s = s.substring(1).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (s.length > 10 && s.charAt(10) === 'T') return s.substring(0, 10);

  var m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    var dd = m[1].length === 1 ? '0' + m[1] : m[1];
    var mm = m[2].length === 1 ? '0' + m[2] : m[2];
    var yyyy = m[3];
    return yyyy + '-' + mm + '-' + dd;
  }
  return '';
}

// ========= RUN THIS TO AUTHORIZE GMAIL =========
function authorizeScript() {
  console.log("Checking Sheet access...");
  SpreadsheetApp.openById(SHEET_ID);

  console.log("Checking Gmail access...");
  var aliases = GmailApp.getAliases(); // This forces the Gmail permission prompt

  console.log("All permissions granted successfully!");
}
