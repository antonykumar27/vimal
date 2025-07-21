// const products = require("../utils/userSeeder");
// const User = require("../models/userModel");
// const dotenv = require("dotenv");
// const connectDatabase = require("../config/database");

// dotenv.config({ path: "backend/config/config.env" });
// connectDatabase();

// const seedProducts = async () => {
//   try {
//     await Product.deleteMany();

//     await Product.insertMany(products);
//   } catch (error) {}
//   process.exit();
// };

// seedProducts();
const users = require("../utils/userSeeder"); // your user seed data
const User = require("../models/userModel");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");

dotenv.config({ path: "backend/config/config.env" });
connectDatabase();

const seedUsers = async () => {
  try {
    await User.deleteMany(); // delete existing users

    await User.insertMany(users); // insert seed users

    console.log("User data seeded successfully.");
  } catch (error) {
    console.error("Error while seeding users:", error);
  }
  process.exit();
};

seedUsers();
