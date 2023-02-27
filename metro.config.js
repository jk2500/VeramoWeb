// filename: metro.config.js
const { getDefaultConfig } = require('metro-config')
const { resolver: defaultResolver } = getDefaultConfig.getDefaultValues()

exports.resolver = {
  ...defaultResolver,
  sourceExts: [...defaultResolver.sourceExts, 'cjs'],
}