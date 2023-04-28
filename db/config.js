const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("DB online!");
  } catch (e) {
    throw new Error("Error initializing th DB", e);
  }
};

module.exports = {
  dbConnection,
};
