import path from "path";

export default {
  mode: "development",
  entry: {
    map: "./src/public/work-js/map.js",
    addImage: "./src/public/work-js/addImage.js",
    showMap: "./src/public/work-js/showMap.js",
    startMap: "./src/public/work-js/startMap.js",
    changeState: "./src/public/work-js/changeState.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve("./src/public/js"),
  },
};
