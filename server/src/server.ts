import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import Product from './models/Product';
import { upload } from './config/cloudinary';
import { createOrder } from './controllers/orderController';
import { login } from './controllers/authController';
import { createUser, getAllUsers, deleteUser } from './controllers/userController'; // Import new controller
import { auth } from './middleware/auth';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// --- MIDDLEWARE FOR ROLE CHECK ---
const requireSuperAdmin = (req: any, res: any, next: any) => {
    if (req.user && req.user.role === 'super-admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access Denied: Super Admin only' });
    }
};

// --- ROUTES ---

// Auth
app.post('/api/auth/login', login);

// Product Routes
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// CAKE UPLOAD: Protected (Any logged in user can upload, BUT frontend hides it for Super Admin)
// If you want to strictly ban Super Admin from uploading API-side, add a check here.
app.post('/api/products', auth, upload.single('image'), async (req: any, res: any): Promise<void> => {
    try {
        // OPTIONAL: Strictly forbid super-admin from uploading
        // if (req.user.role === 'super-admin') return res.status(403).json({ message: "Super Admins cannot upload cakes." });

        const { title, description, category, variants } = req.body;
        if (!req.file) { res.status(400).json({ message: 'Image is required' }); return; }

        let parsedVariants = [];
        try { parsedVariants = JSON.parse(variants); } 
        catch (e) { res.status(400).json({ message: 'Invalid variants' }); return; }

        const newProduct = new Product({
            title, description, category,
            variants: parsedVariants, 
            imageUrl: req.file.path 
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error saving product' });
    }
});

// Order Route
app.post('/api/orders', createOrder);

// --- NEW USER MANAGEMENT ROUTES (Super Admin Only) ---
app.get('/api/users', auth, requireSuperAdmin, getAllUsers);
app.post('/api/users', auth, requireSuperAdmin, createUser);
app.delete('/api/users/:id', auth, requireSuperAdmin, deleteUser);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));