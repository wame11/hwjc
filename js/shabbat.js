/* Shabbat and Yom Tov screen
   Closes the site from candle lighting (18 minutes before sunset) until
   nightfall (sun 8.5 degrees below the horizon), calculated for Hadley Wood.
   Yom Tov dates (diaspora) are built in for 2026-2032.
   Preview any time with ?preview=shabbat or ?preview=yomtov */
(function () {
  "use strict";

  var YOMTOV = {"2026-04-02":"Pesach","2026-04-03":"Pesach","2026-04-08":"Pesach","2026-04-09":"Pesach","2026-05-22":"Shavuot","2026-05-23":"Shavuot","2026-09-12":"Rosh Hashanah","2026-09-13":"Rosh Hashanah","2026-09-21":"Yom Kippur","2026-09-26":"Sukkot","2026-09-27":"Sukkot","2026-10-03":"Shemini Atzeret","2026-10-04":"Simchat Torah","2027-04-22":"Pesach","2027-04-23":"Pesach","2027-04-28":"Pesach","2027-04-29":"Pesach","2027-06-11":"Shavuot","2027-06-12":"Shavuot","2027-10-02":"Rosh Hashanah","2027-10-03":"Rosh Hashanah","2027-10-11":"Yom Kippur","2027-10-16":"Sukkot","2027-10-17":"Sukkot","2027-10-23":"Shemini Atzeret","2027-10-24":"Simchat Torah","2028-04-11":"Pesach","2028-04-12":"Pesach","2028-04-17":"Pesach","2028-04-18":"Pesach","2028-05-31":"Shavuot","2028-06-01":"Shavuot","2028-09-21":"Rosh Hashanah","2028-09-22":"Rosh Hashanah","2028-09-30":"Yom Kippur","2028-10-05":"Sukkot","2028-10-06":"Sukkot","2028-10-12":"Shemini Atzeret","2028-10-13":"Simchat Torah","2029-03-31":"Pesach","2029-04-01":"Pesach","2029-04-06":"Pesach","2029-04-07":"Pesach","2029-05-20":"Shavuot","2029-05-21":"Shavuot","2029-09-10":"Rosh Hashanah","2029-09-11":"Rosh Hashanah","2029-09-19":"Yom Kippur","2029-09-24":"Sukkot","2029-09-25":"Sukkot","2029-10-01":"Shemini Atzeret","2029-10-02":"Simchat Torah","2030-04-18":"Pesach","2030-04-19":"Pesach","2030-04-24":"Pesach","2030-04-25":"Pesach","2030-06-07":"Shavuot","2030-06-08":"Shavuot","2030-09-28":"Rosh Hashanah","2030-09-29":"Rosh Hashanah","2030-10-07":"Yom Kippur","2030-10-12":"Sukkot","2030-10-13":"Sukkot","2030-10-19":"Shemini Atzeret","2030-10-20":"Simchat Torah","2031-04-08":"Pesach","2031-04-09":"Pesach","2031-04-14":"Pesach","2031-04-15":"Pesach","2031-05-28":"Shavuot","2031-05-29":"Shavuot","2031-09-18":"Rosh Hashanah","2031-09-19":"Rosh Hashanah","2031-09-27":"Yom Kippur","2031-10-02":"Sukkot","2031-10-03":"Sukkot","2031-10-09":"Shemini Atzeret","2031-10-10":"Simchat Torah","2032-03-27":"Pesach","2032-03-28":"Pesach","2032-04-02":"Pesach","2032-04-03":"Pesach","2032-05-16":"Shavuot","2032-05-17":"Shavuot","2032-09-06":"Rosh Hashanah","2032-09-07":"Rosh Hashanah","2032-09-15":"Yom Kippur","2032-09-20":"Sukkot","2032-09-21":"Sukkot","2032-09-27":"Shemini Atzeret","2032-09-28":"Simchat Torah"};

  var LAT = 51.67, LON = -0.17;          // Hadley Wood
  var CANDLE_MINS = 18;                  // before sunset
  var NIGHTFALL_ANGLE = -8.5;            // sun altitude at the end of Shabbat
  var SUNSET_ANGLE = -0.833;
  var TZ = "Europe/London";

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
