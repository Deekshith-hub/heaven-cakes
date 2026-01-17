import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import Product from './models/Product';
import { upload } from './config/cloudinary';
import { createOrder, getAllOrders, updateOrderStatus } from './controllers/orderController';
import { login } from './controllers/authController';
import { createUser, getAllUsers, deleteUser } from './controllers/userController';
import { auth } from './middleware/auth';

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "*", // Allow all origins (Easiest for deployment)
  credentials: true
}));
app.use(express.json());

// --- MIDDLEWARE ---
const requireSuperAdmin = (req: any, res: any, next: any) => {
    if (req.user && req.user.role === 'super-admin') next();
    else res.status(403).json({ message: 'Super Admin access required' });
};

// --- ROUTES ---

// Auth
app.post('/api/auth/login', login);

// Products
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.post('/api/products', auth, upload.single('image'), async (req: any, res: any): Promise<void> => {
    try {
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

// Orders
app.post('/api/orders', createOrder); // Public place order
app.get('/api/orders', auth, getAllOrders); // Admin view all
app.put('/api/orders/:id', auth, updateOrderStatus); // Admin update status

// User Management (Super Admin)
app.get('/api/users', auth, requireSuperAdmin, getAllUsers);
app.post('/api/users', auth, requireSuperAdmin, createUser);
app.delete('/api/users/:id', auth, requireSuperAdmin, deleteUser);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));