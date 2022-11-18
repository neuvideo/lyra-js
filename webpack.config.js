// webpack.config.js
const path = require('path');

module.exports = {
    entry: './lyra.js',
    experiments: {
        asyncWebAssembly: true,
        layers: true,
        outputModule: true,
        syncWebAssembly: true,
        topLevelAwait: true,
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "lyra_bundle.js",
        library: {
            type: 'module',
        },
    },
    mode: "production",
};