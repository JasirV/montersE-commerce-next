import React, { useState } from "react";
import Image from "next/image";

// Import your local images
import accesroes from '../../assets/ShopeBycategory/accessries.jpg';
import menswatch from '../../assets/ShopeBycategory/mens wathc.jpg';
import ladieswatch from '../../assets/ShopeBycategory/ladis wathc.jpg';
import handbag from '../../assets/ShopeBycategory/bags.jpg';
import preonwed from '../../assets/ShopeBycategory/pre onwed.jpg';
import luxurypens from '../../assets/ShopeBycategory/luxury pens.jpg';
import jewllery from '../../assets/ShopeBycategory/jwellery.jpg';
import sales from '../../assets/ShopeBycategory/salesnew.jpg';

const categories = [
  { title: "MEN’S WATCHES", img: menswatch },
  { title: "LADIES WATCHES", img: ladieswatch },
  { title: "HANDBAGS", img: handbag },
  { title: "ACCESSORIES", img: accesroes },
  { title: "JEWELRY", img: jewllery },
  { title: "LUXURY PENS", img: luxurypens },
  { title: "PRE-OWNED", img: preonwed },
  { title: "SALE", img: sales }, // Added SALE as a category
];

export default function ShopByCategory() {
  return (
    <section className="w-full py-10 max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6">Shop by Category</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {categories.map((cat, i) => {
          const [imgSrc, setImgSrc] = useState(cat.img);

          return (
            <article
              key={i}
              className="rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1 cursor-pointer bg-white"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // placeholder for keyboard activation
                }
              }}
            >
              <div className="w-full h-32 sm:h-40 md:h-44 bg-gray-50 flex items-center justify-center">
                <Image
                  src={imgSrc}
                  alt={cat.title}
                  className="object-contain w-full h-full p-4"
                  onError={() => setImgSrc("/placeholder.png")}
                  unoptimized
                />
              </div>

              <div className="p-3 text-center font-semibold text-sm sm:text-base">
                {cat.title}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
