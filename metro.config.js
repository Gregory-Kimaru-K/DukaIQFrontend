const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const blockProjectFolder = (folder) =>
  new RegExp(`^${escapeRegex(path.join(__dirname, folder))}\\/.*`);

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;
  const existingBlockList = resolver.blockList
    ? Array.isArray(resolver.blockList)
      ? resolver.blockList
      : [resolver.blockList]
    : [];

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo")
  };
  config.resolver = {
    ...resolver,
    blockList: [
      ...existingBlockList,
      blockProjectFolder(".claude"),
      blockProjectFolder(".codex"),
      blockProjectFolder(".expo")
    ],
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"]
  };

  return config;
})();
