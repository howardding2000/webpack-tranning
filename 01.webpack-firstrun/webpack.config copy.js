const { Resolver } = require("path");


module.exports={
  entry: './src/index.js',

  output: {
    filename: 'built.js',

    path: Resolver(__dirname, 'build')
  },

  module:{
    rules:[
      {
        test:'/\.css$/',
        use:[
          'style-loader',
          'css-loader'
        ]
      },

      {
        test:'/\.less$/',
        use:[
          'style-loader',
          'css-loader',
          'les-loader'
        ]
      }
    ]
  },

  plugins:[

  ],

  mode: 'development'
}