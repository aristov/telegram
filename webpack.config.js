const path = require('path')

module.exports = {
    mode : 'none',
    entry : './src/index.js',
    output : {
        path : path.join(__dirname, 'public'),
        filename : 'build.index.js'
    }
}
