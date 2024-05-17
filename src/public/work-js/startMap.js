(function () {
  const lat = 19.4326077;
  const lng = -99.133208;
  const map = L.map("start-map").setView([lat, lng], 16);

  let markers = new L.FeatureGroup().addTo(map);

  const filters = {
    category: "",
    price: "",
  };

  let properties = [];

  const categorySelect = document.querySelector("#categories");
  const priceSelect = document.querySelector("#prices");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  categorySelect.addEventListener("change", (e) => {
    filters.category = +e.target.value;
    filterProperties();
  });

  priceSelect.addEventListener("change", (e) => {
    filters.price = +e.target.value;
    filterProperties();
  });

  const getProperties = async () => {
    try {
      const response = await fetch("/api/properties");
      properties = await response.json();
      showProperties(properties).then((r) => console.log("Properties loaded"));
    } catch (error) {
      console.error(error);
    }
  };

  const showProperties = async (properties) => {
    markers.clearLayers();

    properties.forEach((property) => {
      const { lat, lng, title, image, price, category, id } = property;

      const marker = L.marker([lat, lng], { autoPan: true }).addTo(map)
        .bindPopup(`
          <p class="text-indigo-600 font-bold capitalize">${category.name}</p>
          <h1 class="text-xl font-extrabold uppercase mb-2">${title}</h1>
          <img src="uploads/${image}" alt="Property image" class="w-full">
          <p class="text-gray-600 font-bold">${price.name}</p>
          <a href="/property/${id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase">See Property</a>
        `);

      markers.addLayer(marker);
    });
  };

  const filterProperties = () => {
    const result = properties.filter((property) => {
      const category = filters.category
        ? property.categoryIdFK === filters.category
        : true;
      const price = filters.price ? property.priceIdFK === filters.price : true;

      return category && price;
    });

    console.log(result);

    showProperties(result).then((r) =>
      console.log("Properties filtered and loaded"),
    );
  };

  getProperties().then((r) => console.log("Get properties executed"));
})();
