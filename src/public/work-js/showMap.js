(function () {
  const lat = document.querySelector("#lat").textContent;
  const lng = document.querySelector("#lng").textContent;
  const street = document.querySelector("#street").textContent;
  const title = document.querySelector("#title").textContent;

  const map = L.map("map").setView([lat, lng], 16);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(title + "<br/>" + street)
    .openPopup();
})();
