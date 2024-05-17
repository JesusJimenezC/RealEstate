/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/public/work-js/startMap.js":
/*!****************************************!*\
  !*** ./src/public/work-js/startMap.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\n  const lat = 19.4326077;\n  const lng = -99.133208;\n  const map = L.map(\"start-map\").setView([lat, lng], 16);\n\n  let markers = new L.FeatureGroup().addTo(map);\n\n  const filters = {\n    category: \"\",\n    price: \"\",\n  };\n\n  let properties = [];\n\n  const categorySelect = document.querySelector(\"#categories\");\n  const priceSelect = document.querySelector(\"#prices\");\n\n  L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\").addTo(map);\n\n  categorySelect.addEventListener(\"change\", (e) => {\n    filters.category = +e.target.value;\n    filterProperties();\n  });\n\n  priceSelect.addEventListener(\"change\", (e) => {\n    filters.price = +e.target.value;\n    filterProperties();\n  });\n\n  const getProperties = async () => {\n    try {\n      const response = await fetch(\"/api/properties\");\n      properties = await response.json();\n      showProperties(properties).then((r) => console.log(\"Properties loaded\"));\n    } catch (error) {\n      console.error(error);\n    }\n  };\n\n  const showProperties = async (properties) => {\n    markers.clearLayers();\n\n    properties.forEach((property) => {\n      const { lat, lng, title, image, price, category, id } = property;\n\n      const marker = L.marker([lat, lng], { autoPan: true }).addTo(map)\n        .bindPopup(`\n          <p class=\"text-indigo-600 font-bold capitalize\">${category.name}</p>\n          <h1 class=\"text-xl font-extrabold uppercase mb-2\">${title}</h1>\n          <img src=\"uploads/${image}\" alt=\"Property image\" class=\"w-full\">\n          <p class=\"text-gray-600 font-bold\">${price.name}</p>\n          <a href=\"/property/${id}\" class=\"bg-indigo-600 block p-2 text-center font-bold uppercase\">See Property</a>\n        `);\n\n      markers.addLayer(marker);\n    });\n  };\n\n  const filterProperties = () => {\n    const result = properties.filter((property) => {\n      const category = filters.category\n        ? property.categoryIdFK === filters.category\n        : true;\n      const price = filters.price ? property.priceIdFK === filters.price : true;\n\n      return category && price;\n    });\n\n    console.log(result);\n\n    showProperties(result).then((r) =>\n      console.log(\"Properties filtered and loaded\"),\n    );\n  };\n\n  getProperties().then((r) => console.log(\"Get properties executed\"));\n})();\n\n\n//# sourceURL=webpack://realstate/./src/public/work-js/startMap.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/public/work-js/startMap.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;