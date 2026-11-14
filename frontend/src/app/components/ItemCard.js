import Link from "next/link";

export default function ItemCard({ item }) {
  return (
    <Link href={`/item/${item._id}`} className="flex min-h-[200px] md:min-h-[300px]">

        {/* Picture */}
        <div className="w-[140px] shrink-0 overflow-hidden bg-stone-100 p-2 md:w-[280px]">
          <img src={item.photos[0]} alt={item.title} className="block h-full w-full object-cover" />
        </div>

        <div className="min-w-0 flex-1 p-3 flex flex-col gap-y-3">
          {/* Title */}
          <p className="break-words text-sm font-bold text-gray-900 leading-snug mb-1">
            {item.title}
          </p>

          {/* Content */}
          <p className="hover:underline max-h-[100px] overflow-hidden">{item.description}</p>

          {/* Price */}
          <p className="font-bold text-gray-900">
            ₹{item.price.toLocaleString("en-IN")}
          </p>
        </div>

    </Link>
  );
}
