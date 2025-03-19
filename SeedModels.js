const mongoose = require("mongoose");
const Model = require("./models/Models"); // Adjust the path as needed 
require("dotenv").config();


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Sample data
const seedData = [
    {
      name: "Yollanda Chimbarami",
      bio: "A passionate advocate for women's empowerment and education.",
      images: ["https://example.com/yollanda1.jpg", "https://example.com/yollanda2.jpg"],
      votes: 120,
      pageantId: new mongoose.Types.ObjectId(),
    },
    {
      name: "Tariro Chikosha",
      bio: "A model with a love for fashion and sustainable clothing.",
      images: ["https://example.com/tariro1.jpg", "https://example.com/tariro2.jpg"],
      votes: 98,
      pageantId: new mongoose.Types.ObjectId(),
    },
    {
      name: "Michelle Dube",
      bio: "A fitness enthusiast who promotes healthy living.",
      images: ["https://example.com/michelle1.jpg", "https://example.com/michelle2.jpg"],
      votes: 85,
      pageantId: new mongoose.Types.ObjectId(),
    },
    {
      name: "Nokutenda Moyo",
      bio: "Aspiring actress with a deep love for storytelling.",
      images: ["https://example.com/noku1.jpg", "https://example.com/noku2.jpg"],
      votes: 150,
      pageantId: new mongoose.Types.ObjectId(),
    },
    {
      name: "Tatenda Ncube",
      bio: "An advocate for mental health awareness in young women.",
      images: ["https://example.com/tatenda1.jpg", "https://example.com/tatenda2.jpg"],
      votes: 60,
      pageantId: new mongoose.Types.ObjectId(),
    },
    {
      name: "Rutendo Mhizha",
      bio: "Passionate about environmental conservation and sustainability.",
      images: ["https://example.com/rutendo1.jpg", "https://example.com/rutendo2.jpg"],
      votes: 72,
      pageantId: new mongoose.Types.ObjectId(),
    },
    {
      name: "Amanda Katsande",
      bio: "A singer and performer who uses her talent for social change.",
      images: ["https://example.com/amanda1.jpg", "https://example.com/amanda2.jpg"],
      votes: 115,
      pageantId: new mongoose.Types.ObjectId(),
    },
    {
      name: "Shamiso Gwekwerere",
      bio: "A future lawyer advocating for human rights.",
      images: ["https://example.com/shamiso1.jpg", "https://example.com/shamiso2.jpg"],
      votes: 88,
      pageantId: new mongoose.Types.ObjectId(),
    },
    {
      name: "Chenai Mandizha",
      bio: "Fashion model and entrepreneur promoting African designs.",
      images: ["https://example.com/chenai1.jpg", "https://example.com/chenai2.jpg"],
      votes: 135,
      pageantId: new mongoose.Types.ObjectId(),
    },
    {
      name: "Patience Madziva",
      bio: "Public speaker and life coach inspiring young women.",
      images: ["https://example.com/patience1.jpg", "https://example.com/patience2.jpg"],
      votes: 90,
      pageantId: new mongoose.Types.ObjectId(),
    },
    {
      name: "Precious Nyamukapa",
      bio: "Engineer and tech enthusiast breaking barriers in STEM.",
      images: ["https://example.com/precious1.jpg", "https://example.com/precious2.jpg"],
      votes: 105,
      pageantId: new mongoose.Types.ObjectId(),
    },
    {
      name: "Samantha Musarurwa",
      bio: "Lover of arts and culture, promoting African heritage.",
      images: ["https://example.com/samantha1.jpg", "https://example.com/samantha2.jpg"],
      votes: 140,
      pageantId: new mongoose.Types.ObjectId(),
    }
  ];

// Seed data into the database
const seedDatabase = async () => {
  try {
    await Model.insertMany(seedData);
    console.log("Data seeded successfully!");
  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed script
seedDatabase();
