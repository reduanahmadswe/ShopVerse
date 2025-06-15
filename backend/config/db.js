import mongoose from "mongoose";

export const connectMOngoDatabase = () => {
    mongoose.connect(process.env.DB_URI).
        then((data) => {
            console.log("MongoDB connected with server: ", data.connection.host);
        }).catch((error) => {
            console.error("Database connection failed:", error);
        });
}
