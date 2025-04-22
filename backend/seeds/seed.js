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
  // find Bob if he exists
  let bob = await User.findOne({ email: "bob@example.com" });
  if (bob) {
    // delete only Bob’s products
    await Product.deleteMany({ user: bob._id });
    // delete Bob so we can recreate fresh below
    await User.deleteOne({ _id: bob._id });
  } else {
    // ensure no stray Bob entry
    await User.deleteOne({ email: "bob@example.com" });
  }

  // —– create Bob —–
  const bobPw = await bcrypt.hash("secret", 10);
  bob = await User.create({ email: "bob@example.com", password: bobPw });

  // —– Bob’s six fantasy products —–
  const defaultProducts = [
    {
      name: "Everburn Candle",
      price: 30, quantity: 4,
      imageUrl: "https://res.cloudinary.com/dadymzua9/image/upload/6.Everburn_Candle_jmwdhf"
    },
    {
      name: "Boots of Sneaking",
      price: 80, quantity: 80,
      imageUrl: "https://res.cloudinary.com/dadymzua9/image/upload/5.Boots_of_Sneaking_ewepzx"
    },
    {
      name: "Crystal of Teleportation",
      price: 55, quantity: 15,
      imageUrl: "https://res.cloudinary.com/dadymzua9/image/upload/3.Crystal_of_Teleportation_sjcp6o"
    },
    {
      name: "Boom-Buddy",
      price: 10, quantity: 50,
      imageUrl: "https://res.cloudinary.com/dadymzua9/image/upload/4.Boom-Buddy_qu1ss3"
    },
    {
      name: "Healing Potion",
      price: 15, quantity: 140,
      imageUrl: "https://res.cloudinary.com/dadymzua9/image/upload/1.healing-potion_junfvj"
    },
    {
      name: "Mana Potion",
      price: 15, quantity: 200,
      imageUrl: "https://res.cloudinary.com/dadymzua9/image/upload/2.mana-potion_jw4k4y"
    }
  ];

  await Product.insertMany(
    defaultProducts.map(p => ({ ...p, user: bob._id }))
  );
  console.log("✅ Seeded Bob + demo products");

  await mongoose.disconnect();
}

seed();
