import React, { useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import SimilarProduct from "./SimillarProduct";

const ReviewsRatings = () => {
  const [selectedRating, setSelectedRating] = useState("all");

  // Sample reviews data
  const reviewsData = {
    summary: {
      averageRating: 4.6,
      totalReviews: 128,
      ratingBreakdown: {
        5: 65,
        4: 42,
        3: 15,
        2: 4,
        1: 2,
      },
    },
    reviews: [
      {
        id: 1,
        customerName: "Rahul Sharma",
        rating: 5,
        date: "2024-01-15",
        verified: true,
        title: "Excellent product quality!",
        comment:
          "The watch looks even better in person. The build quality is premium and it keeps perfect time. Highly recommended!",
       
        likes: 24,
        dislikes: 2,
        featured: true,
      },
      {
        id: 2,
        customerName: "Priya Patel",
        rating: 4,
        date: "2024-01-12",
        verified: true,
        title: "Good value for money",
        comment:
          "Beautiful watch but the strap is a bit stiff. Overall good purchase for the price.",
        images: [],
        likes: 12,
        dislikes: 1,
      },
      {
        id: 3,
        customerName: "Amit Kumar",
        rating: 5,
        date: "2024-01-10",
        title: "Perfect gift",
        comment:
          "Bought this as a gift for my father. He loved it! The packaging was excellent and delivery was fast.",
    
        likes: 8,
        dislikes: 0,
      },
      {
        id: 4,
        customerName: "Neha Gupta",
        rating: 3,
        date: "2024-01-08",
        verified: true,
        title: "Average product",
        comment:
          "The watch looks nice but the battery life could be better. It's okay for the price.",
        images: [],
        likes: 5,
        dislikes: 3,
      },
      {
        id: 5,
        customerName: "Sanjay Mehta",
        rating: 5,
        date: "2024-01-05",
        verified: true,
        title: "Outstanding quality!",
        comment:
          "This watch exceeded my expectations. The craftsmanship is excellent and it gets compliments everywhere I go.",
        
        likes: 31,
        dislikes: 1,
      },
    ],
  };

  // Star rating component
  const StarRating = ({ rating, size = "text-base" }) => {
    return (
      <div className={`flex items-center ${size}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {rating >= star ? (
              <FaStar className="text-yellow-400 inline" />
            ) : rating >= star - 0.5 ? (
              <FaStarHalfAlt className="text-yellow-400 inline" />
            ) : (
              <FaRegStar className="text-yellow-400 inline" />
            )}
          </span>
        ))}
      </div>
    );
  };

  // Rating progress bar
  const RatingProgressBar = ({ rating, count, total }) => {
    const percentage = (count / total) * 100;
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="w-8 text-gray-600">{rating} ★</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="w-12 text-gray-600 text-right">{count}</span>
      </div>
    );
  };

  // Handle helpful review
  const handleHelpful = (reviewId) => {
    setHelpfulReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  // Filter reviews by rating
  const filteredReviews =
    selectedRating === "all"
      ? reviewsData.reviews
      : reviewsData.reviews.filter(
          (review) => review.rating === parseInt(selectedRating)
        );

  const totalReviews = reviewsData.summary.totalReviews;

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 mt-6 p-4 xs:p-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl xs:text-2xl font-bold text-gray-900">
          Customer Reviews
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-8">
        {/* Left Column - Rating Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4 xs:p-6 border border-gray-200">
            {/* Average Rating */}
            <div className="text-center mb-6">
              <div className="text-4xl xs:text-5xl font-bold text-gray-900 mb-2">
                {reviewsData.summary.averageRating}
                <span className="text-2xl xs:text-3xl text-gray-600">/5</span>
              </div>
              <StarRating
                rating={reviewsData.summary.averageRating}
                size="text-xl"
              />
              <p className="text-gray-600 text-sm mt-2">
                {totalReviews} Reviews
              </p>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2 mb-6">
              {[5, 4, 3, 2, 1].map((rating) => (
                <RatingProgressBar
                  key={rating}
                  rating={rating}
                  count={reviewsData.summary.ratingBreakdown[rating]}
                  total={totalReviews}
                />
              ))}
            </div>

            {/* Rating Filter Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => setSelectedRating("all")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedRating === "all"
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Reviews ({totalReviews})
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating.toString())}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedRating === rating.toString()
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {rating} ★ ({reviewsData.summary.ratingBreakdown[rating]})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Reviews List */}
        <div className="lg:col-span-2">
          {/* Reviews List */}
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-200 pb-6 last:border-b-0"
              >
                {/* Review Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {review.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm xs:text-base">
                        {review.customerName}
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs xs:text-sm">
                    {new Date(review.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Review Title & Comment */}
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm xs:text-base mb-2">
                    {review.title}
                  </h3>
                  <p className="text-gray-700 text-sm xs:text-base leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                {/* Featured Badge */}
                {review.featured && (
                  <div className="mt-3 inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"></div>
                )}
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {filteredReviews.length > 0 && (
            <div className="text-center mt-8">
              <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors text-sm xs:text-base">
                Load More Reviews
              </button>
            </div>
          )}

          {/* No Reviews Message */}
          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">★</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No reviews found
              </h3>
              <p className="text-gray-500 text-sm">
                There are no reviews for the selected rating filter.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Summary Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">
            {reviewsData.summary.averageRating}
          </div>
          <div className="text-gray-600 text-sm">Average Rating</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{totalReviews}</div>
          <div className="text-gray-600 text-sm">Total Reviews</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(
              (reviewsData.summary.ratingBreakdown[5] / totalReviews) * 100
            )}
            %
          </div>
          <div className="text-gray-600 text-sm">5 Star Reviews</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">94%</div>
          <div className="text-gray-600 text-sm">Recommend</div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsRatings;
