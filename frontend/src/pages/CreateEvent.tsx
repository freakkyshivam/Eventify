// pages/CreateEvent.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  MapPin,
  Upload,
  X,
  Loader2,
  Info,
  ArrowLeft,
} from "lucide-react";
 
import api from "@/services/axiosInstance";
import { type EventFormData } from "@/types/Event";
 



const CreateEvent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});
  const [bannerFiles, setBannerFiles] = useState<File[]>([]);
  const [bannerPreviews, setBannerPreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    registration_deadline: "",
    location: "",
    event_mode: "",
    capacity: 100,
    event_category: "",
    payment_type: "",
    price: 0,
    bannerUrls: [],
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof EventFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name: keyof EventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (name === "payment_type" && value === "free") {
      setFormData((prev) => ({ ...prev, price: 0 }));
    }
  };

  // Handle banner file upload
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + bannerFiles.length > 3) {
      setErrors((prev) => ({ ...prev, bannerUrls: "Maximum 3 images allowed" }));
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, bannerUrls: "Only image files allowed" }));
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, bannerUrls: "Image size must be less than 5MB" }));
        return false;
      }
      return true;
    });

    setBannerFiles((prev) => [...prev, ...validFiles]);

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setErrors((prev) => ({ ...prev, bannerUrls: undefined }));
  };

  // Remove banner image
  const removeBanner = (index: number) => {
    setBannerFiles((prev) => prev.filter((_, i) => i !== index));
    setBannerPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.start_time) newErrors.start_time = "Start time is required";
    if (!formData.end_time) newErrors.end_time = "End time is required";
    if (!formData.registration_deadline) newErrors.registration_deadline = "Registration deadline is required";
    if (!formData.event_mode) newErrors.event_mode = "Event mode is required";
    if (!formData.event_category) newErrors.event_category = "Category is required";
    if (!formData.payment_type) newErrors.payment_type = "Payment type is required";
    
    if (formData.event_mode === "offline" && !formData.location?.trim()) {
      newErrors.location = "Location is required for offline events";
    }

    if (formData.capacity < 1) {
      newErrors.capacity = "Capacity must be at least 1";
    }

    if (formData.payment_type === "paid" && formData.price <= 0) {
      newErrors.price = "Price must be greater than 0 for paid events";
    }

    const now = new Date();
    const startTime = new Date(formData.start_time);
    const endTime = new Date(formData.end_time);
    const deadline = new Date(formData.registration_deadline);

    if (startTime <= now) {
      newErrors.start_time = "Start time must be in the future";
    }

    if (endTime <= startTime) {
      newErrors.end_time = "End time must be after start time";
    }

    if (deadline >= startTime) {
      newErrors.registration_deadline = "Registration deadline must be before start time";
    }

    if (bannerFiles.length === 0) {
      newErrors.bannerUrls = "At least one banner image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const uploadedUrls: string[] = [];
      // for (const file of bannerFiles) {
      //   const formDataUpload = new FormData();
      //   formDataUpload.append("banner", file);

      //   const uploadResponse = await api.post(
      //     `/api/upload/banner`,
      //     formDataUpload,
      //     {
      //       headers: { "Content-Type": "multipart/form-data" },
      //       withCredentials: true,
      //     }
      //   );

      //   uploadedUrls.push(uploadResponse.data.url);
      // }

      const eventData = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
    end_time: new Date(formData.end_time).toISOString(),
    registration_deadline: new Date(formData.registration_deadline).toISOString(),
        bannerUrls: uploadedUrls,
        capacity : Number(formData.capacity),
        price: formData.payment_type === "free" ? Number(0) : Number(formData.price),
      };

      await api.post(`/api/events`, eventData, {
        withCredentials: true,
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error creating event:", error);
      setErrors({
        title: error?.response?.data?.msg || "Failed to create event. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-gray-400 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">Create New Event</h1>
          <p className="text-gray-400">Fill in the details to create your event</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <Card className="mb-6 bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-gray-200 mb-2">
                  Event Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Tech Conference 2025"
                  className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 ${
                    errors.title ? "border-red-500" : ""
                  }`}
                />
                {errors.title && (
                  <p className="text-sm text-red-400 mt-1">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-gray-200 mb-2">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your event in detail..."
                  rows={6}
                  className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 ${
                    errors.description ? "border-red-500" : ""
                  }`}
                />
                {errors.description && (
                  <p className="text-sm text-red-400 mt-1">{errors.description}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="event_category" className="text-gray-200 mb-2">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.event_category}
                  onValueChange={(value) => handleSelectChange("event_category", value)}
                >
                  <SelectTrigger
                    className={`bg-gray-800 border-gray-700 text-white focus:border-purple-500 ${
                      errors.event_category ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="competition">Competition</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="coding">Coding</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.event_category && (
                  <p className="text-sm text-red-400 mt-1">{errors.event_category}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card className="mb-6 bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Event Mode */}
              <div>
                <Label htmlFor="event_mode" className="text-gray-200 mb-2">
                  Event Mode <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.event_mode}
                  onValueChange={(value) => handleSelectChange("event_mode", value)}
                >
                  <SelectTrigger
                    className={`bg-gray-800 border-gray-700 text-white focus:border-purple-500 ${
                      errors.event_mode ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select event mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
                {errors.event_mode && (
                  <p className="text-sm text-red-400 mt-1">{errors.event_mode}</p>
                )}
              </div>

              {/* Location */}
              {formData.event_mode === "offline" && (
                <div>
                  <Label htmlFor="location" className="text-gray-200 mb-2">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter venue address"
                      className={`pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 ${
                        errors.location ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-sm text-red-400 mt-1">{errors.location}</p>
                  )}
                </div>
              )}

              {/* Date and Time Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Time */}
                <div>
                  <Label htmlFor="start_time" className="text-gray-200 mb-2">
                    Start Date & Time <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                    <Input
                      id="start_time"
                      name="start_time"
                      type="datetime-local"
                      value={formData.start_time}
                      onChange={handleChange}
                      className={`pl-10 bg-gray-800 border-gray-700 text-white focus:border-purple-500 ${
                        errors.start_time ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.start_time && (
                    <p className="text-sm text-red-400 mt-1">{errors.start_time}</p>
                  )}
                </div>

                {/* End Time */}
                <div>
                  <Label htmlFor="end_time" className="text-gray-200 mb-2">
                    End Date & Time <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                    <Input
                      id="end_time"
                      name="end_time"
                      type="datetime-local"
                      value={formData.end_time}
                      onChange={handleChange}
                      className={`pl-10 bg-gray-800 border-gray-700 text-white focus:border-purple-500 ${
                        errors.end_time ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.end_time && (
                    <p className="text-sm text-red-400 mt-1">{errors.end_time}</p>
                  )}
                </div>
              </div>

              {/* Registration Deadline */}
              <div>
                <Label htmlFor="registration_deadline" className="text-gray-200 mb-2">
                  Registration Deadline <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                  <Input
                    id="registration_deadline"
                    name="registration_deadline"
                    type="datetime-local"
                    value={formData.registration_deadline}
                    onChange={handleChange}
                    className={`pl-10 bg-gray-800 border-gray-700 text-white focus:border-purple-500 ${
                      errors.registration_deadline ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {errors.registration_deadline && (
                  <p className="text-sm text-red-400 mt-1">
                    {errors.registration_deadline}
                  </p>
                )}
              </div>

              {/* Capacity */}
              <div>
                <Label htmlFor="capacity" className="text-gray-200 mb-2">
                  Capacity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  className={`bg-gray-800 border-gray-700 text-white focus:border-purple-500 ${
                    errors.capacity ? "border-red-500" : ""
                  }`}
                />
                {errors.capacity && (
                  <p className="text-sm text-red-400 mt-1">{errors.capacity}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="mb-6 bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Type */}
              <div>
                <Label htmlFor="payment_type" className="text-gray-200 mb-2">
                  Payment Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.payment_type}
                  onValueChange={(value) => handleSelectChange("payment_type", value)}
                >
                  <SelectTrigger
                    className={`bg-gray-800 border-gray-700 text-white focus:border-purple-500 ${
                      errors.payment_type ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                {errors.payment_type && (
                  <p className="text-sm text-red-400 mt-1">{errors.payment_type}</p>
                )}
              </div>

              {/* Price */}
              {formData.payment_type === "paid" && (
                <div>
                  <Label htmlFor="price" className="text-gray-200 mb-2">
                    Price (₹) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter ticket price"
                    className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 ${
                      errors.price ? "border-red-500" : ""
                    }`}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-400 mt-1">{errors.price}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Banner Images */}
          <Card className="mb-6 bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Event Banners</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2 p-4 bg-purple-950/30 border border-purple-800/50 rounded-lg">
                <Info className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                <div className="text-sm text-purple-200">
                  <p className="font-medium mb-1">Banner Guidelines:</p>
                  <ul className="list-disc list-inside space-y-1 text-purple-300">
                    <li>Upload 1-3 images</li>
                    <li>Recommended size: 1200x630px</li>
                    <li>Maximum file size: 5MB per image</li>
                    <li>Supported formats: JPG, PNG, WEBP</li>
                  </ul>
                </div>
              </div>

              {/* Banner Preview */}
              {bannerPreviews.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {bannerPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => removeBanner(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              {bannerFiles.length < 3 && (
                <div>
                  <Label
                    htmlFor="banner-upload"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-purple-500 transition-colors bg-gray-800/50"
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-300">
                        Click to upload banner images
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {3 - bannerFiles.length} more image(s) can be added
                      </p>
                    </div>
                  </Label>
                  <Input
                    id="banner-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                </div>
              )}

              {errors.bannerUrls && (
                <p className="text-sm text-red-400">{errors.bannerUrls}</p>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              disabled={isLoading}
              className="border-gray-700 text-gray-700 hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Event...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;