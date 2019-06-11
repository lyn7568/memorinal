'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_API: '"http://152.136.52.66:8090"',
  BASE_API: '"http://152.136.52.66:8090"',
})
