import mongoose, { mongo } from "mongoose";

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL!);
        console.log("connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}