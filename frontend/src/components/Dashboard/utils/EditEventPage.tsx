import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  LayoutGrid, Zap, AlertCircle, CheckCircle2, RefreshCw,
} from "lucide-react";
import api from "@/services/axiosInstance";
import { type EventFormData } from "@/types/Event";
import { EventFormDataValidation } from "@/validation/eventCreationFormValidation";
import { getEventBySlugApi } from "@/api/event/eventApi";

// ── Reusable field wrapper ──
const Field = ({
  label, required, error, children,
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
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

// ── Input class helper ──
const inputCls = (error?: string) =>
  `w-full px-4 py-3 bg-white/[0.04] border rounded-xl text-white placeholder-slate-600 text-sm transition-all duration-200 outline-none focus:ring-2 [color-scheme:dark] ${error
    ? "border-red-500/50 focus:ring-red-500/20 focus:border-red-500/60"
    : "border-white/[0.08] hover:border-white/[0.14] focus:ring-violet-500/20 focus:border-violet-500/40"
  }`;

// ── Section card ──
const Section = ({
  title, icon, iconColor, children,
}: {
  title: string; icon: React.ReactNode; iconColor: string; children: React.ReactNode;
}) => (
  <div className="bg-white/3 border border-white/[0.07] rounded-2xl overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-white/6">
      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${iconColor}`}>
        {icon}
      </div>
      <h2 className="text-sm font-bold text-white">{title}</h2>
    </div>
    <div className="p-6 space-y-5">{children}</div>
  </div>
);

// ── Select trigger class ──
const selectTriggerCls = (error?: string) =>
  `w-full px-4 py-3 h-auto bg-white/[0.04] border rounded-xl text-white text-sm transition-all duration-200 outline-none focus:ring-2 ${error
    ? "border-red-500/50 focus:ring-red-500/20"
    : "border-white/[0.08] hover:border-white/[0.14] focus:ring-violet-500/20 focus:border-violet-500/40"
  }`;

const EditEvent = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});

  // Banners already on backend
  const [existingBanners, setExistingBanners] = useState<string[]>([]);
  // New files picked locally
  const [bannerFiles, setBannerFiles] = useState<File[]>([]);
  const [bannerPreviews, setBannerPreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState<EventFormData>({
    title: "", description: "", start_time: "", end_time: "",
    registration_deadline: "", location: "", event_mode: "",
    capacity: 100, event_category: "", payment_type: "", price: 0, bannerUrls: [],
  });

  // ISO → datetime-local
  const toLocal = (iso: string) => (iso ? new Date(iso).toISOString().slice(0, 16) : "");

  // ── Fetch event ──
  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        setFetchLoading(true);
        const res = await getEventBySlugApi(slug)
    
        const data = res.results;
        setFormData({
          title: data?.title ?? "",
          description: data?.description ?? "",
          start_time: toLocal(data?.start_time),
          end_time: toLocal(data?.end_time),
          registration_deadline: toLocal(data?.registration_deadline),
          location: data?.location ?? "",
          event_mode: data?.event_mode ?? "",
          capacity: data?.capacity ?? 100,
          event_category: data?.event_category ?? "",
          payment_type: data?.payment_type ?? "",
          price: data?.price ?? 0,
          bannerUrls: [],
        });
        setExistingBanners(data?.bannerUrls ?? []);
      } catch (err: unknown) {
        setFetchError((err as { response?: { data?: { msg?: string } } })?.response?.data?.msg || "Failed to load event.");
      } finally {
        setFetchLoading(false);
      }
    })();
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "number" ? Number(value) : value }));
    if (errors[name as keyof EventFormData]) setErrors((p) => ({ ...p, [name]: undefined }));
    setSaved(false); setSaveError("");
  };

  const handleSelectChange = (name: keyof EventFormData, value: string) => {
    setFormData((p) => ({
      ...p, [name]: value,
      ...(name === "payment_type" && value === "free" && { price: 0 }),
    }));
    setSaved(false); setSaveError("");
  };

  // ── Banner upload ──
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (existingBanners.length + bannerFiles.length + files.length > 3) {
      setErrors((p) => ({ ...p, bannerUrls: "Maximum 3 images allowed" })); return;
    }
    const valid = files.filter((f) => {
      if (!f.type.startsWith("image/")) { setErrors((p) => ({ ...p, bannerUrls: "Only image files allowed" })); return false; }
      if (f.size > 5 * 1024 * 1024) { setErrors((p) => ({ ...p, bannerUrls: "Image size must be less than 5MB" })); return false; }
      return true;
    });
    setBannerFiles((p) => [...p, ...valid]);
    valid.forEach((f) => {
      const r = new FileReader();
      r.onloadend = () => setBannerPreviews((p) => [...p, r.result as string]);
      r.readAsDataURL(f);
    });
    setErrors((p) => ({ ...p, bannerUrls: undefined }));
  };

  const removeExisting = (i: number) => setExistingBanners((p) => p.filter((_, j) => j !== i));
  const removeNew = (i: number) => {
    setBannerFiles((p) => p.filter((_, j) => j !== i));
    setBannerPreviews((p) => p.filter((_, j) => j !== i));
  };

  const totalBanners = existingBanners.length + bannerFiles.length;

  // ── Submit PATCH ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EventFormDataValidation(formData, setErrors)) return;
    try {
      setIsLoading(true); setSaveError("");
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
      existingBanners.forEach((url) => fd.append("existingBanners", url));
      bannerFiles.forEach((f) => fd.append("banners", f));
      await api.patch(`/events/${slug}`, fd, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      setSaveError((err as { response?: { data?: { msg?: string } } })?.response?.data?.msg || "Failed to update event.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Loading ──
  if (fetchLoading) return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-violet-500 animate-spin" />
          <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-violet-400" />
        </div>
        <p className="text-slate-500 text-sm font-medium">Loading event...</p>
      </div>
    </div>
  );

  // ── Fetch error ──
  if (fetchError) return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold mb-1">Failed to load event</h3>
          <p className="text-slate-500 text-sm max-w-xs">{fetchError}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-white/10 bg-white/3 text-slate-300 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080810] py-10">

      {/* Ambient orb */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm font-medium transition-colors duration-200 mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-violet-400" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Edit Event</h1>
          </div>
          <p className="text-slate-500 text-sm ml-[52px]">Update the details below and save your changes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Basic Information ── */}
          <Section
            title="Basic Information"
            icon={<AlignLeft className="w-3.5 h-3.5 text-violet-400" />}
            iconColor="bg-violet-500/10 border-violet-500/20"
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
                <SelectContent className="bg-[#0f0f1a] border-white/10 text-white">
                  {["conference", "webinar", "workshop", "competition", "technology", "coding", "other"].map((c) => (
                    <SelectItem key={c} value={c} className="capitalize hover:bg-white/5 focus:bg-white/5">
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
                <SelectContent className="bg-[#0f0f1a] border-white/10 text-white">
                  <SelectItem value="online" className="hover:bg-white/5 focus:bg-white/5">Online</SelectItem>
                  <SelectItem value="offline" className="hover:bg-white/5 focus:bg-white/5">Offline</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {formData.event_mode === "offline" && (
              <Field label="Location" required error={errors.location}>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-600 pointer-events-none" />
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
                  <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-600 pointer-events-none" />
                  <input
                    name="start_time"
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={handleChange}
                    className={inputCls(errors.start_time) + " pl-10"}
                  />
                </div>
              </Field>

              <Field label="End Date & Time" required error={errors.end_time}>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-600 pointer-events-none" />
                  <input
                    name="end_time"
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={handleChange}
                    className={inputCls(errors.end_time) + " pl-10"}
                  />
                </div>
              </Field>
            </div>

            <Field label="Registration Deadline" required error={errors.registration_deadline}>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-600 pointer-events-none" />
                <input
                  name="registration_deadline"
                  type="datetime-local"
                  value={formData.registration_deadline}
                  onChange={handleChange}
                  className={inputCls(errors.registration_deadline) + " pl-10"}
                />
              </div>
            </Field>

            <Field label="Capacity" required error={errors.capacity}>
              <div className="relative">
                <Users className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-600 pointer-events-none" />
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
                <SelectContent className="bg-[#0f0f1a] border-white/10 text-white">
                  <SelectItem value="free" className="hover:bg-white/5 focus:bg-white/5">Free</SelectItem>
                  <SelectItem value="paid" className="hover:bg-white/5 focus:bg-white/5">Paid</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {formData.payment_type === "paid" && (
              <Field label="Price (₹)" required error={errors.price}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium pointer-events-none">₹</span>
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
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
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
            <div className="flex items-start gap-3 p-4 bg-violet-500/[0.07] border border-violet-500/15 rounded-xl">
              <Info className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-violet-300 mb-1.5">Banner Guidelines</p>
                <p>• Upload 1–3 images &nbsp;•&nbsp; Recommended: 1200×630px</p>
                <p>• Max 5MB per image &nbsp;•&nbsp; JPG, PNG, WEBP supported</p>
              </div>
            </div>

            {/* Existing banners (from backend) */}
            {existingBanners.length > 0 && (
              <div>
                <p className="text-[11px] text-slate-600 uppercase tracking-wider font-semibold mb-2">Current Banners</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {existingBanners.map((url, i) => (
                    <div key={i} className="group relative rounded-xl overflow-hidden border border-white/[0.07]">
                      <img src={url} alt={`Banner ${i + 1}`} className="w-full h-40 object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <button
                        type="button"
                        onClick={() => removeExisting(i)}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500/90 hover:bg-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                      <div className="absolute bottom-2 left-2 text-[10px] font-semibold text-white/70 bg-black/50 px-2 py-0.5 rounded-md">
                        Banner {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New banner previews */}
            {bannerPreviews.length > 0 && (
              <div>
                <p className="text-[11px] text-slate-600 uppercase tracking-wider font-semibold mb-2">New Banners</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {bannerPreviews.map((preview, i) => (
                    <div key={i} className="group relative rounded-xl overflow-hidden border border-violet-500/20">
                      <img src={preview} alt={`New banner ${i + 1}`} className="w-full h-40 object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <button
                        type="button"
                        onClick={() => removeNew(i)}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500/90 hover:bg-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                      <div className="absolute bottom-2 left-2 text-[10px] font-semibold text-violet-300 bg-black/60 px-2 py-0.5 rounded-md">
                        New
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload area */}
            {totalBanners < 3 && (
              <label
                htmlFor="edit-banners"
                className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-white/8 hover:border-violet-500/40 rounded-xl cursor-pointer bg-white/2 hover:bg-violet-500/4 transition-all duration-200 group"
              >
                <Upload className="w-6 h-6 text-slate-600 group-hover:text-violet-400 mb-2 transition-colors duration-200" />
                <p className="text-xs text-slate-500 group-hover:text-slate-400 font-medium transition-colors">
                  Click to upload banner images
                </p>
                <p className="text-[11px] text-slate-700 mt-0.5">
                  {3 - totalBanners} more image{3 - totalBanners !== 1 ? "s" : ""} can be added
                </p>
                <input id="edit-banners" type="file" accept="image/*" multiple onChange={handleBannerUpload} className="hidden" />
              </label>
            )}

            {errors.bannerUrls && (
              <p className="text-xs text-red-400 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                {errors.bannerUrls}
              </p>
            )}
          </Section>

          {/* ── Save error ── */}
          {saveError && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {saveError}
            </div>
          )}

          {/* ── Success ── */}
          {saved && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> Event updated successfully!
            </div>
          )}

          {/* ── Action Buttons ── */}
          <div className="flex items-center gap-3 justify-end pt-2 pb-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/10 bg-white/3 hover:bg-white/[0.07] hover:border-white/20 text-slate-300 hover:text-white transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-105 active:scale-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Save Changes</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditEvent;