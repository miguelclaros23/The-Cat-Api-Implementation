const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/xpergroup', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => console.log('Database is connected - mongodb::xpergroup'))
    .catch(err => console.log(err));