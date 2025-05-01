const mongoose = require("mongoose");
const Pageant = require("./models/PageantModel"); // Adjust the path as needed
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Sample Pageant Data
const seedData = [
  {
    name: "Miss Universe 2025",
    
    startDate: "2025-01-10",
    endDate: "2025-01-25",
    pageantId: "1",
  status: "Upcoming",
  },
  {
    name: "Miss World 2025",
    pageantId: "2",
    startDate: "2025-02-15",
    endDate: "2025-03-01",
    status: "Upcoming",
  },
  {
    name: "Miss Earth 2025",
    pageantId: "3",
    startDate: "2025-03-20",
    endDate: "2025-04-05",
    status: "Upcoming",
  },
  {
    name: "Miss International 2025",
    pageantId: "4",
    startDate: "2025-04-12",
    endDate: "2025-04-28",
    status: "Upcoming",
  },
  {
    name: "Miss Supranational 2025",
    pageantId: "5",
    startDate: "2025-05-08",
    endDate: "2025-05-24",
    status: "Upcoming",
  },
  {
    name: "Miss Grand International 2025",
    pageantId: "6",
    startDate: "2025-06-05",
    endDate: "2025-06-20",
    status: "Upcoming",
  },
  {
    name: "Miss Teen Universe 2025",
    pageantId: "7",
    startDate: "2025-07-10",
    endDate: "2025-07-25",
    status: "Upcoming",
  },
  {
    name: "Miss Africa 2025", 
    pageantId: "8",
    startDate: "2025-08-15",
    endDate: "2025-08-30",
    status: "Upcoming",
  },
  {
    name: "Miss Global 2025",
    pageantId: "9",
    startDate: "2025-09-10",
    endDate: "2025-09-27",
    status: "Upcoming",
  },
  {
    name: "Miss Intercontinental 2025",
    pageantId: "10",
    startDate: "2025-10-18",
    endDate: "2025-11-02",
    status: "Upcoming",
  },
];

// Seed data into the database
const seedDatabase = async () => {
  try {
    await Pageant.deleteMany({}); // Clears existing data
    await Pageant.insertMany(seedData);
    console.log("Pageant data seeded successfully!");
  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed script
seedDatabase();
