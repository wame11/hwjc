/* Refuah Shleimah: opens the visitor's email app with a Mi Sheberach request for Rabbi Toby */
(function () {
  "use strict";
  var f = document.getElementById("refuahForm");
  if (!f) return;
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = function (id) { return (document.getElementById(id).value || "").trim(); };
    var english = v("rfEnglish"), hebrew = v("rfHebrew"), from = v("rfFrom"), note = v("rfNote");
    var msg = document.getElementById("rfMsg");
    if (!english || !hebrew || !from) {
      msg.textContent = "Please fill in the three names.";
      msg.className = "form-msg form-msg--error";
      msg.hidden = false;
      document.getElementById(!english ? "rfEnglish" : !hebrew ? "rfHebrew" : "rfFrom").focus();
      return;
    }
    var subject = "Refuah Shleimah: " + english;
    var body = "Please add the following name to the Mi Sheberach for the sick:\n\n" +
      "Name in English: " + english + "\n" +
      "Hebrew name: " + hebrew + "\n" +
      (note ? "Notes: " + note + "\n" : "") +
      "\nSent by: " + from + "\n";
    msg.textContent = "Opening your email app…";
    msg.className = "form-msg form-msg--ok";
    msg.hidden = false;
    window.location.href = "mailto:rabbitoby@hwjc.org.uk?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });
})();
