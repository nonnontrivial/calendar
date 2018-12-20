module.exports = {
  presets: [
    ['@babel/env', { modules: false }],
    '@babel/preset-flow',
    '@babel/preset-react'
  ],
  env: {
    test: {
      presets: [['@babel/env'], '@babel/preset-react']
    }
  }
};
