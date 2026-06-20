const resolveConfig = require('tailwindcss/resolveConfig');
const tailwindConfig = require('./tailwind.config.js').default; // Using ES module export?
const config = resolveConfig(tailwindConfig);
console.log(config.theme.colors.bg);
