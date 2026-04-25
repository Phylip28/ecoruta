module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // Included by `nativewind/babel` -> `react-native-css-interop@0.1.x` (do not add `react-native-reanimated/plugin` again).
    plugins: [],
  };
};
