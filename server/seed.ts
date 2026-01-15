import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI as string).then(async () => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt); // Your password
    await User.create({ username: 'admin', passwordHash: hash, role: 'super-admin' });
    console.log('Super Admin Created');
    process.exit();
});