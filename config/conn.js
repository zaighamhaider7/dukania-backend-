const { default: mongoose } = require("mongoose")

const conn = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error);
    }
}

module.exports = conn;