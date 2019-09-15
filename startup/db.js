const mongoose = require('mongoose')
const config = require('config')

module.exports = function() {

  mongoose.connect(
    config.get('db'),
    {useNewUrlParser: true},
    () => {
      console.log('Database connection established '+config.get('db'));
    }
  )
}

//
// module.exports = function() {
//
//   mongoose.connect(
//     'mongodb+srv://shariarfaisal:y0uc49d049y7h19g@faisal-0eqby.mongodb.net/virtualShop?retryWrites=true&w=majority',
//     {useNewUrlParser: true},
//     () => {
//       console.log('Database connection established succesfully');
//     }
//   )
//
//
// }
