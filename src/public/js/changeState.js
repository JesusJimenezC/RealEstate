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

/***/ "./src/public/work-js/changeState.js":
/*!*******************************************!*\
  !*** ./src/public/work-js/changeState.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\n  const changeStateButtons = document.querySelectorAll(\".change-state\");\n\n  changeStateButtons.forEach((button) => {\n    button.addEventListener(\"click\", changeStateProperty);\n  });\n\n  async function changeStateProperty(e) {\n    const { propertyId: id } = e.target.dataset;\n    const csrf = document.querySelector('meta[name=\"csrf-token\"]').content;\n    const url = `/properties/${id}`;\n\n    try {\n      const res = await fetch(url, {\n        method: \"PUT\",\n        headers: {\n          \"x-csrf-token\": csrf,\n        },\n      });\n\n      const { result } = await res.json();\n\n      if (result) {\n        if (e.target.classList.contains(\"bg-yellow-100\")) {\n          e.target.classList.add(\"bg-green-100\", \"text-green-800\");\n          e.target.classList.remove(\"bg-yellow-100\", \"text-yellow-800\");\n\n          e.target.textContent = \"Published\";\n        } else {\n          e.target.classList.add(\"bg-yellow-100\", \"text-yellow-800\");\n          e.target.classList.remove(\"bg-green-100\", \"text-green-800\");\n\n          e.target.textContent = \"Unpublished\";\n        }\n      }\n    } catch (error) {\n      console.error({ error });\n    }\n  }\n})();\n\n\n//# sourceURL=webpack://realstate/./src/public/work-js/changeState.js?");

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
/******/ 	__webpack_modules__["./src/public/work-js/changeState.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;