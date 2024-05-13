(function () {
  const lat = document.querySelector("#lat").value || 19.4326077;
  const lng = document.querySelector("#lng").value || -99.133208;
  const map = L.map("map").setView([lat, lng], 16);
  let marker;

  // Use Provider and Geocoder
  const geocodeService = L.esri.Geocoding.geocodeService();

  const popup = (position) =>
    geocodeService
      .reverse()
      .latlng(position, 13)
      .run(function (_error, result) {
        const res = result.address;
        marker.bindPopup(res.LongLabel).openPopup();

        // Fill fields
        document.querySelector("#street").value = res.Address ?? "";
        document.querySelector("#lat").value = position.lat ?? "";
        document.querySelector("#lng").value = position.lng ?? "";
        document.querySelector(".street").innerHTML = res.Address ?? "";
      });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  marker = new L.marker([lat, lng], { draggable: true, autoPan: true }).addTo(
    map,
  );

  popup(marker.getLatLng());

  marker.on("moveend", function (e) {
    marker = e.target;

    const position = marker.getLatLng();

    map.panTo(new L.LatLng(position.lat, position.lng));

    // Get street name
    popup(position);
  });
})();
