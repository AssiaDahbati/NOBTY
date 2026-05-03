import React, { useEffect, useMemo, useState } from "react";
import {
  Camera,
  ImagePlus,
  MapPin,
  Phone,
  Save,
  Store,
  Trash2,
} from "lucide-react";
import {
  getMyBusiness,
  updateMyBusiness,
} from "../../services/businessSettingsService";

const cities = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Tangier",
  "Fes",
  "Agadir",
  "Meknes",
  "Oujda",
  "Kenitra",
  "Tetouan",
];

export default function BusinessSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [business, setBusiness] = useState(null);

  const [form, setForm] = useState({
    businessName: "",
    category: "",
    city: "",
    address: "",
    phone: "",
    description: "",
  });

  const [mainPhotoFile, setMainPhotoFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      const data = await getMyBusiness();
      setBusiness(data);

      setForm({
        businessName: data.businessName || "",
        category: data.category || "",
        city: data.city || "",
        address: data.address || "",
        phone: data.phone || "",
        description: data.description || "",
      });

      setExistingPhotos(data.photos || []);
    } catch (error) {
      console.error("Fetch business settings error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, []);

  const mainPhotoPreview = useMemo(() => {
    if (mainPhotoFile) {
      return URL.createObjectURL(mainPhotoFile);
    }
    return business?.mainPhoto || "";
  }, [mainPhotoFile, business]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMainPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMainPhotoFile(file);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    setGalleryFiles(files);
  };

  const removeExistingPhoto = (photoUrl) => {
    setExistingPhotos((prev) => prev.filter((url) => url !== photoUrl));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = new FormData();
      data.append("businessName", form.businessName);
      data.append("category", form.category);
      data.append("city", form.city);
      data.append("address", form.address);
      data.append("phone", form.phone);
      data.append("description", form.description);
      data.append("keepExistingPhotos", JSON.stringify(existingPhotos));

      if (mainPhotoFile) {
        data.append("mainPhoto", mainPhotoFile);
      }

      galleryFiles.forEach((file) => {
        data.append("photos", file);
      });

      const updated = await updateMyBusiness(data);
      setBusiness(updated);
      setExistingPhotos(updated.photos || []);
      setMainPhotoFile(null);
      setGalleryFiles([]);
      alert("Business settings updated successfully");
    } catch (error) {
      console.error("Update business settings error:", error);
      alert("Failed to update business settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-slate-500">Loading business settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm opacity-90">Settings</p>
            <h2 className="mt-1 text-2xl font-bold">
              Manage your business profile
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-blue-100">
              Update your business details, contact information, photos, and
              profile presentation.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                Business Information
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Keep your public profile accurate and professional
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Business Name"
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                placeholder="Enter business name"
                icon={Store}
              />

              <Field
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Salon, Spa, Clinic"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  City
                </label>
                <div className="relative">
                  <MapPin
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
                  >
                    <option value="">Select city</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Field
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                icon={Phone}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter business address"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={6}
                placeholder="Describe your business..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">
              Main Photo
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              The main image shown on your business profile
            </p>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              {mainPhotoPreview ? (
                <img
                  src={mainPhotoPreview}
                  alt="Main business"
                  className="h-56 w-full object-cover"
                />
              ) : (
                <div className="flex h-56 items-center justify-center text-slate-400">
                  No main photo
                </div>
              )}
            </div>

            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-blue-500 hover:text-blue-600">
              <Camera size={18} />
              Upload Main Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleMainPhotoChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">
              Gallery Photos
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Showcase your business with multiple images
            </p>

            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-blue-500 hover:text-blue-600">
              <ImagePlus size={18} />
              Add Gallery Photos
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
                className="hidden"
              />
            </label>

            {galleryFiles.length > 0 && (
              <div className="mt-4 rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
                {galleryFiles.length} new photo(s) selected
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3">
              {existingPhotos.length > 0 ? (
                existingPhotos.map((photo, index) => (
                  <div
                    key={`${photo}-${index}`}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200"
                  >
                    <img
                      src={photo}
                      alt={`Gallery ${index + 1}`}
                      className="h-28 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingPhoto(photo)}
                      className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-red-600 opacity-0 shadow-sm transition group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-2 rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
                  No gallery photos yet
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">
              Profile Summary
            </h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <SummaryRow label="Business" value={form.businessName || "-"} />
              <SummaryRow label="Category" value={form.category || "-"} />
              <SummaryRow label="City" value={form.city || "-"} />
              <SummaryRow label="Phone" value={form.phone || "-"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}
        <input
          {...props}
          className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white ${
            Icon ? "pl-10" : "px-4"
          }`}
        />
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <span>{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}