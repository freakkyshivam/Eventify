import { useState } from "react";
import { X, Calendar, MapPin, IndianRupee, Tag, Check, Loader2 } from "lucide-react";
import type { eventI } from "@/types/Event";

type EventEditModalProps = {
  event: eventI;
  isOpen: boolean;
  onClose: () => void;
  onSave: (slug: string, data: any) => Promise<boolean>;
};

export function EventEditModal({ event, isOpen, onClose, onSave }: EventEditModalProps) {
  const [formData, setFormData] = useState({
    title: event.title || "",
    description: event.description || "",
    location: event.location || "",
    price: event.price?.toString() || "0",
    capacity: event.capacity?.toString() || "0",
    event_category: event.event_category || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Format numeric fields
      const submitData = {
        ...formData,
        price: Number(formData.price),
        capacity: Number(formData.capacity)
      };

      const success = await onSave(event.slug, submitData);
      if (success) {
        onClose();
      } else {
        setError("Failed to update event. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#080c12]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#0d1117] border border-[#1e2d3d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2d3d] bg-[#161f2e]/50">
          <div>
            <h3 className="text-lg font-bold text-[#f0f4f8]">Edit Event</h3>
            <p className="text-xs text-[#8a9fb1] mt-0.5">Modify details for {event.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#161f2e] hover:bg-[#1e2d3d] border border-[#1e2d3d] text-[#8a9fb1] hover:text-[#f0f4f8] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form id="edit-event-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#8a9fb1]">Event Title</label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-[#161f2e] border border-[#1e2d3d] rounded-xl px-4 py-2.5 text-sm text-[#f0f4f8] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  placeholder="Enter event title"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#8a9fb1]">Description</label>
              <textarea
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-[#161f2e] border border-[#1e2d3d] rounded-xl px-4 py-2.5 text-sm text-[#f0f4f8] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"
                placeholder="Enter event description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#8a9fb1]">Location</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#4b6480]" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-[#161f2e] border border-[#1e2d3d] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f0f4f8] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    placeholder="Venue / Link"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#8a9fb1]">Category</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                    <Tag className="w-4 h-4 text-[#4b6480]" />
                  </div>
                  <select
                    name="event_category"
                    required
                    value={formData.event_category}
                    onChange={handleChange}
                    className="w-full bg-[#161f2e] border border-[#1e2d3d] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f0f4f8] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all appearance-none"
                  >
                    <option value="" disabled>Select category</option>
                    <option value="conference">Conference</option>
                    <option value="webinar">Webinar</option>
                    <option value="workshop">Workshop</option>
                    <option value="competition">Competition</option>
                    <option value="technology">Technology</option>
                    <option value="coding">Coding</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#8a9fb1]">Price (₹)</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                    <IndianRupee className="w-4 h-4 text-[#4b6480]" />
                  </div>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-[#161f2e] border border-[#1e2d3d] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f0f4f8] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    placeholder="0 for free"
                  />
                </div>
              </div>

              {/* Capacity */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#8a9fb1]">Capacity</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-[#4b6480]" />
                  </div>
                  <input
                    type="number"
                    name="capacity"
                    min="0"
                    required
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full bg-[#161f2e] border border-[#1e2d3d] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#f0f4f8] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    placeholder="Total tickets"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1e2d3d] bg-[#161f2e]/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-sm font-medium text-[#8a9fb1] hover:text-[#f0f4f8] hover:bg-[#1e2d3d] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-event-form"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-[#080c12] text-sm font-bold transition-all duration-200 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
