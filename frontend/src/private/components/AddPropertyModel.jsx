import React from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import {upload} from '../../services/api'
import { ToastContainer, Bounce, toast } from "react-toastify";



const AddPropertyModal = ({
  isOpen,
  onClose,
  onAddProperty
}) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
  defaultValues: {
    name: "",
    location: "",
    price: "",
    priceDuration: "one time",
    beds: "",
    baths: "",
    areaSqm: "",
    hasKitchen: false,
    hasBalcony: false,
    hasParking: false,
    description: "",
    images: [],
  },
});

  const images = watch("images", []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setValue("images", urls);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("location", data.location);
    formData.append("price", data.price);
    formData.append("priceDuration", data.priceDuration);
    formData.append("beds", data.beds);
    formData.append("baths", data.baths);
    formData.append("areaSqm", data.areaSqm);
    formData.append("hasKitchen", data.hasKitchen);
    formData.append("hasBalcony", data.hasBalcony);
    formData.append("hasParking", data.hasParking);
    formData.append("description", data.description);

    // Append all selected images as files
    const fileInput = document.getElementById("fileInput");
    if (fileInput && fileInput.files.length > 0) {
      Array.from(fileInput.files).forEach((file) => {
        formData.append("images", file); 
      });
    }

    try {
      const response = await upload(formData); 
      onClose();
      reset();
      toast.success('Property sucessfully added', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });
    } catch (error) {
      console.error("Upload failed", error);
      toast.error('Cannot add property', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });
    }
  };

  if (!isOpen) return null;

  return (
    <>
    
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Property</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
            <input
            type="text"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("name", { required: true })}
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
            type="text"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("location", { required: true })}
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
                type="number"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="$"
                {...register("price", { required: true })}
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Duration</label>
            <select
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("priceDuration", { required: true })}
            >
                <option value = 'one time'>One Time </option>
                <option value="per month">Per Month</option>
                <option value="per night">Per Night</option>
                <option value="per week">Per Week</option>
            </select>
            </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Beds</label>
            <input
                type="number"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("beds", { required: true })}
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Baths</label>
            <input
                type="number"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("baths", { required: true })}
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area (sqm)</label>
            <input
                type="number"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 28"
                {...register("areaSqm", { required: true })}
            />
            </div>
        </div>
        <div className="flex gap-4">
            <label className="flex items-center">
            <input type="checkbox" {...register("hasKitchen")} />
            <span className="ml-2">Kitchen</span>
            </label>
            <label className="flex items-center">
            <input type="checkbox" {...register("hasBalcony")} />
            <span className="ml-2">Balcony</span>
            </label>
            <label className="flex items-center">
            <input type="checkbox" {...register("hasParking")} />
            <span className="ml-2">Parking</span>
            </label>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            {...register("description", { required: true })}
            />
        </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
            <button
              type="button"
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200"
              onClick={() => document.getElementById("fileInput").click()}
            >
              Add File
            </button>
            <input
              id="fileInput"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {images && images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Property ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = [...images];
                      newImages.splice(index, 1);
                      setValue("images", newImages);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Upload Property
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default AddPropertyModal;