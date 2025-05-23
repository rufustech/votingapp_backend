const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Pageant = require("./models/PageantModel");

dotenv.config();

const generateSlug = (name) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")           // Replace spaces with dashes
    .replace(/[^a-z0-9\-]/g, "")     // Remove non-alphanumeric/dashes
    .trim();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const updateSlugs = async () => {
  try {
    const pageants = await Pageant.find();

    for (const p of pageants) {
      const slug = generateSlug(p.name);
      p.pageantSlug = slug;
      await p.save();
      console.log(`✅ Updated ${p.name} with slug: ${slug}`);
    }

    console.log("🎉 All pageants updated with slugs.");
  } catch (err) {
    console.error("❌ Error updating slugs:", err);
  } finally {
    mongoose.connection.close();
  }
};

updateSlugs();
