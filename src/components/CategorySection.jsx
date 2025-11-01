// components/CategorySectionWithImages.jsx
import Image from 'next/image';
import WatchImg from '@/assets/caregory/watch.png'
import clockImg from '@/assets/caregory/clock.png'
import leatherImg from '@/assets/caregory/leather.png'
const CategorySectionWithImages = () => {
  const categories = [
    {
      id: 1,
      name: "BRANDS",
      image: "/images/shop-brands.jpg"
    },
    {
      id: 2,
      name: "EXCLUSIVE",
      image: "/images/exclusive-collection.jpg"
    },
    {
      id: 3,
      name: "WATCHES",
      image:WatchImg
    },
    {
      id: 4,
      name: "CLOCKS", 
      image: clockImg
    },
    {
      id: 5,
      name: "LEATHERS",
      image: leatherImg
    },
    {
      id: 6,
      name: "ACCESSORIES",
      image: "/images/accessories.jpg"
    },
    {
      id: 7,
      name: "JEWELRY",
      image: "/images/jewelry.jpg"
    },
    {
      id: 8,
      name: "NEW",
      image: "/images/brand-new.jpg"
    }
  ];

  return (
    <section className="block md:hidden px-3 py-6 bg-white border-b border-gray-200">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-lg font-bold text-gray-900">Shop Categories</h2>
        <button className="text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors">
          See All
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-4 gap-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-center group cursor-pointer"
          >
            {/* Image Container */}
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm border border-gray-200 group-hover:shadow-md group-hover:border-blue-200 transition-all duration-200 mb-2 overflow-hidden">
              <div className="relative w-14 h-14 rounded-md overflow-hidden">
                <Image
                  src={category?.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </div>
            
            {/* Category Name */}
            <span className="text-xs text-gray-800 text-center font-medium leading-tight group-hover:text-blue-600 transition-colors">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySectionWithImages;