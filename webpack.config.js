const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssoPlugin = require('csso-webpack-plugin').default

const NODE_ENV = process.env.NODE_ENV || 'development'
const ENTRY = process.env.ENTRY

const rules = [
    {
        test : /\.css$/,
        use : [
            NODE_ENV === 'production'?
                MiniCssExtractPlugin.loader :
                'style-loader',
            {
                loader : 'css-loader',
                options : {
                    importLoaders : 1
                    // url : false
                }
            },
            'postcss-loader'
        ]
    },
    {
        test : /\.(png|jpg|woff|woff2)$/,
        loader : 'url-loader',
        options : {
            limit : 20480
        }
    },
    {
        test : /\.svg$/,
        loader : 'raw-loader'
    }
]
const plugins = []
const entries = {
    index : './src/index.js'
}

if(NODE_ENV === 'production') {
    rules.push({
        test : /\.js$/,
        use : { loader : 'babel-loader' }
    })
    plugins.push(new UglifyJsPlugin({
        uglifyOptions : {
            keep_fnames : true,
            keep_classnames : true,
            output : {
                comments : false
            }
        }
    }))
    plugins.push(new MiniCssExtractPlugin({
        filename : 'build.[name].css'
    }))
    plugins.push(new CssoPlugin)
}

module.exports = [
    {
        mode : 'none',
        entry : ENTRY? entries[ENTRY] : entries,
        output : {
            path : path.join(__dirname, 'public/build'),
            filename : 'build.[name].js'
        },
        module : { rules },
        devServer : {
            contentBase : path.join(__dirname, 'public'),
            publicPath : '/build/',
            open: 'Google Chrome',
            hot : true
        },
        plugins
    }
]
