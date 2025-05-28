const express = require("express");
const router = express.Router();
const {
  createPageant,
  getAllPageants,
  getPageantById,
  getOngoingPageants,
  getPastPageants,
  updatePageant,
  updatePageantStatus,
  deletePageant,
  getPageantBySlug 
} = require("../controllers/pageantController");

router.post("/", createPageant);
router.get("/", getAllPageants);
router.get("/ongoing", getOngoingPageants);
router.get("/past", getPastPageants);
router.get("/:id", getPageantById);
router.put("/:id", updatePageant);
router.get("/slug/:slug", getPageantBySlug); 
router.patch("/:id/status", updatePageantStatus);
router.delete("/:id", deletePageant);

module.exports = router;
