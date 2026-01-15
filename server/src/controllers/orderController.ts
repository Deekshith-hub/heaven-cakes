import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your SMTP provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerName, address, phone, items, totalAmount } = req.body;

    // 1. Construct Email Content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.OWNER_EMAIL, // Owner receives this
      subject: `New Order from ${customerName} - Heaven Cakes`,
      html: `
        <h2>New Order Received!</h2>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}</p>
        <h3>Order Details:</h3>
        <ul>
          ${items.map((item: any) => `<li>${item.title} - ${item.weight}kg (Qty: ${item.qty})</li>`).join('')}
        </ul>
        <h3>Total Amount: ₹${totalAmount} (COD)</h3>
      `,
    };

    // 2. Send Email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Order placed successfully and owner notified!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to place order' });
  }
};