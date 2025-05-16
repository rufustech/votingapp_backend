const mongoose = require("mongoose");
const Model = require("./models/Models"); // Adjust the path as needed
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Increment votes for a specific model (by ID)
const incrementVotes = async (modelId, additionalVotes) => {
  try {
    // Find the model by ID and increment its votes
    const result = await Model.findByIdAndUpdate(
      modelId, // The model's ID to search for
      { $inc: { votes: additionalVotes } }, // Increment the votes field
      { new: true, runValidators: true } // `new: true` returns the updated document
    );

    if (result) {
      console.log(`Successfully updated votes for model: ${result.name}`);
      console.log("Updated document:", JSON.stringify(result, null, 2)); // Log the entire document in pretty JSON format
    } else {
      console.log(`No model found with the ID: ${modelId}`);
    }
  } catch (err) {
    console.error("Error updating votes:", err);
  } finally {
    mongoose.connection.close();
  }
};

// Example usage
const modelId = "682155594a14394b2732feb5"; // Replace with a valid model ID from your seed data
const additionalVotes = 50; // Replace with the number of votes you want to add

// Run the incrementVotes function
incrementVotes(modelId, additionalVotes);
