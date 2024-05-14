import { Dropzone } from "dropzone";

const token = document.querySelector('meta[name="csrf-token"]').content;

Dropzone.options.image = {
  acceptedFiles: ".png, .jpg, .jpeg",
  maxFilesize: 5,
  maxFiles: 1,
  parallelUploads: 1,
  autoProcessQueue: false,
  addRemoveLinks: true,
  headers: {
    "CSRF-Token": token,
  },
};
