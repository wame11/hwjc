/* Shabbat and Yom Tov screen
   Closes the site from candle lighting (18 minutes before sunset) until
   nightfall (sun 8.5 degrees below the horizon), calculated for Hadley Wood.
   Yom Tov dates (diaspora) are built in for 2026-2032.
   Preview any time with ?preview=shabbat or ?preview=yomtov */
(function () {
  "use strict";

  var YOMTOV = {"2026-04-02":"Pesach","2026-04-03":"Pesach","2026-04-08":"Pesach","2026-04-09":"Pesach","2026-05-22":"Shavuot","2026-05-23":"Shavuot","2026-09-12":"Rosh Hashanah","2026-09-13":"Rosh Hashanah","2026-09-14":"Rosh Hashanah","2026-09-15":"Rosh Hashanah","2026-11-28":"Yom Kippur","2026-11-29":"Yom Kippur","2026-12-01":"Sukkot","2026-12-02":"Sukkot","2026-12-03":"Sukkot","2026-12-04":"Sukkot","2026-12-05":"Sukkot","2026-12-06":"Sukkot","2026-12-07":"Sukkot","2026-12-08":"Sukkot","2026-12-09":"Sukkot","2026-12-10":"Sukkot","2026-12-11":"Sukkot","2026-12-12":"Sukkot","2026-12-13":"Sukkot","2026-12-14":"Sukkot","2026-12-15":"Sukkot","2026-12-16":"Sukkot","2026-12-17":"Sukkot","2026-12-18":"Sukkot","2026-12-19":"Sukkot","2026-12-20":"Sukkot","2026-12-21":"Sukkot","2027-01-03":"Shmini Atzeret","2027-01-04":"Simchat Torah","2027-01-05":"Simchat Torah","2027-02-18":"Tu B'Shvat","2027-03-18":"Purim","2027-03-19":"Purim","2027-04-01":"Pesach","2027-04-02":"Pesach","2027-04-03":"Pesach","2027-04-04":"Pesach","2027-04-05":"Pesach","2027-04-06":"Pesach","2027-04-07":"Pesach","2027-04-08":"Pesach","2027-04-09":"Pesach","2027-05-11":"Shavuot","2027-05-12":"Shavuot","2027-09-02":"Rosh Hashanah","2027-09-03":"Rosh Hashanah","2027-09-04":"Rosh Hashanah","2027-09-05":"Rosh Hashanah","2027-09-22":"Yom Kippur","2027-09-23":"Yom Kippur","2027-09-25":"Sukkot","2027-09-26":"Sukkot","2027-09-27":"Sukkot","2027-09-28":"Sukkot","2027-09-29":"Sukkot","2027-09-30":"Sukkot","2027-10-01":"Sukkot","2027-10-02":"Sukkot","2027-10-03":"Sukkot","2027-10-04":"Sukkot","2027-10-05":"Sukkot","2027-10-06":"Sukkot","2027-10-07":"Sukkot","2027-10-08":"Sukkot","2027-10-09":"Sukkot","2027-10-10":"Sukkot","2027-10-11":"Sukkot","2027-10-12":"Sukkot","2027-10-13":"Sukkot","2027-10-14":"Sukkot","2027-10-15":"Sukkot","2027-10-16":"Sukkot","2027-10-17":"Sukkot","2027-10-18":"Sukkot","2027-10-19":"Sukkot","2027-10-20":"Sukkot","2027-10-21":"Sukkot","2027-10-22":"Sukkot","2027-10-23":"Sukkot","2027-10-24":"Sukkot","2027-10-25":"Sukkot","2027-10-26":"Sukkot","2027-10-27":"Sukkot","2027-10-28":"Sukkot","2027-10-29":"Sukkot","2027-10-30":"Sukkot","2027-10-31":"Sukkot","2027-11-01":"Shmini Atzeret","2027-11-02":"Simchat Torah","2027-11-03":"Simchat Torah","2028-02-02":"Tu B'Shvat","2028-02-25":"Purim","2028-03-17":"Pesach","2028-03-18":"Pesach","2028-03-19":"Pesach","2028-03-20":"Pesach","2028-03-21":"Pesach","2028-03-22":"Pesach","2028-03-23":"Pesach","2028-03-24":"Pesach","2028-03-25":"Pesach","2028-04-05":"Shavuot","2028-04-06":"Shavuot","2028-08-22":"Rosh Hashanah","2028-08-23":"Rosh Hashanah","2028-08-24":"Rosh Hashanah","2028-08-25":"Rosh Hashanah","2028-09-10":"Yom Kippur","2028-09-11":"Yom Kippur","2028-09-13":"Sukkot","2028-09-14":"Sukkot","2028-09-15":"Sukkot","2028-09-16":"Sukkot","2028-09-17":"Sukkot","2028-09-18":"Sukkot","2028-09-19":"Sukkot","2028-09-20":"Sukkot","2028-09-21":"Sukkot","2028-09-22":"Sukkot","2028-09-23":"Sukkot","2028-09-24":"Sukkot","2028-09-25":"Sukkot","2028-09-26":"Sukkot","2028-09-27":"Sukkot","2028-09-28":"Sukkot","2028-09-29":"Sukkot","2028-09-30":"Sukkot","2028-10-01":"Sukkot","2028-10-02":"Sukkot","2028-10-03":"Sukkot","2028-10-04":"Sukkot","2028-10-05":"Sukkot","2028-10-06":"Sukkot","2028-10-07":"Sukkot","2028-10-08":"Sukkot","2028-10-09":"Sukkot","2028-10-10":"Sukkot","2028-10-11":"Sukkot","2028-10-12":"Sukkot","2028-10-13":"Sukkot","2028-10-14":"Sukkot","2028-10-15":"Sukkot","2028-10-16":"Sukkot","2028-10-17":"Sukkot","2028-10-18":"Sukkot","2028-10-19":"Shmini Atzeret","2028-10-20":"Simchat Torah","2028-10-21":"Simchat Torah","2029-01-04":"Tu B'Shvat","2029-02-13":"Purim","2029-02-14":"Purim","2029-03-30":"Pesach","2029-03-31":"Pesach","2029-04-01":"Pesach","2029-04-02":"Pesach","2029-04-03":"Pesach","2029-04-04":"Pesach","2029-04-05":"Pesach","2029-04-06":"Pesach","2029-04-07":"Pesach","2029-04-08":"Pesach","2029-05-20":"Shavuot","2029-05-21":"Shavuot","2029-08-12":"Rosh Hashanah","2029-08-13":"Rosh Hashanah","2029-08-14":"Rosh Hashanah","2029-08-15":"Rosh Hashanah","2029-08-31":"Yom Kippur","2029-09-01":"Yom Kippur","2029-09-03":"Sukkot","2029-09-04":"Sukkot","2029-09-05":"Sukkot","2029-09-06":"Sukkot","2029-09-07":"Sukkot","2029-09-08":"Sukkot","2029-09-09":"Sukkot","2029-09-10":"Sukkot","2029-09-11":"Sukkot","2029-09-12":"Sukkot","2029-09-13":"Sukkot","2029-09-14":"Sukkot","2029-09-15":"Sukkot","2029-09-16":"Sukkot","2029-09-17":"Sukkot","2029-09-18":"Sukkot","2029-09-19":"Sukkot","2029-09-20":"Sukkot","2029-09-21":"Sukkot","2029-09-22":"Sukkot","2029-09-23":"Sukkot","2029-09-24":"Sukkot","2029-09-25":"Sukkot","2029-09-26":"Sukkot","2029-09-27":"Sukkot","2029-09-28":"Sukkot","2029-09-29":"Sukkot","2029-09-30":"Sukkot","2029-10-01":"Sukkot","2029-10-02":"Sukkot","2029-10-03":"Sukkot","2029-10-04":"Sukkot","2029-10-05":"Sukkot","2029-10-06":"Sukkot","2029-10-07":"Sukkot","2029-10-08":"Sukkot","2029-10-09":"Sukkot","2029-10-10":"Sukkot","2029-10-11":"Sukkot","2029-10-12":"Sukkot","2029-10-13":"Sukkot","2029-10-14":"Sukkot","2029-10-15":"Sukkot","2029-10-16":"Sukkot","2029-10-17":"Sukkot","2029-10-18":"Sukkot","2029-10-19":"Shmini Atzeret","2029-10-20":"Simchat Torah","2029-10-21":"Simchat Torah","2030-01-10":"Tu B'Shvat","2030-03-03":"Purim","2030-03-15":"Pesach","2030-03-16":"Pesach","2030-03-17":"Pesach","2030-03-18":"Pesach","2030-03-19":"Pesach","2030-03-20":"Pesach","2030-03-21":"Pesach","2030-03-22":"Pesach","2030-03-23":"Pesach","2030-04-04":"Shavuot","2030-04-05":"Shavuot","2030-08-27":"Rosh Hashanah","2030-08-28":"Rosh Hashanah","2030-08-29":"Rosh Hashanah","2030-08-30":"Rosh Hashanah","2030-09-15":"Yom Kippur","2030-09-16":"Yom Kippur","2030-09-18":"Sukkot","2030-09-19":"Sukkot","2030-09-20":"Sukkot","2030-09-21":"Sukkot","2030-09-22":"Sukkot","2030-09-23":"Sukkot","2030-09-24":"Sukkot","2030-09-25":"Sukkot","2030-09-26":"Sukkot","2030-09-27":"Sukkot","2030-09-28":"Sukkot","2030-09-29":"Sukkot","2030-09-30":"Sukkot","2030-10-01":"Sukkot","2030-10-02":"Sukkot","2030-10-03":"Sukkot","2030-10-04":"Sukkot","2030-10-05":"Sukkot","2030-10-06":"Sukkot","2030-10-07":"Sukkot","2030-10-08":"Sukkot","2030-10-09":"Sukkot","2030-10-10":"Sukkot","2030-10-11":"Sukkot","2030-10-12":"Sukkot","2030-10-13":"Sukkot","2030-10-14":"Sukkot","2030-10-15":"Sukkot","2030-10-16":"Sukkot","2030-10-17":"Sukkot","2030-10-18":"Sukkot","2030-10-19":"Shmini Atzeret","2030-10-20":"Simchat Torah","2030-10-21":"Simchat Torah","2031-01-21":"Tu B'Shvat","2031-02-28":"Purim","2031-03-12":"Pesach","2031-03-13":"Pesach","2031-03-14":"Pesach","2031-03-15":"Pesach","2031-03-16":"Pesach","2031-03-17":"Pesach","2031-03-18":"Pesach","2031-03-19":"Pesach","2031-03-20":"Pesach","2031-03-21":"Pesach","2031-04-02":"Shavuot","2031-04-03":"Shavuot","2031-08-19":"Rosh Hashanah","2031-08-20":"Rosh Hashanah","2031-08-21":"Rosh Hashanah","2031-08-22":"Rosh Hashanah","2031-09-05":"Yom Kippur","2031-09-06":"Yom Kippur","2031-09-08":"Sukkot","2031-09-09":"Sukkot","2031-09-10":"Sukkot","2031-09-11":"Sukkot","2031-09-12":"Sukkot","2031-09-13":"Sukkot","2031-09-14":"Sukkot","2031-09-15":"Sukkot","2031-09-16":"Sukkot","2031-09-17":"Sukkot","2031-09-18":"Sukkot","2031-09-19":"Sukkot","2031-09-20":"Sukkot","2031-09-21":"Sukkot","2031-09-22":"Sukkot","2031-09-23":"Sukkot","2031-09-24":"Sukkot","2031-09-25":"Sukkot","2031-09-26":"Sukkot","2031-09-27":"Sukkot","2031-09-28":"Sukkot","2031-09-29":"Sukkot","2031-09-30":"Sukkot","2031-10-01":"Sukkot","2031-10-02":"Sukkot","2031-10-03":"Sukkot","2031-10-04":"Sukkot","2031-10-05":"Sukkot","2031-10-06":"Sukkot","2031-10-07":"Sukkot","2031-10-08":"Sukkot","2031-10-09":"Sukkot","2031-10-10":"Sukkot","2031-10-11":"Sukkot","2031-10-12":"Sukkot","2031-10-13":"Sukkot","2031-10-14":"Sukkot","2031-10-15":"Sukkot","2031-10-16":"Sukkot","2031-10-17":"Sukkot","2031-10-18":"Sukkot","2031-10-19":"Shmini Atzeret","2031-10-20":"Simchat Torah","2031-10-21":"Simchat Torah","2032-01-31":"Tu B'Shvat","2032-03-07":"Purim","2032-03-22":"Pesach","2032-03-23":"Pesach","2032-03-24":"Pesach","2032-03-25":"Pesach","2032-03-26":"Pesach","2032-03-27":"Pesach","2032-03-28":"Pesach","2032-03-29":"Pesach","2032-03-30":"Pesach","2032-04-11":"Shavuot","2032-04-12":"Shavuot","2032-08-16":"Rosh Hashanah","2032-08-17":"Rosh Hashanah","2032-08-18":"Rosh Hashanah","2032-08-19":"Rosh Hashanah","2032-09-01":"Yom Kippur","2032-09-02":"Yom Kippur","2032-09-04":"Sukkot","2032-09-05":"Sukkot","2032-09-06":"Sukkot","2032-09-07":"Sukkot","2032-09-08":"Sukkot","2032-09-09":"Sukkot","2032-09-10":"Sukkot","2032-09-11":"Sukkot","2032-09-12":"Sukkot","2032-09-13":"Sukkot","2032-09-14":"Sukkot","2032-09-15":"Sukkot","2032-09-16":"Sukkot","2032-09-17":"Sukkot","2032-09-18":"Sukkot","2032-09-19":"Sukkot","2032-09-20":"Sukkot","2032-09-21":"Sukkot","2032-09-22":"Sukkot","2032-09-23":"Sukkot","2032-09-24":"Sukkot","2032-09-25":"Sukkot","2032-09-26":"Sukkot","2032-09-27":"Sukkot","2032-09-28":"Sukkot","2032-09-29":"Sukkot","2032-09-30":"Sukkot","2032-10-01":"Sukkot","2032-10-02":"Sukkot","2032-10-03":"Sukkot","2032-10-04":"Sukkot","2032-10-05":"Sukkot","2032-10-06":"Sukkot","2032-10-07":"Sukkot","2032-10-08":"Sukkot","2032-10-09":"Sukkot","2032-10-10":"Sukkot","2032-10-11":"Sukkot","2032-10-12":"Sukkot","2032-10-13":"Sukkot","2032-10-14":"Sukkot","2032-10-15":"Sukkot","2032-10-16":"Sukkot","2032-10-17":"Sukkot","2032-10-18":"Sukkot","2032-10-19":"Shmini Atzeret","2032-10-20":"Simchat Torah","2032-10-21":"Simchat Torah"};

  var LAT = 51.67, LON = -0.17;          // Hadley Wood
  var CANDLE_MINS = 18;                  // before sunset
  var NIGHTFALL_ANGLE = -8.5;            // sun altitude at the end of Shabbat
  var SUNSET_ANGLE = -0.833;
  var TZ = "Europe/London";

  function isBot() {
    var ua = (navigator && navigator.userAgent) ? navigator.userAgent : "";
    return /bot|crawl|spider|slurp|duckduckbot|bingpreview|googlebot|headless|chrome-lighthouse/i.test(ua);
  }

  function rad(d) { return d * Math.PI / 180; }

  // Time (ms since epoch) when the sun reaches `angle` degrees in the evening on civil date y-m-d
  function sunEvening(y, m, d, angle) {
    var jd = Date.UTC(y, m - 1, d, 12) / 86400000 + 2440587.5;
    var n = jd - 2451545.0 + 0.0008;
    var js = n - LON / 360;
    var M = (357.5291 + 0.98560028 * js) % 360;
    var C = 1.9148 * Math.sin(rad(M)) + 0.02 * Math.sin(rad(2 * M)) + 0.0003 * Math.sin(rad(3 * M));
    var L = (M + C + 180 + 102.9372) % 360;
    var jt = 2451545.0 + js + 0.0053 * Math.sin(rad(M)) - 0.0069 * Math.sin(rad(2 * L));
    var dec = Math.asin(Math.sin(rad(L)) * Math.sin(rad(23.4397)));
    var cosw = (Math.sin(rad(angle)) - Math.sin(rad(LAT)) * Math.sin(dec)) / (Math.cos(rad(LAT)) * Math.cos(dec));
    cosw = Math.max(-1, Math.min(1, cosw));
    var w = Math.acos(cosw) * 180 / Math.PI;
    return (jt + w / 360 - 2440587.5) * 86400000;
  }

  // Civil date in London for a given instant -> {y,m,d,key,dow}
  function londonDate(ms) {
    var parts = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" }).formatToParts(new Date(ms));
    var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
    return { y: +o.year, m: +o.month, d: +o.day, key: o.year + "-" + o.month + "-" + o.day, dow: o.weekday };
  }
  function shift(dt, days) {
    var t = Date.UTC(dt.y, dt.m - 1, dt.d, 12) + days * 86400000;
    var x = new Date(t);
    var key = x.toISOString().slice(0, 10);
    var dow = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][x.getUTCDay()];
    return { y: x.getUTCFullYear(), m: x.getUTCMonth() + 1, d: x.getUTCDate(), key: key, dow: dow };
  }
  function holy(dt) { return dt.dow === "Sat" || !!YOMTOV[dt.key]; }

  // Returns {start, end, names:[]} for the holy block containing instant `now`, or null
  function activeBlock(now) {
    var today = londonDate(now);
    for (var off = 1; off >= -2; off--) {           // a block can start up to 2 days earlier (e.g. Thu Yom Tov + Fri + Shabbat)
      var dt = shift(today, off);
      if (!holy(dt)) continue;
      var first = dt, last = dt;
      while (holy(shift(first, -1))) first = shift(first, -1);
      while (holy(shift(last, 1))) last = shift(last, 1);
      var eve = shift(first, -1);
      var start = sunEvening(eve.y, eve.m, eve.d, SUNSET_ANGLE) - CANDLE_MINS * 60000;
      var end = sunEvening(last.y, last.m, last.d, NIGHTFALL_ANGLE);
      if (now >= start && now < end) {
        var names = [], seen = {};
        for (var x = first; ; x = shift(x, 1)) {
          var nm = YOMTOV[x.key];
          if (nm && !seen[nm]) { seen[nm] = 1; names.push(nm); }
          if (x.key === last.key) break;
        }
        return { start: start, end: end, names: names };
      }
    }
    return null;
  }

  function fmtEnd(ms) {
    var day = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, weekday: "long" }).format(new Date(ms));
    var t = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(ms)).replace(" ", "").replace(/am$/i, "am").replace(/pm$/i, "pm");
    var dateStr = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, day: "numeric", month: "long" }).format(new Date(ms));
    var sameWeek = (ms - Date.now()) < 6 * 86400000;
    return (sameWeek ? day : day + " " + dateStr) + " at " + t;
  }

  function render(block) {
    if (isBot()) return;

    var isYomTov = block.names.length > 0;
    var title = isYomTov ? "Sorry! It’s " + block.names.join(" and ") : "Sorry! It’s Shabbat";
    var what = isYomTov ? "Yom Tov" : "Shabbat";
    var greeting = isYomTov ? "Chag Sameach" : "Shabbat Shalom";
    var screen = document.createElement("div");
    screen.className = "shabbat-screen";
    screen.setAttribute("role", "dialog");
    screen.setAttribute("aria-label", title);
    screen.innerHTML =
      '<div class="shabbat-screen__inner">' +
        '<img src="assets/img/hwjc-logo.png" alt="Hadley Wood Jewish Community" width="700" height="665">' +
        '<h1>' + title + '</h1>' +
        '<p class="lead">Our website is closed for ' + what + '. Please check again after <strong>' + fmtEnd(block.end) + '</strong>.</p>' +
        '<p class="shabbat-screen__greeting">' + greeting + '</p>' +
        '<p class="shabbat-screen__small">In a life-threatening emergency always call 999. Hatzola HBS: <a href="https://www.hatzolahbs.com" rel="noopener">hatzolahbs.com</a></p>' +
      '</div>';
    document.body.appendChild(screen);
    document.title = title + " · Hadley Wood Jewish Community";
  }

  if (typeof module !== "undefined") { module.exports = { activeBlock: activeBlock, sunEvening: sunEvening, YOMTOV: YOMTOV }; return; }

  var params = new URLSearchParams(location.search);
  var preview = params.get("preview");
  var block = activeBlock(Date.now());
  if (preview === "shabbat") block = { start: Date.now(), end: Date.now() + 26 * 3600000, names: [] };
  if (preview === "yomtov") block = { start: Date.now(), end: Date.now() + 50 * 3600000, names: ["Rosh Hashanah"] };

  if (block) {
    document.documentElement.classList.add("is-shabbat");
    var ready = function () { render(block); };
    if (document.body) ready(); else document.addEventListener("DOMContentLoaded", ready);
    if (!preview) {
      setInterval(function () { if (Date.now() >= block.end) location.reload(); }, 60000);
    }
  }
})();
