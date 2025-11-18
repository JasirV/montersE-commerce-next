// components/CategorySectionWithImages.jsx
import Image from 'next/image';
import WatchImg from '@/assets/category/watch1.png'
import clockImg from '@/assets/category/clock.png'
import leatherImg from '@/assets/category/bag.png'
import BrandImg from '@/assets/category/brand.png'
import ExclusiveImg from '@/assets/category/ex.png'
import AssImg from '@/assets/category/as.png'
import JewelryImg from '@/assets/category/j.png'
import NewImg from '@/assets/category/new.png'
import Link from 'next/link';

const CategorySectionWithImages = () => {
  const categories = [
    {
      id: 1,
      name: "BRANDS",
      image: BrandImg,
      path: "/shop-by-brands"

    },
    {
      id: 2,
      name: "EXCLUSIVE",
      image: ExclusiveImg,
      path: "/exclusive-collection"
    },
    {
      id: 3,
      name: "WATCHES",
      image:WatchImg,
      path: "/watches",
    },
    {
      id: 4,
      name: "CLOCKS", 
      image: clockImg,
      path: "/clocks"
    },
    {
      id: 5,
      name: "LEATHERS",
      image: leatherImg,
      path: "/leathers",
    },
    {
      id: 6,
      name: "ACCESSORIES",
      image: AssImg,
      path: "/accessories",
    },
    {
      id: 7, 
      name: "JEWELRY",
      image: JewelryImg,
      path: "/jewelry",
    },
    {
      id: 8,
      name: "NEW",
      image: NewImg,
      path: "/brand-new"
    }
  ];

  return (
    <section className="block md:hidden px-3 py-6 ">
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
          <Link
            key={category.id}
            href={category.path}
            className="flex flex-col items-center group cursor-pointer"
          >
            {/* Image Container */}
            <div className="w-16 h-16  rounded-lg flex items-center justify-center shadowbottam border-none  group-hover:shadow-md group-hover:border-blue-200 transition-all duration-200 mb-2 overflow-hidden ">
              <div className="relative w-14 h-14 rounded-md overflow-hidden">
                <Image
                  src={category?.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200  drop-shadow-[0_6px_8px_rgba(0,0,0,0.25)]"
                />
              </div>
            </div>
            
            {/* Category Name */}
            <span className="text-xs text-gray-800 text-center font-medium leading-tight group-hover:text-blue-600 transition-colors">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySectionWithImages;