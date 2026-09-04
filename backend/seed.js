import "dotenv/config";
import { connectDB } from "./config/db.js";
import Listing from "./src/models/Listing.js";
import Claim from "./src/models/Claim.js";
import User from "./src/models/User.js";

async function seed() {
  try {
    await connectDB();
    console.log("Connected to MongoDB Atlas.");

    // Clear existing data
    await Promise.all([Listing.deleteMany({}), Claim.deleteMany({}), User.deleteMany({})]);

    // Create demo users
    const donorUser = await User.create({
      name: "Kamal Perera",
      email: "abc@restaurant.lk",
      password: "password123",
      role: "donor",
      businessName: "ABC Restaurant",
      phone: "077 555 1234",
    });

    await User.create({
      name: "Nimal Perera",
      email: "nimal@gmail.com",
      password: "password123",
      role: "claimer",
      businessName: "",
      phone: "077 123 4567",
    });

    // Create demo listings
    const listings = [
      {
        donorId: donorUser._id,
        businessName: "ABC Restaurant",
        foodName: "Rice & Curry",
        category: "Rice & Curry",
        quantityTotal: 15,
        quantityAvailable: 15,
        unit: "portions",
        location: "Negombo",
        pickupDeadline: "8:00 PM",
        price: "free",
        discountLabel: null,
        description: "Chicken curry, dhal, and three vegetable sides, packed fresh this evening.",
        status: "available",
        postedAt: new Date(),
      },
      {
        businessName: "Golden Crust Bakery",
        foodName: "Bread & Pastries",
        category: "Bakery & Bread",
        quantityTotal: 25,
        quantityAvailable: 25,
        unit: "items",
        location: "Gampaha",
        pickupDeadline: "7:30 PM",
        price: "discounted",
        discountLabel: "50% OFF",
        description: "Assorted loaves, buns and short-eats baked this morning — still fresh, just unsold.",
        status: "available",
        postedAt: new Date(Date.now() - 3600000),
      },
      {
        businessName: "Sunrise Café",
        foodName: "Pastries & Cakes",
        category: "Pastries & Desserts",
        quantityTotal: 20,
        quantityAvailable: 14,
        unit: "items",
        location: "Wattala",
        pickupDeadline: "6:45 PM",
        price: "discounted",
        discountLabel: "30% OFF",
        description: "End-of-day display case: cupcakes, croissants and a few slices of cake.",
        status: "available",
        postedAt: new Date(Date.now() - 7200000),
      },
      {
        businessName: "FreshMart Supermarket",
        foodName: "Mixed Vegetables",
        category: "Produce",
        quantityTotal: 30,
        quantityAvailable: 30,
        unit: "kg",
        location: "Negombo",
        pickupDeadline: "8:30 PM",
        price: "free",
        discountLabel: null,
        description: "Slightly bruised but good produce pulled from today's shelves — carrots, beans, leeks.",
        status: "available",
        postedAt: new Date(Date.now() - 10800000),
      },
      {
        businessName: "Spice Route Restaurant",
        foodName: "Kottu & Curry",
        category: "Rice & Curry",
        quantityTotal: 12,
        quantityAvailable: 5,
        unit: "portions",
        location: "Kurunegala",
        pickupDeadline: "9:30 PM",
        price: "discounted",
        discountLabel: "40% OFF",
        description: "Chicken kottu with a side of gravy — cooked in excess for a cancelled order.",
        status: "available",
        postedAt: new Date(Date.now() - 14400000),
      },
      {
        businessName: "Hilltop Bakers",
        foodName: "Milk & Dairy Pack",
        category: "Dairy & Beverages",
        quantityTotal: 18,
        quantityAvailable: 18,
        unit: "items",
        location: "Kandy",
        pickupDeadline: "7:00 PM",
        price: "free",
        discountLabel: null,
        description: "Short-dated yoghurt cups and milk packets, still well within safe use.",
        status: "available",
        postedAt: new Date(Date.now() - 18000000),
      },
    ];

    await Listing.insertMany(listings);
    console.log("Successfully seeded MongoDB Atlas with users and listings!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
