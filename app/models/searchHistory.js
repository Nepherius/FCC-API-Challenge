var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var SearchHistorySchema = mongoose.Schema({
    query : {type : String},
    date : {type : Date, default : Date.now}
}, {
    timestamps: true
});

module.exports = mongoose.model('SearchHistory', SearchHistorySchema);
