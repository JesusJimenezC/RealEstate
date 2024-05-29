(function () {
  const changeStateButtons = document.querySelectorAll(".change-state");

  changeStateButtons.forEach((button) => {
    button.addEventListener("click", changeStateProperty);
  });

  async function changeStateProperty(e) {
    const { propertyId: id } = e.target.dataset;
    const csrf = document.querySelector('meta[name="csrf-token"]').content;
    const url = `/properties/${id}`;

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "x-csrf-token": csrf,
        },
      });

      const { result } = await res.json();

      if (result) {
        if (e.target.classList.contains("bg-yellow-100")) {
          e.target.classList.add("bg-green-100", "text-green-800");
          e.target.classList.remove("bg-yellow-100", "text-yellow-800");

          e.target.textContent = "Published";
        } else {
          e.target.classList.add("bg-yellow-100", "text-yellow-800");
          e.target.classList.remove("bg-green-100", "text-green-800");

          e.target.textContent = "Unpublished";
        }
      }
    } catch (error) {
      console.error({ error });
    }
  }
})();
