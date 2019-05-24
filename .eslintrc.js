// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // 'plugin:vue/strongly-recommended',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard',
    'eslint:recommended'
    // 'eslint:recommended'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  "globals": {
    "$": true,
    "define": true,
    "require": true,
    "layer": true,
    "echarts": true,
  },
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console':0,
    'no-trailing-spaces': 'off',
    "semi": ["error", "always"],
    "quotes": ["error", "single"],
    "space-before-function-paren": 'off',
    "valid-jsdoc": [2, {
      "requireParamDescription": true,
      "requireReturnDescription": true
    }],
    'no-mixed-spaces-and-tabs': 'off'
  }
};
