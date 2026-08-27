import Link from "next/link";

export default function ItemCard({ item }) {
  return (
    <Link href={`/item/${item._id}`}>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-150">
        {/* Picture */}
        <div className="w-full aspect-4/3 overflow-hidden bg-gray-100">
          {/* Need to optimise image for next js */}
          <img src="item.png" className="w-full h-full object-cover"></img>
        </div>

        <div className="p-3">
          {/* Title */}
          <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-1">
            {item.title}
          </p>

          {/* Content */}
          <p>{item.description}</p>

          {/* Price */}
          <p className="font-bold text-gray-900">
            ₹{item.price.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </Link>
  );
}
