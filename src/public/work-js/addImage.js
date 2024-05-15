import { Dropzone } from "dropzone";

const token = document.querySelector('meta[name="csrfToken"]').content;

Dropzone.options.image = {
  acceptedFiles: ".png, .jpg, .jpeg",
  maxFilesize: 5,
  maxFiles: 1,
  parallelUploads: 1,
  autoProcessQueue: false,
  addRemoveLinks: true,
  headers: {
    "x-csrf-token": token,
  },
  paramName: "image",
  init: function () {
    const dropzone = this;
    const submitBtn = document.querySelector("#submit");

    submitBtn.addEventListener("click", function (e) {
      dropzone.processQueue();
    });

    dropzone.on("queuecomplete", function () {
      console.log("queuecomplete");
      if (dropzone.getActiveFiles().length === 0) {
        window.location.href = "/my-properties";
      }
    });
  },
};
