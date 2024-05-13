import path from "path";

export default {
  mode: "development",
  entry: {
    map: "./src/public/work-js/map.js",
    addImage: "./src/public/work-js/addImage.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Regex para archivos .ts y .tsx
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"], // Añade '.ts' y '.tsx' como extensiones resolubles
  },
  output: {
    filename: "[name].js",
    path: path.resolve("./src/public/js"),
  },
};