const service = require("./reviews.service");
const hasProperties = require("../errors/hasProperties"); // import to check if the request meets all property requirements
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const VALID_PROPERTIES = [
    "review_id",
    "content",
    "score",
    "created_at",
    "updated_at",
    "critic_id",
    "movie_id",
];

function hasValidProperties(req, res, next) {
    const { data = {} } = req.body;

    const invalidFields = Object.keys(data).filter(field => !VALID_PROPERTIES.includes(field));  // Check all VALID_PROPERTIES requirement is being met

    if(invalidFields.length) {
        return next({
            status: 400,
            message: `Invalid field(s): ${invalidFields.join(", ")}`,
        });
    }
    next();
};


async function reviewExists(req, res, next) {
    const review = await service.read(req.params.reviewId);
    if(review) {
        res.locals.review = review;
        return next();
    }
    next({
        status: 404,
        message: "Review cannot be found." 
    });
};

async function list(req, res) {
    const { movieId } = req.params;
    const data = await service.list(movieId);
    res.json({ data });
};

async function read(req, res) {
    const { review: data } = res.locals;
    res.json({ data });
};


const hasRequiredProperties = hasProperties("content");  // Need to use to check if requested update has the required properties in the body

async function update(req, res, next) {
    const updatedReview = {
        ...req.body.data,
        review_id: res.locals.review.review_id,
    };
    await service.update(updatedReview);
    const data = await service.read(res.locals.review.review_id);
    const addCritic = await service.addCriticToReview(data);
    res.json({ data: addCritic });
};

async function destroy(req, res, next) {
    const { review } = res.locals;
    await service.delete(review.review_id);
    res.sendStatus(204);
};

module.exports = {
    list: [asyncErrorBoundary(list)],
    read: [asyncErrorBoundary(reviewExists), read],
    update: [asyncErrorBoundary(reviewExists), hasValidProperties ,hasRequiredProperties, asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};