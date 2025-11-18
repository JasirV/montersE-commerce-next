import React, { useState } from 'react';

const ProductSpecification = ({ product }) => {
  const [activeTab, setActiveTab] = useState("specifications");

  const sampleProduct = {
    brand: "Rolex",
    model: "Submariner",
    referenceNumber: "124060",
    serialNumber: "8R2X1234",
    watchType: "Diver",
    watchStyle: "Sports",
    condition: "Excellent",
    itemCondition: "Pre-owned, like new",
    productionYear: "2022",
    gender: "Men's",
    movement: "Automatic",
    dialColor: "Black",
    caseMaterial: "Stainless Steel",
    strapMaterial: "Stainless Steel",
    strapColor: "Silver",
    strapSize: "20mm",
    caseSize: "41mm",
    dialNumerals: "Luminescent Index",
    description:
      "The Rolex Submariner is a classic diving watch known for its durability and timeless design. This model features a black dial, stainless steel construction, and is water resistant up to 300 meters.",
  };

  const productData = product || sampleProduct;

  const specifications = [
    { label: "Brand", value: productData.brand },
    { label: "Model", value: productData.model },
    { label: "Reference Number", value: productData.referenceNumber },
    { label: "Serial Number", value: productData.serialNumber },
    { label: "Watch Type", value: productData.watchType },
    { label: "Watch Style", value: productData.watchStyle },
    { label: "Condition", value: productData.condition },
    { label: "Item Condition", value: productData.itemCondition },
    { label: "Production Year", value: productData.productionYear },
    { label: "Gender", value: productData.gender },
    { label: "Movement", value: productData.movement },
    { label: "Dial Color", value: productData.dialColor },
    { label: "Case Material", value: productData.caseMaterial },
    { label: "Strap Material", value: productData.strapMaterial },
    { label: "Strap Color", value: productData.strapColor },
    { label: "Strap Size", value: productData.strapSize },
    { label: "Case Size", value: productData.caseSize },
    { label: "Dial Numerals", value: productData.dialNumerals },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 pb-10">
      
      {/* Sticky Tabs for Mobile */}
      <div className="sticky top-0 bg-white z-20 border-b mb-4">
        <div className="flex">
          <button
            onClick={() => setActiveTab("specifications")}
            className={`flex-1 text-center py-3 text-sm font-medium transition ${
              activeTab === "specifications"
                ? "border-b-2 border-black text-black"
                : "text-gray-500"
            }`}
          >
            Specifications
          </button>

          <button
            onClick={() => setActiveTab("description")}
            className={`flex-1 text-center py-3 text-sm font-medium transition ${
              activeTab === "description"
                ? "border-b-2 border-black text-black"
                : "text-gray-500"
            }`}
          >
            Description
          </button>
        </div>
      </div>

      {/* SPECIFICATIONS TAB */}
      {activeTab === "specifications" && (
        <div className="space-y-6">
          {/* Key Specs Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-3">Key Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Brand: </span>{productData.brand}</p>
                <p><span className="text-gray-600">Model: </span>{productData.model}</p>
                <p><span className="text-gray-600">Ref No: </span>{productData.referenceNumber}</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-3">Condition</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Condition: </span>{productData.condition}</p>
                <p><span className="text-gray-600">Year: </span>{productData.productionYear}</p>
                <p><span className="text-gray-600">Gender: </span>{productData.gender}</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-3">Technical Specs</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Movement: </span>{productData.movement}</p>
                <p><span className="text-gray-600">Case Size: </span>{productData.caseSize}</p>
                <p><span className="text-gray-600">Strap Size: </span>{productData.strapSize}</p>
              </div>
            </div>
          </div>

          {/* Full Table */}
          <div className="bg-white rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold px-4 py-3 border-b">Complete Specifications</h3>

            <div className="divide-y">
              {specifications.map((spec, i) => (
                <div key={i} className="px-4 py-3 flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{spec.label}</span>
                  <span className="text-gray-600">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DESCRIPTION TAB */}
      {activeTab === "description" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">About this product</h2>

          <p className="text-gray-700 leading-relaxed text-sm">{productData.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Features */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-800">Features</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• {productData.caseMaterial} case</li>
                <li>• {productData.movement} movement</li>
                <li>• {productData.dialColor} dial</li>
                <li>• Water resistant diver watch</li>
              </ul>
            </div>

            {/* Condition */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-green-800">Condition Details</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• {productData.itemCondition}</li>
                <li>• Fully serviced</li>
                <li>• Original parts</li>
                <li>• Includes original box</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-lg font-bold">{productData.caseSize}</p>
          <p className="text-xs text-gray-500">Case Size</p>
        </div>
        <div>
          <p className="text-lg font-bold">{productData.movement}</p>
          <p className="text-xs text-gray-500">Movement</p>
        </div>
        <div>
          <p className="text-lg font-bold">{productData.condition}</p>
          <p className="text-xs text-gray-500">Condition</p>
        </div>
        <div>
          <p className="text-lg font-bold">{productData.productionYear}</p>
          <p className="text-xs text-gray-500">Year</p>
        </div>
      </div>
    </div>
  );
};

export default ProductSpecification;
