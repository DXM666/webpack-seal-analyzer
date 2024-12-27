const path = require('path');
const WebpackSealAnalyzerPlugin = require('./src');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src/index.ts'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    experiments: {
        topLevelAwait: true,
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [new WebpackSealAnalyzerPlugin()],
};
