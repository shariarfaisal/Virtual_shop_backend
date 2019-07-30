const config = require('config');

module.exports = function() {
  if(!config.get('jwtPrivatekey')){
    throw new Error('Fatal Error: jwtPrivatekey is not defined.');
    process.exit(1);
  }
}
