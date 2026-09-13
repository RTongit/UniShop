import Link from "next/link";

export default function ItemCard({ item }) {
  return (
    <Link href={`/item/${item._id}`} className="flex md:h-[300px] h-[200px]" >

        {/* Picture */}
        <div className="md:min-w-[280px] min-w-[140px] h-full bg-stone-100 p-2">
          <img src={item.photos[0]} className="w-full h-full object-contain"></img>
        </div>

        <div className="p-3 overflow-hidden flex flex-col gap-y-3">
          {/* Title */}
          <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-1">
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
