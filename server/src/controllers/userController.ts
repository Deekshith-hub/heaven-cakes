import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';

// GET all users (Super Admin only)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        // Exclude password hash from results
        const users = await User.find().select('-passwordHash');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// CREATE new user (Super Admin only)
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password || !role) {
            res.status(400).json({ message: 'Please enter all fields' });
            return;
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(400).json({ message: 'Username already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            passwordHash: hash,
            role // 'admin' or 'super-admin'
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: { username, role } });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// DELETE user (Super Admin only)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};