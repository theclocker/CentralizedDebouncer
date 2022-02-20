const path = require('path');

const webpack_rules = {
    typescript: {
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: {
            loader: 'ts-loader',
            options: {}
        },
    }
}

module.exports = {
    webpack_rules,
    webpack: ({
        entry: './src/index.ts',
        devtool: 'source-map',
        module: {
            rules: Object.values(webpack_rules),
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'dist/node'),
        },
    })
}