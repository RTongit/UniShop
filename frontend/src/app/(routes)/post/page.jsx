"use client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Send } from "lucide-react";
import { useAuthStore } from "@/app/store/authStore";
import { useItemStore } from "@/app/store/itemStore";
import PostingLoader from "@/app/components/PostingLoader";

const CATEGORIES = [
  "Books & Notes",
  "Laptops & Computers",
  "Mobile & Tablets",
  "Cycles & Scooters",
  "Lab Equipment",
  "Scientific Calculator",
  "Sports Equipment",
  "Hostel Essentials",
  "Electronics & Gadgets",
  "Clothing & Accessories",
  "Previous Year question papers",
  "Other",
];

const PICKUP_LOCATIONS = [
  "Library",
  "Hostel A",
  "Hostel B",
  "Hostel C",
  "Cafeteria",
  "Main Gate",
  "Sports Ground",
];

export default function SellItemForm() {
  const { authUser } = useAuthStore();
  const { postItem,isPosting } = useItemStore();
  const router = useRouter();

  const [pics, setPics] = useState([null, null, null, null, null]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [pickupLocation, setPickupLocation] = useState("");


  useEffect(() => {
    if(!authUser) router.replace("/login");
  }, [authUser,router]);

  const handlePhotoUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const updated = [...pics];
      // Here massive base64 url is added 
      updated[index] = reader.result;
      setPics(updated);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (index) => {
    const updated = [...pics];
    updated[index] = null;
    setPics(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || title.trim()=="") {
      toast.error("Please enter a title.");
      return;
    }

    if (!category || category.trim()=="") {
      toast.error("Please select a category.");
      return;
    }

    if (!description || description.trim()=="") {
      toast.error("Please enter a description.");
      return;
    }
    if (!price || price.trim()=="") {
      toast.error("Please enter a price");
      return;
    }
    if(!pickupLocation ||  pickupLocation.trim()=="") {
      toast.error("Please enter pickup location");
      return;
    }
    // handling photo post :  
    let photos = [];
    let photoProvided = false;

    for (let i = 0; i < pics.length; i++) {
      if (pics[i]) {
        photoProvided = true;
        photos = [...photos,pics[i]]
      }
    }
    if (!photoProvided) {
      toast.error("Please enter atleast one photo");
      return;
    }
    const success = await postItem({title, category, brand, description, price, pickupLocation, photos })
    if(success) {
      toast.success("Item posted successfully!");
      router.replace("/my-listings");
    }

  };

  if (!authUser) return null;
  if(isPosting) return <PostingLoader/>
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-9xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-900"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sell Your Item</h1>
            <p className="text-sm text-gray-500">
              Fill in the details below to list your item for other students.
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Photos */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Photos <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  Upload up to 5 photos. The first photo will be the cover
                  photo.
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {pics.map((pic, i) => (
                    <div key={i} className="relative">
                      {pic ? (
                        <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                          <img
                            src={pic}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          {i === 0 && (
                            <span className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
                              Cover Photo
                            </span>
                          )}
                          <button
                            onClick={() => removePhoto(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ) : (
                        <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                          <Plus size={18} className="text-blue-500 mb-1" />
                          <span className="text-xs text-gray-400">Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handlePhotoUpload(i, e)}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Brand{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Enter brand (e.g., Dell, HP, Logitech)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-gray-900 placeholder-gray-300"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500">
                  <span className="px-3 text-gray-500 text-sm font-medium border-r border-gray-200 py-2.5 bg-gray-50">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value.toString())}
                    placeholder="Enter price"
                    min="0"
                    className="flex-1 px-4 py-2.5 text-sm outline-none text-gray-900 placeholder-gray-300"
                    required
                  />
                </div>
              </div>

              {/* Pickup Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Pickup Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-gray-900 appearance-none bg-white cursor-pointer"
                  >
                    <option value="" disabled>
                      Select pickup location
                    </option>
                    {PICKUP_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                    ▼
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-semibold text-gray-900">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-gray-400">
                    {title.length} / 300
                  </span>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 300))}
                  placeholder="Enter a title for your item"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-gray-900 placeholder-gray-300"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-gray-900 appearance-none bg-white cursor-pointer"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                    ▼
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value.slice(0, 4096))
                  }
                  placeholder="Describe your item in detail (condition, features, reason for selling, etc.)"
                  className="h-56 resize-none w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 text-gray-900 placeholder-gray-300"
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-400">
                    {description.length} / 4096
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => router.back()}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={(e)=>{handleSubmit(e)}}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
            >
              <Send size={15} />
              Post Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
