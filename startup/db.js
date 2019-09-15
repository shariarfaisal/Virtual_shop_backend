const mongoose = require('mongoose')


module.exports = function() {

  mongoose.connect(
    'mongodb://localhost:27017/turing',
    {useNewUrlParser: true},
    () => {
      console.log('Database connection established succesfully');
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
