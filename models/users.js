var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
      name: {type: String, unique: true, required: true },
      password: { type: String, required: true },
      email: {type: String, required: true, unique: true}
});


// Export model.
module.exports = mongoose.model('User', UserSchema);
