import mongoose from 'mongoose'

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.DATABASE_URL || "")
        console.log('Database connected', conn.connection.host)
    }catch(e){
        console.error(e)
    }
}