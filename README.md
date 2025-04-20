# ✨ Fizzlestick's Stock Tracker 3000 🔮✨

Fizzlestick's Stock Tracker 3000 is a modern inventory management application built on a MERN stack foundation. It provides small business owners, shop managers, and product-based teams with an intuitive interface to manage stock, track low inventory, and update product details quickly. The app includes user accounts, image uploads, real-time feedback, and customizable inventory settings for a seamless experience across desktop and mobile.


## 🚀 Getting Started

### 📌 Setup

1. Clone the repo  
   ```bash
   git clone https://github.com/Peter-Pander/fizzlesticks-stock-tracker-3000.git
   cd fizzlesticks-stock-tracker-3000
   ```

2. Install backend dependencies  
   ```bash
   npm install
   ```

3. Install frontend dependencies  
   ```bash
   npm install --prefix frontend
   ```

4. Create a `.env` file in the root folder with:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

5. Run in development mode  
   ```bash
   npm run dev
   ```

6. To build for production  
   ```bash
   npm run build
   npm start
   ```


## 🧰 Tech Stack

- **Frontend**: React (Vite) + Chakra UI
- **Backend**: Express.js + Node.js
- **Database**: MongoDB (Mongoose)
- **Hosting**: Render
- **UX Enhancements**: Toasts, Modals, Tooltips, Image Uploads
- **Persistence**: LocalStorage


## ⚙️ Features

### 📦 Product Management
- Create new products with a name, price, quantity, and optional image
- Upload custom images for flair
- Edit product details using styled modals
- Quick Sell and Restock buttons to update stock instantly
- Delete items no longer for sale

### 📉 Low Stock Warnings
- Products below your set threshold are marked with a warning icon
- Customize the threshold in Inventory Settings
- Option to show only low stock items

### ⚙️ Inventory Settings
- Set a custom currency label (e.g. $, €, ¥, “Yen”, or 💎)
- Choose sort order: quantity, name, or price (both directions)
- Reset preferences to default anytime
- All preferences are saved locally via `localStorage`

### ✨ User Experience
- Chakra UI styled components with responsive layout
- Light and dark mode support
- Tooltips for guidance
- Real-time toast feedback (e.g. “Product renamed!”)
- Works seamlessly on both desktop and mobile

### 🔒 Account Features
- Secure user registration and login
- Private inventory per user account
- Top-right avatar icon for logout


## 📂 Project Structure

```
fizzlesticks-stock-tracker-3000/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   └── dist/ – Generated production build (via Vite)

│
├── .env
├── package.json
└── README.md
```


## 🛸 Deployment

- Frontend is built using Vite and served statically in production
- Fullstack deployment is hosted on Render
- Uses MongoDB Atlas for cloud database


## 🙏 Credits

This project is based on **Section 2** of the [100 Hours Web Development Bootcamp - Build 23 React Projects](https://www.udemy.com/course/the-web-dev-bootcamp) by **Burak Orkmez**, with significant custom feature development and enhancements.


## 👨‍💻 Creator

**Maximilian Schöpf**  
🌐 Portfolio: [maxschoepf.com](https://maxschoepf.com)  
💼 LinkedIn: [linkedin.com/in/maximilian-schöpf-19307523b](https://www.linkedin.com/in/maximilian-schöpf-19307523b)
