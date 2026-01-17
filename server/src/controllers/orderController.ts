import { Request, Response } from 'express';
import Order from '../models/Order';
import { sendOrderEmail } from '../utils/email'; // Import the new service

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
    
    // --- SEND EMAIL NOTIFICATION ---
    // We don't await this because we don't want to make the user wait for the email to send
    sendOrderEmail(savedOrder); 

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({ message: 'Server Error: Could not place order' });
  }
};

// ... keep getAllOrders and updateOrderStatus as they were
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status' });
  }
};