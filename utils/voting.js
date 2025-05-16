const Model = require("../models/Models");

/**
 * Increments votes for a given model.
 * @param {string} modelId - The ID of the model.
 * @param {number} votesToAdd - The number of votes to add.
 * @returns {Promise<Object>} - The updated model document.
 */
exports.incrementModelVotes = async (modelId, votesToAdd = 1) => {
  if (!modelId || typeof modelId !== 'string') {
    throw new Error("Invalid model ID");
  }

  const votes = parseInt(votesToAdd, 10);
  if (isNaN(votes) || votes <= 0) {
    throw new Error("Invalid vote count");
  }

  const updatedModel = await Model.findByIdAndUpdate(
    modelId,
    { $inc: { votes } },
    { new: true }
  ).populate("pageantId");

  if (!updatedModel) {
    throw new Error(`Model not found: ${modelId}`);
  }

  return updatedModel;
};
