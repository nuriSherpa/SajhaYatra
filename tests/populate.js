const User=require('../models/user');
const mongoose=require('mongoose');

const user=require('./dummy.json');

const start = async()=>{
    try{
        await mongoose.connect('mongodb+srv://tendinuri:2002Tendi5@nodeproject.w0bwoeo.mongodb.net/SajhaYatra?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to database');
        await User.deleteMany();
        await User.create(user);
        console.log('success');
        process.exit(0);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}
start();