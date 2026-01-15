# Heaven Cakes 🍰

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application for a custom cake shop.

## Features
- 🎨 Modern Sage & Cream UI (Tailwind CSS)
- 🛒 Shopping Cart & Dynamic Pricing (by Weight)
- 🔐 Admin Dashboard (JWT Authentication)
- 📸 Image Uploads (Cloudinary)
- 📱 Fully Responsive (Mobile Hamburger Menu & Modals)

## How to Run

1. **Clone the repo**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/heaven-cakes.git](https://github.com/YOUR_USERNAME/heaven-cakes.git)


# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install

# Inside server folder
server/.env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Inside client folder
VITE_API_URL=http://localhost:5000/api

# To run 
cd server
npm run dev

cd client
npm run dev

---

### **Step 2: Save and Push**

Once you have pasted that text into the file and saved it, **go to your terminal** and run those Git commands you mentioned to update the page on GitHub:

```bash
git add README.md
git commit -m "Add installation instructions"
git push