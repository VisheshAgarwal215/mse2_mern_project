const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createGrievance,
  deleteGrievance,
  getGrievanceById,
  getMyGrievances,
  searchMyGrievances,
  updateGrievance,
} = require("../controllers/grievanceController");

const router = express.Router();

router.use(protect);

router.get("/search", searchMyGrievances);
router.route("/").post(createGrievance).get(getMyGrievances);
router.route("/:id").get(getGrievanceById).put(updateGrievance).delete(deleteGrievance);

module.exports = router;
