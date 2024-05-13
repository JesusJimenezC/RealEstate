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

/***/ "./src/public/work-js/map.js":
/*!***********************************!*\
  !*** ./src/public/work-js/map.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\n  const lat = document.querySelector(\"#lat\").value || 19.4326077;\n  const lng = document.querySelector(\"#lng\").value || -99.133208;\n  const map = L.map(\"map\").setView([lat, lng], 16);\n  let marker;\n\n  // Use Provider and Geocoder\n  const geocodeService = L.esri.Geocoding.geocodeService();\n\n  const popup = (position) =>\n    geocodeService\n      .reverse()\n      .latlng(position, 13)\n      .run(function (_error, result) {\n        const res = result.address;\n        marker.bindPopup(res.LongLabel).openPopup();\n\n        // Fill fields\n        document.querySelector(\"#street\").value = res.Address ?? \"\";\n        document.querySelector(\"#lat\").value = position.lat ?? \"\";\n        document.querySelector(\"#lng\").value = position.lng ?? \"\";\n        document.querySelector(\".street\").innerHTML = res.Address ?? \"\";\n      });\n\n  L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\").addTo(map);\n\n  marker = new L.marker([lat, lng], { draggable: true, autoPan: true }).addTo(\n    map,\n  );\n\n  popup(marker.getLatLng());\n\n  marker.on(\"moveend\", function (e) {\n    marker = e.target;\n\n    const position = marker.getLatLng();\n\n    map.panTo(new L.LatLng(position.lat, position.lng));\n\n    // Get street name\n    popup(position);\n  });\n})();\n\n\n//# sourceURL=webpack://realstate/./src/public/work-js/map.js?");

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
/******/ 	__webpack_modules__["./src/public/work-js/map.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;