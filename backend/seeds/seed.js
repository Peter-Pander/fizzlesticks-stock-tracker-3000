// seed.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

async function seed() {
  // connect using the env var you actually have
  await mongoose.connect(process.env.MONGO_URI);

  // —– remove any old Bob + their products —–
  await Product.deleteMany({});    // or just { userEmail:"bob@example.com" }
  await User.deleteOne({ email: "bob@example.com" });

  // —– create Bob —–
  const bobPw = await bcrypt.hash("secret", 10);
  const bob = await User.create({ email: "bob@example.com", password: bobPw });

  // —– Bob’s six fantasy products —–
  const defaultProducts = [
    {
      name: "Everburn Candle",
      price: 30, quantity: 4,
      picture: "https://res.cloudinary.com/dadymzua9/image/upload/v1/6.Everburn_Candle_jmwdhf"
    },
    {
      name: "Boots of Sneaking",
      price: 80, quantity: 80,
      picture: "https://res.cloudinary.com/dadymzua9/image/upload/v1/5.Boots_of_Sneaking_ewepzx"
    },
    {
      name: "Crystal of Teleportation",
      price: 55, quantity: 15,
      picture: "https://res.cloudinary.com/dadymzua9/image/upload/v1/3.Crystal_of_Teleportation_sjcp6o"
    },
    {
      name: "Boom-Buddy",
      price: 10, quantity: 50,
      picture: "https://res.cloudinary.com/dadymzua9/image/upload/v1/4.Boom-Buddy_qu1ss3"
    },
    {
      name: "Healing Potion",
      price: 15, quantity: 140,
      picture: "https://res.cloudinary.com/dadymzua9/image/upload/v1/1.healing-potion_junfvj"
    },
    {
      name: "Mana Potion",
      price: 15, quantity: 200,
      picture: "https://res.cloudinary.com/dadymzua9/image/upload/v1/2.mana-potion_jw4k4y"
    }
  ];

  await Product.insertMany(
    defaultProducts.map(p => ({ ...p, user: bob._id }))
  );
  console.log("✅ Seeded Bob + demo products");

  await mongoose.disconnect();
}

seed();
