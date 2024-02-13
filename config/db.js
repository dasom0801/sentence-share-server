import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log('Database is connected');
  } catch (error) {
    console.log(`Error ${error.message}`);
  }
};

export default connectDB;
