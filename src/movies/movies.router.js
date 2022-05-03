const router = require("express").Router();
const controller = require("./movies.controller");
const reviewsRouter = require("../reviews/reviews.router");
const theatersRouter = require("../theaters/theaters.router");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.use("/:movieId/theaters", controller.movieExists, theatersRouter); // Uses theater component to return theater data for specific movies
router.use("/:movieId/reviews", controller.movieExists, reviewsRouter);  // Uses reviews compenent to return review data for specific movies

router.route("/:movieId").get(controller.read).all(methodNotAllowed);
router.route("/").get(controller.list).all(methodNotAllowed);

module.exports = router;