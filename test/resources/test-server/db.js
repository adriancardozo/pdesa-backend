const zapatillas = require('./search/zapatillas.js');
const zapatilla = require('./product/zapatilla.js');
const search_empty = require('./search/search_empty.js');

module.exports = function () {
  return { search: [zapatillas], product: [zapatilla], search_empty };
};
