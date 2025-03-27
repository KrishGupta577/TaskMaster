import mongoose from "mongoose";

const connectDB = () => {

    mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => { console.log('DB connected.') }).catch((error) => { console.log(error) })

}

export default connectDB