
import mongoose from 'mongoose';



let isConnected : boolean = false;

export const connectToDatabase =async()=>{

    mongoose.set('strictQuery',true);

if(!process.env.MONGODB_URL)
    return console.log('MISSING MONGODB URL');

if(isConnected) {
    console.log('Mongodb is already connected');
    return
}

try{
await mongoose.connect(process.env.MONGODB_URL,{
    dbName: 'pfa'
})
isConnected = true;
console.log('Mongodb is connected');
}catch(err){
    console.log(err);

}
}