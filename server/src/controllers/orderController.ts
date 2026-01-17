import { Request, Response } from 'express';
import Order from '../models/Order';

// Create Order (Public)
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerName, phone, address, items, totalAmount, deliveryDate, timeSlot } = req.body;

    if (!customerName || !phone || !address || !items || !deliveryDate || !timeSlot) {
      return res.status(400).json({ message: 'Please fill all details including Delivery Date & Time' });
    }

    const newOrder = new Order({
      customerName,
      phone,
      address,
      items,
      totalAmount,
      deliveryDate,
      timeSlot
    });

    const savedOrder = await newOrder.save();
    
    // In a real app, trigger Email/SMS notification logic here
    console.log(`Notification: Order #${savedOrder._id} placed for ${customerName}`);

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({ message: 'Server Error: Could not place order' });
  }
};

// Get All Orders (Admin Only)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    // Sort by most recent first
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Update Order Status (Admin Only)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status' });
  }
};