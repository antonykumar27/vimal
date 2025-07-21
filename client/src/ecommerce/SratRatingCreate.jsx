import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaSpinner, FaCheck } from "react-icons/fa";
import { useCreateProductReviewsMutation } from "../../store/api/ProductAdminApi";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/middlewares/AuthContext";

const StarRatingCreate = ({ productId, product }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [existingRating, setExistingRating] = useState(0);

  const averageRating = product.averageReview || 0;
  const numReviews = product.numOfReviews || 0;

  const [createReview, { isLoading }] = useCreateProductReviewsMutation();

  // Check if user has already reviewed this product
  useEffect(() => {
    if (user && product?.reviews) {
      const userReview = product.reviews.find(
        (review) => review.user === user._id
      );

      if (userReview) {
        setUserHasReviewed(true);
        setExistingRating(userReview.rating);
        setRating(userReview.rating);
      }
    }
  }, [user, product]);

  const handleRatingClick = async (selectedRating) => {
    if (userHasReviewed) {
      toast.info("You've already reviewed this product");
      return;
    }

    setRating(selectedRating);

    try {
      const res = await createReview({
        productId,
        rating: selectedRating,
      }).unwrap();

      toast.success("Review submitted successfully!");
      setUserHasReviewed(true);
      setExistingRating(selectedRating);
      setShowPopup(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  // Render stars for rating display
  const renderStars = (ratingValue) => {
    return [...Array(5)].map((_, i) => {
      const starValue = i + 1;
      return (
        <span key={i}>
          {starValue <= ratingValue ? (
            <FaStar className="text-yellow-400" />
          ) : (
            <FaRegStar className="text-gray-300" />
          )}
        </span>
      );
    });
  };

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        {/* Average Rating Display */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="text-3xl font-bold text-gray-800">
              {averageRating.toFixed(1)}
            </div>
            <div className="ml-2 text-gray-500">/5</div>
          </div>
          <div className="flex text-lg">{renderStars(averageRating)}</div>
          <div className="text-sm text-gray-500 mt-1">
            {numReviews} review{numReviews !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Rating Button */}
        <div className="relative">
          <button
            onMouseEnter={() => !userHasReviewed && setShowPopup(true)}
            onMouseLeave={() => !isLoading && setShowPopup(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              userHasReviewed
                ? "bg-green-100 text-green-700"
                : rating > 0
                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } ${isLoading ? "cursor-not-allowed opacity-75" : ""}`}
            disabled={isLoading || userHasReviewed}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Submitting...</span>
              </>
            ) : userHasReviewed ? (
              <>
                <FaCheck className="text-green-500" />
                <span>Your Rating: {existingRating}</span>
              </>
            ) : rating > 0 ? (
              <>
                <FaStar className="text-yellow-500" />
                <span>Your Rating: {rating}</span>
              </>
            ) : (
              <>
                <FaRegStar />
                <span>Rate Product</span>
              </>
            )}
          </button>

          <AnimatePresence>
            {showPopup && !userHasReviewed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-10 top-full left-0 mt-3 w-72 bg-white rounded-xl shadow-xl p-4 border border-gray-100"
                onMouseEnter={() => setShowPopup(true)}
                onMouseLeave={() => !isLoading && setShowPopup(false)}
              >
                <div className="mb-3 text-center">
                  <h3 className="font-semibold text-gray-800">
                    How would you rate this product?
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{product.title}</p>
                </div>

                <div className="flex justify-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`text-2xl ${
                        star <= (hoverRating || rating)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`Rate ${star} stars`}
                    >
                      {star <= (hoverRating || rating) ? (
                        <FaStar />
                      ) : (
                        <FaRegStar />
                      )}
                    </motion.button>
                  ))}
                </div>

                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <motion.button
                      key={level}
                      whileHover={{ backgroundColor: "#fef3c7" }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                        hoverRating === level
                          ? "bg-yellow-50"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleRatingClick(level)}
                      onMouseEnter={() => setHoverRating(level)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <div className="flex items-center">
                        <span className="w-6 text-center font-medium text-gray-500">
                          {level}
                        </span>
                        <span className="ml-2">
                          {level === 1 && "Poor"}
                          {level === 2 && "Fair"}
                          {level === 3 && "Good"}
                          {level === 4 && "Very Good"}
                          {level === 5 && "Excellent"}
                        </span>
                      </div>

                      <div className="flex">
                        {[...Array(level)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-xs ${
                              hoverRating >= level
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* User Review Indicator */}
      {/* {userHasReviewed && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
            <div className="ml-3">
              <h4 className="font-medium text-gray-800">Your Review</h4>
              <div className="flex text-yellow-400">
                {renderStars(existingRating)}
              </div>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for reviewing this product! Your feedback helps others
            make better decisions.
          </p>
        </div>
      )} */}
    </div>
  );
};

export default StarRatingCreate;
