import React from 'react'

const MoreFromSeller = () => {
  return (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">
              More from this seller
            </h2>
            <button className="text-sm text-indigo-600 hover:underline font-medium">
              View all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {item.moreFromSeller.map((relItem) => (
              <div
                key={relItem._id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="relative">
                  <img
                    src={relItem.photo}
                    alt={relItem.title}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <button className="absolute top-2 right-2 bg-white/90 rounded-full w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-400 text-xs shadow">
                    ♥
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-1 mb-1">
                    {relItem.title}
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatPrice(relItem.price)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {relItem.postedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
  )
}

export default MoreFromSeller
