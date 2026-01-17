import nodemailer from 'nodemailer';
import { IOrder } from '../models/Order';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS  // Your Gmail App Password
  }
});

export const sendOrderEmail = async (order: IOrder) => {
  try {
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">
            <strong>${item.title}</strong> (${item.weight}kg)<br>
            <span style="font-size: 12px; color: #666;">
                ${item.customMessage ? `Msg: "${item.customMessage}"` : ''} 
                ${item.customization ? `Note: ${item.customization}` : ''}
            </span>
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">x${item.qty}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">₹${item.price}</td>
      </tr>
    `).join('');

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #43766C;">New Order Received! 🎂</h2>
        <p><strong>Order ID:</strong> #${order._id}</p>
        <p><strong>Customer:</strong> ${order.customerName} (${order.phone})</p>
        <p><strong>Delivery:</strong> ${new Date(order.deliveryDate).toDateString()} | ${order.timeSlot}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background-color: #F8FAE5; text-align: left;">
            <th style="padding: 8px;">Item</th>
            <th style="padding: 8px;">Qty</th>
            <th style="padding: 8px;">Price</th>
          </tr>
          ${itemsHtml}
        </table>

        <h3 style="text-align: right; color: #43766C; margin-top: 20px;">Total: ₹${order.totalAmount}</h3>
      </div>
    `;

    const mailOptions = {
      from: `"Heaven Cakes" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL, // Send to Owner
      subject: `New Order from ${order.customerName} - ₹${order.totalAmount}`,
      html: emailContent
    };

    await transporter.sendMail(mailOptions);
    console.log('Order email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};