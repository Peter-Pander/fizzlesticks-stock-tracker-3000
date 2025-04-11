# ✨ Fizzlestick's Stock Tracker 3000 🔮✨

A full-stack MERN app featuring a backend API with Express and MongoDB, and a frontend built with Vite + React.

## 📦 Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Express.js (v4), Node.js
- **Database:** MongoDB (via Mongoose)
- **Runtime:** Node.js
- **Environment:** Development & Production modes supported

## 🚀 Features

- Create, read, update, and delete products via REST API
- Clean Express routing and controller structure
- Vite frontend build served statically in production
- Scripts for development, production, and build automation

## 📂 Project Structure

```
mern-crash-course/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── src/
│   └── dist/ (auto-generated)
│
├── .env
├── package.json
└── README.md
```

## 🛠 Scripts

In the root `package.json`:

| Script          | Description                                |
|------------------|--------------------------------------------|
| `npm run dev`     | Start backend in development with nodemon  |
| `npm run build`   | Install dependencies & build frontend     |
| `npm start`       | Run backend in production (serves frontend)|


## ⚙️ Environment Variables

Create a `.env` file in the root with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```


## 🧪 Test Locally

```bash
# Install backend deps
npm install

# Install frontend deps
npm install --prefix frontend

# Build frontend
npm run build

# Run server in production mode
npm start
```


## 🔗 Deployment

- Frontend is built with Vite and served from `frontend/dist` in production
- Backend connects to MongoDB Atlas or a local instance
