import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar, Clock, MapPin, Upload, X, Loader2, Info,
  ArrowLeft, FileImage, Sparkles, Tag, Users, AlignLeft,
  LayoutGrid, Zap,
} from "lucide-react";

import api from "@/services/axiosInstance";
import { type EventFormData } from "@/types/Event";
import { EventFormDataValidation } from "@/validation/eventCreationFormValidation";

const Field = ({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
      {label} {required && <span className="text-violet-400 normal-case">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1">
        <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
        {error}
      </p>
    )}
  </div>
);

const inputCls = (error?: string) =>
  `w-full px-4 py-3 bg-[#161f2e] border rounded-lg text-[#f0f4f8] placeholder-[#4b6480] text-sm transition-all duration-150 outline-none focus:ring-2 ${
    error
      ? "border-red-500/50 focus:ring-red-500/20 focus:border-red-500/60"
      : "border-[#1e2d3d] hover:border-[#243447] focus:ring-violet-600/20 focus:border-violet-600/40"
  }`;

const Section = ({
  title,
  icon,
  iconColor,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  children: React.ReactNode;
}) => (
  <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-[#1e2d3d]">
      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${iconColor}`}>
        {icon}
      </div>
      <h2 className="text-sm font-semibold text-[#f0f4f8]">{title}</h2>
    </div>
    <div className="p-6 space-y-5">{children}</div>
  </div>
);

const selectTriggerCls = (error?: string) =>
  `w-full px-4 py-3 h-auto bg-[#161f2e] border rounded-lg text-[#f0f4f8] text-sm transition-all duration-150 outline-none focus:ring-2 ${
    error
      ? "border-red-500/50 focus:ring-red-500/20"
      : "border-[#1e2d3d] hover:border-[#243447] focus:ring-violet-600/20 focus:border-violet-600/40"
  }`;

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
    if (errors[name as keyof EventFormData]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSelectChange = (name: keyof EventFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "payment_type" && value === "free" && { price: 0 }),
    }));
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + bannerFiles.length > 3) {
      setErrors((prev) => ({ ...prev, bannerUrls: "Maximum 3 images allowed" }));
      return;
    }
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) { setErrors((prev) => ({ ...prev, bannerUrls: "Only image files allowed" })); return false; }
      if (file.size > 5 * 1024 * 1024) { setErrors((prev) => ({ ...prev, bannerUrls: "Image size must be less than 5MB" })); return false; }
      return true;
    });
    setBannerFiles((prev) => [...prev, ...validFiles]);
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setBannerPreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    setErrors((prev) => ({ ...prev, bannerUrls: undefined }));
  };

  const removeBanner = (index: number) => {
    setBannerFiles((prev) => prev.filter((_, i) => i !== index));
    setBannerPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EventFormDataValidation(formData, setErrors)) return;
    try {
      setIsLoading(true);
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("description", formData.description);
      fd.append("start_time", new Date(formData.start_time).toISOString());
      fd.append("end_time", new Date(formData.end_time).toISOString());
      fd.append("registration_deadline", new Date(formData.registration_deadline).toISOString());
      fd.append("capacity", String(formData.capacity));
      fd.append("price", formData.payment_type === "free" ? "0" : String(formData.price));
      fd.append("payment_type", formData.payment_type);
      fd.append("event_mode", formData.event_mode);
      fd.append("event_category", formData.event_category);
      if (formData.event_mode === "offline") fd.append("location", formData.location);
      bannerFiles.forEach((file) => fd.append("banners", file));
      await api.post("/events", fd, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c12] py-10">

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-violet-600/[0.06] blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-[#4b6480] hover:text-[#f0f4f8] text-sm font-medium transition-colors duration-150 mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-600/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-violet-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-[#f0f4f8] tracking-tight">Create New Event</h1>
          </div>
          <p className="text-[#4b6480] text-sm ml-[52px]">Fill in the details below to publish your event</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Basic Information ── */}
          <Section
            title="Basic Information"
            icon={<AlignLeft className="w-3.5 h-3.5 text-violet-400" />}
            iconColor="bg-violet-600/10 border-violet-600/20"
          >
            <Field label="Event Title" required error={errors.title}>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Tech Conference 2025"
                className={inputCls(errors.title)}
              />
            </Field>

            <Field label="Description" required error={errors.description}>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your event in detail..."
                rows={5}
                className={inputCls(errors.description) + " resize-none"}
              />
            </Field>

            <Field label="Category" required error={errors.event_category}>
              <Select value={formData.event_category} onValueChange={(v) => handleSelectChange("event_category", v)}>
                <SelectTrigger className={selectTriggerCls(errors.event_category)}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#0d1117] border-[#1e2d3d] text-[#f0f4f8]">
                  {["conference", "webinar", "workshop", "competition", "technology", "coding", "other"].map((c) => (
                    <SelectItem key={c} value={c} className="capitalize hover:bg-[#161f2e] focus:bg-[#161f2e]">
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </Section>

          {/* ── Event Details ── */}
          <Section
            title="Event Details"
            icon={<LayoutGrid className="w-3.5 h-3.5 text-blue-400" />}
            iconColor="bg-blue-500/10 border-blue-500/20"
          >
            <Field label="Event Mode" required error={errors.event_mode}>
              <Select value={formData.event_mode} onValueChange={(v) => handleSelectChange("event_mode", v)}>
                <SelectTrigger className={selectTriggerCls(errors.event_mode)}>
                  <SelectValue placeholder="Select event mode" />
                </SelectTrigger>
                <SelectContent className="bg-[#0d1117] border-[#1e2d3d] text-[#f0f4f8]">
                  <SelectItem value="online" className="hover:bg-[#161f2e] focus:bg-[#161f2e]">Online</SelectItem>
                  <SelectItem value="offline" className="hover:bg-[#161f2e] focus:bg-[#161f2e]">Offline</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {formData.event_mode === "offline" && (
              <Field label="Location" required error={errors.location}>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-[#4b6480] pointer-events-none" />
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter venue address"
                    className={inputCls(errors.location) + " pl-10"}
                  />
                </div>
              </Field>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Start Date & Time" required error={errors.start_time}>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-[#4b6480] pointer-events-none" />
                  <input
                    name="start_time"
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={handleChange}
                    className={inputCls(errors.start_time) + " pl-10 [scheme-dark]"}
                  />
                </div>
              </Field>

              <Field label="End Date & Time" required error={errors.end_time}>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#4b6480] pointer-events-none" />
                  <input
                    name="end_time"
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={handleChange}
                    className={inputCls(errors.end_time) + " pl-10 [scheme-dark]"}
                  />
                </div>
              </Field>
            </div>

            <Field label="Registration Deadline" required error={errors.registration_deadline}>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-[#4b6480] pointer-events-none" />
                <input
                  name="registration_deadline"
                  type="datetime-local"
                  value={formData.registration_deadline}
                  onChange={handleChange}
                  className={inputCls(errors.registration_deadline) + " pl-10 [scheme-dark]"}
                />
              </div>
            </Field>

            <Field label="Capacity" required error={errors.capacity}>
              <div className="relative">
                <Users className="absolute left-3.5 top-3.5 w-4 h-4 text-[#4b6480] pointer-events-none" />
                <input
                  name="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  className={inputCls(errors.capacity) + " pl-10"}
                />
              </div>
            </Field>
          </Section>

          {/* ── Pricing ── */}
          <Section
            title="Pricing"
            icon={<Tag className="w-3.5 h-3.5 text-amber-400" />}
            iconColor="bg-amber-500/10 border-amber-500/20"
          >
            <Field label="Payment Type" required error={errors.payment_type}>
              <Select value={formData.payment_type} onValueChange={(v) => handleSelectChange("payment_type", v)}>
                <SelectTrigger className={selectTriggerCls(errors.payment_type)}>
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent className="bg-[#0d1117] border-[#1e2d3d] text-[#f0f4f8]">
                  <SelectItem value="free" className="hover:bg-[#161f2e] focus:bg-[#161f2e]">Free</SelectItem>
                  <SelectItem value="paid" className="hover:bg-[#161f2e] focus:bg-[#161f2e]">Paid</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {formData.payment_type === "paid" && (
              <Field label="Price (₹)" required error={errors.price}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b6480] text-sm font-medium pointer-events-none">₹</span>
                  <input
                    name="price"
                    type="number"
                    min="1"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    className={inputCls(errors.price) + " pl-8"}
                  />
                </div>
              </Field>
            )}

            {formData.payment_type === "free" && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                <p className="text-xs text-emerald-400 font-medium">This event will be free for all attendees</p>
              </div>
            )}
          </Section>

          {/* ── Event Banners ── */}
          <Section
            title="Event Banners"
            icon={<FileImage className="w-3.5 h-3.5 text-fuchsia-400" />}
            iconColor="bg-fuchsia-500/10 border-fuchsia-500/20"
          >
            <div className="flex items-start gap-3 p-4 bg-violet-600/[0.06] border border-violet-600/15 rounded-lg">
              <Info className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
              <div className="text-xs text-[#94a3b8] space-y-1">
                <p className="font-semibold text-violet-300 mb-1.5">Banner Guidelines</p>
                <p>• Upload 1–3 images &nbsp;•&nbsp; Recommended: 1200×630px</p>
                <p>• Max 5MB per image &nbsp;•&nbsp; JPG, PNG, WEBP supported</p>
              </div>
            </div>

            {bannerPreviews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {bannerPreviews.map((preview, index) => (
                  <div key={index} className="group relative rounded-xl overflow-hidden border border-[#1e2d3d]">
                    <img src={preview} alt={`Banner ${index + 1}`} className="w-full h-40 object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <button
                      type="button"
                      onClick={() => removeBanner(index)}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500/90 hover:bg-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                    <div className="absolute bottom-2 left-2 text-[10px] font-semibold text-white/70 bg-black/50 px-2 py-0.5 rounded-md">
                      Banner {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {bannerFiles.length < 3 && (
              <label
                htmlFor="banners"
                className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[#1e2d3d] hover:border-violet-600/40 rounded-xl cursor-pointer bg-[#0d1117] hover:bg-violet-600/[0.03] transition-all duration-200 group"
              >
                <Upload className="w-6 h-6 text-[#4b6480] group-hover:text-violet-400 mb-2 transition-colors duration-200" />
                <p className="text-xs text-[#4b6480] group-hover:text-[#94a3b8] font-medium transition-colors">
                  Click to upload banner images
                </p>
                <p className="text-[11px] text-[#2d4159] mt-0.5">
                  {3 - bannerFiles.length} more image{3 - bannerFiles.length !== 1 ? "s" : ""} can be added
                </p>
                <input id="banners" name="banners" type="file" accept="image/*" multiple onChange={handleBannerUpload} className="hidden" />
              </label>
            )}

            {errors.bannerUrls && (
              <p className="text-xs text-red-400 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                {errors.bannerUrls}
              </p>
            )}
          </Section>

          {/* ── Action Buttons ── */}
          <div className="flex items-center gap-3 justify-end pt-2 pb-6">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              disabled={isLoading}
              className="h-9 px-5 rounded-lg text-sm font-medium border border-[#243447] bg-[#161f2e] hover:bg-[#111827] hover:border-[#2d4159] text-[#94a3b8] hover:text-[#f0f4f8] transition-all duration-150 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 h-9 px-6 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_10px_rgba(124,58,237,0.2)] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating Event...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Create Event</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateEvent;