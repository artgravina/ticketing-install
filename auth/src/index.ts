import { app } from './app';
import mongoose from 'mongoose';

const start = async () => {
  try {
    console.log('auth starting up number: 12');
    if (!process.env.JWT_KEY) {
      throw new Error('JWT_KEY must be defined');
    }
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI must be defined');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to mongodb');
  } catch (error) {
    console.error('Auth Start Error: ', error);
  }
  app.listen(3000, () => {
    console.log('Auth users: listening on port 3000 version 1');
  });
};

start();
