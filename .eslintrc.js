module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g., "@typescript-eslint/explicit-function-return-type": "off",
  },
  plugins: [
    'html', // if not already present, adds the HTML plugin for linting scripts inside HTML files
  ],
  settings: {
    'html/html-extensions': ['.html'], // considers .html files as HTML
  },
};
