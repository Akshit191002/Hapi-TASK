import mongoose from 'mongoose';

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' })

const connectDB= async()=>{
    try{
        // const dbName=process.env.DB_NAME
        // const dbPass=process.env.DB_PASS
        // if (!dbName || !dbPass) {
        //     throw new Error('Missing database credentials in environment variables');
        // }
        // const dbURL=`mongodb+srv://${dbName}:${dbPass}@cluster0.hato0.mongodb.net/`
        const dbURL=`mongodb+srv://akshit:akshit123@cluster0.hato0.mongodb.net/`

        await mongoose.connect(dbURL)
        console.log('database connected')
    }
    catch(err){
        console.error('MongoDB connection error:', err)
    }
}

export default connectDB