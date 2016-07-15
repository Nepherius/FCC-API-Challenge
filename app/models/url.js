var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection('mongodb://localhost/fcc');
autoIncrement.initialize(connection);

var UrlSchema = mongoose.Schema({
    originalUrl: {type: String, required: true }
}, {
    timestamps: true
});

// methods ======================



UrlSchema.plugin(autoIncrement.plugin, 'Url');
// create the model for companies and expose it to our app

module.exports = mongoose.model('Url', UrlSchema);
