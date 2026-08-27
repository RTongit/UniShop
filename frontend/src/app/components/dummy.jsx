<div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
  {/* Image */}
  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
    <img
      src="https://picsum.photos/600/450"
      alt="Product"
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
    />

    <span className="absolute top-3 left-3 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 shadow">
      In Stock
    </span>
  </div>

  {/* Body */}
  <div className="space-y-4 p-5">
    {/* Category */}
    <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
      Electronics
    </span>

    {/* Title */}
    <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
      Sony WH-1000XM4 Noise Cancelling Headphones
    </h3>

    {/* Price */}
    <p className="text-2xl font-bold text-blue-600">
      ₹12,999
    </p>

    {/* Pickup */}
    <div className="flex items-center gap-2 text-sm text-gray-500">
      📍 Main Gate
    </div>

    {/* Divider */}
    <div className="border-t border-gray-200"></div>

    {/* Buttons */}
    <div className="grid grid-cols-3 gap-2">
      <button className="rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
        Edit
      </button>

      <button className="rounded-lg border border-red-300 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50">
        Delete
      </button>

      <button className="rounded-lg bg-green-600 py-2 text-sm font-medium text-white transition hover:bg-green-700">
        Mark Sold
      </button>
    </div>
  </div>
</div>