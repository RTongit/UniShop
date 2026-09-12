import Link from "next/link";

export default function ItemCard({ item }) {
  return (
    <Link href={`/item/${item._id}`} className="h-[300px]">
      <div className="flex h-full">

        {/* Picture */}
        <div className="min-w-[280px]">
          <img src={item.photos[0]} className="w-full h-full object-contain"></img>
        </div>

        <div className="p-3 overflow-hidden flex flex-col gap-y-3">
          {/* Title */}
          <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-1">
            {item.title}
          </p>

          {/* Content */}
          <p className="hover:underline h-[100px] overflow-hidden">{item.description}</p>

          {/* Price */}
          <p className="font-bold text-gray-900">
            ₹{item.price.toLocaleString("en-IN")}
          </p>
        </div>

      </div>
    </Link>
  );
}
