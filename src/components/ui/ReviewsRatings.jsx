import React, { useMemo, lazy, Suspense } from "react";
import { FaStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa";

// Lazy load the SimillarProduct component
const SimillarProduct = lazy(() => import("./SimillarProduct"));
import Link from "next/link";
import Image from "next/image";

// Memoized reviews data to prevent unnecessary re-renders
const reviews = [
  {
    id: 1,
    name: "Ombir Singh",
    date: "November 16, 2022",
    avatar: "https://i.pravatar.cc/50?img=1",
    rating: 5,
    verified: true,
    title: "Ibell Tig Welding Machine Is Good For The Price",
    content:
      "I Have Been Using This Machine For Almost A Year Now And It Has Been Working Great. It Is A Very Versatile Machine That Can Be Used For Both Flux Core And Solid Wire Welding. The Machine Is Very Easy To Use And Has A Very User Friendly Interface. The Machine Comes With A 1 Year Warranty Which Is A Great Plus.",
  },
  {
    id: 2,
    name: "Mamta",
    date: "November 16, 2022",
    avatar: "https://i.pravatar.cc/50?img=5",
    rating: 5,
    verified: true,
    title: "Ibell Tig Welding Machine Is Good For The Price",
    content:
      "I Have Been Using This Machine For Almost A Year Now And It Has Been Working Great. It Is A Very Versatile Machine That Can Be Used For Both Flux Core And Solid Wire Welding. The Machine Is Very Easy To Use And Has A Very User Friendly Interface. The Machine Comes With A 1 Year Warranty Which Is A Great Plus.",
  },
];

// Rating bar component to prevent re-renders
const RatingBar = React.memo(({ star, width, color }) => (
  <div className="flex items-center gap-2">
    <span className="w-4">{star}</span>
    <div className="flex-1 bg-gray-200 rounded h-2">
      <div className={`h-2 rounded ${color}`} style={{ width }}></div>
    </div>
  </div>
));

RatingBar.displayName = "RatingBar";

// Single review component to prevent re-renders
const ReviewItem = React.memo(({ review }) => {
  // console.log(review,'review lin 57');
  return (
    <div className="border-b pb-6">
      <div className="flex items-center gap-3 mb-2">
        <Image
          src={review.avatar}
          alt={review.name}
          width={40}
          height={40}
          className=" rounded-full"
          loading="lazy"
        />
        <div>
          <h4 className="font-semibold">{review.name}</h4>
          <p className="text-xs text-gray-500">{review.date}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        {[...Array(review.rating)].map((_, i) => (
          <FaStar key={i} className="text-green-500" />
        ))}
        {review.verified && (
          <span className="text-sm text-gray-600 border-l pl-2">
            Verified Purchase
          </span>
        )}
      </div>

      <h3 className="font-semibold mt-2">{review.title}</h3>
      <p className="text-gray-600 text-sm mt-1">{review.content}</p>

      {/* Like / Dislike */}
      <div className="flex gap-4 mt-3">
        <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
          <FaThumbsUp /> <span className="text-sm">0</span>
        </button>
        <button className="flex items-center gap-1 text-gray-500 hover:text-red-600">
          <FaThumbsDown /> <span className="text-sm">1</span>
        </button>
      </div>
    </div>
  );
});

ReviewItem.displayName = "ReviewItem";

const ReviewsRatings = () => {
  // Memoize the rating bars data
  const ratingBars = useMemo(
    () => [
      { star: 5, width: "60%", color: "bg-blue-600" },
      { star: 4, width: "40%", color: "bg-blue-600" },
      { star: 3, width: "0%", color: "bg-gray-300" },
      { star: 2, width: "0%", color: "bg-gray-300" },
      { star: 1, width: "0%", color: "bg-gray-300" },
    ],
    []
  );

  return (
    <div className="bg-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Reviews & Ratings</h2>
            <p className="text-sm text-gray-600 mt-1">
              IBELL M200-105 IGBT Inverter 2 in 1 Flux Core/Solid Wire MAG
              Welding Machine With 1 Year Warranty
            </p>
          </div>
          <Link href="/GeneralReview">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Write a Review
            </button>
          </Link>
        </div>

        {/* Rating Summary */}
        <div className="flex flex-col sm:flex-row gap-6 border-b pb-6">
          <div className="flex flex-col items-center sm:items-start">
            <p className="text-3xl font-bold flex items-center gap-1 text-blue-600">
              4.6 <FaStar className="text-yellow-500" />
            </p>
            <p className="text-sm text-gray-500">Average Rating</p>
            <p className="text-sm text-gray-500">Based On 7 Ratings</p>
            <p className="text-sm text-gray-500">And 7 Reviews</p>
          </div>
          <div className="flex-1">
            {ratingBars.map((bar, index) => (
              <RatingBar
                key={index}
                star={bar.star}
                width={bar.width}
                color={bar.color}
              />
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="mt-6 space-y-8">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
      </div>

      {/* Lazy load SimillarProduct with a loading fallback */}
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto mt-6">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-4">
                  <div className="h-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <SimillarProduct />
      </Suspense>
    </div>
  );
};

export default React.memo(ReviewsRatings);
