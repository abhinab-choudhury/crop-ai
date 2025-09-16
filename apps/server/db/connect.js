import mongoose from 'mongoose';
import env from '../utils/env';

await mongoose.connect(env.DATABASE_URL).catch((error) => {
  console.log('Error connecting to database:', error);
});

const client = mongoose.connection.getClient().db('crop-ai');

export { client };
