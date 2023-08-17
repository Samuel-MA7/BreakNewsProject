import mongoose from "mongoose";

const connectDatabase = () => {
    console.log("Connecting to database...");

    mongoose.connect(
        process.env.MONGODB_URI, 
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("MongoDb Atlas connected."))
    .catch((error) => console.log(error));
};

export default connectDatabase;