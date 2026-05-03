import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Tag,
  MapPin,
  FileText,
  Phone,
  Clock3,
  Upload,
  Check,
} from "lucide-react";
import api from "../../api/axios";
import businessImage from "../../assets/login.jpg";

const CATEGORY_OPTIONS = [
  { value: "", label: "Select category" },
  { value: "beauty_salon", label: "Beauty Salon" },
  { value: "clinic", label: "Clinic" },
  { value: "hospital", label: "Hospital" },
  { value: "bank", label: "Bank" },
  { value: "government_service", label: "Government Service" },
  { value: "embassy_consulate", label: "Embassy / Consulate" },
  { value: "medical_lab", label: "Medical Lab" },
  { value: "language_test_center", label: "Language Test Center" },
];

const CITY_OPTIONS = [
  { value: "", label: "Select city" },
  { value: "Casablanca", label: "Casablanca" },
  { value: "Rabat", label: "Rabat" },
  { value: "Tangier", label: "Tangier" },
];

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

function InputWithIcon({
  icon: Icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="relative">
      <Icon
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#132249] focus:ring-2 focus:ring-[#132249]/10"
      />
    </div>
  );
}

function SelectWithIcon({ icon: Icon, name, value, onChange, options }) {
  return (
    <div className="relative">
      <Icon
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#132249] focus:ring-2 focus:ring-[#132249]/10"
      >
        {options.map((option) => (
          <option key={option.value || "empty"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FileUploadCard({
  title,
  subtitle,
  multiple = false,
  accept = "image/*",
  onChange,
}) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center transition hover:border-[#132249] hover:bg-[#f9fbff]">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#132249]">
        <Upload size={22} />
      </div>
      <p className="text-sm font-semibold text-[#132249]">{title}</p>
      <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onChange}
        className="hidden"
      />
    </label>
  );
}

export default function CreateBusiness() {
  const navigate = useNavigate();
  const savedDraft = JSON.parse(
    localStorage.getItem("pendingBusinessDraft") || "{}"
  );

  const [form, setForm] = useState({
    businessName: savedDraft.businessName || "",
    category: savedDraft.category || "",
    city: savedDraft.city || "",
    address: "",
    phone: savedDraft.phone || "",
    description: "",
  });

  const [schedule, setSchedule] = useState({
    monday: { isOpen: true, open: "09:00", close: "18:00" },
    tuesday: { isOpen: true, open: "09:00", close: "18:00" },
    wednesday: { isOpen: true, open: "09:00", close: "18:00" },
    thursday: { isOpen: true, open: "09:00", close: "18:00" },
    friday: { isOpen: true, open: "09:00", close: "18:00" },
    saturday: { isOpen: true, open: "09:00", close: "18:00" },
    sunday: { isOpen: false, open: "", close: "" },
  });

  const [mainPhoto, setMainPhoto] = useState(null);
  const [mainPreview, setMainPreview] = useState("");
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const galleryCountText = useMemo(() => {
    if (!galleryFiles.length) return "No gallery images selected yet";
    return `${galleryFiles.length} gallery image${
      galleryFiles.length > 1 ? "s" : ""
    } selected`;
  }, [galleryFiles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleScheduleChange = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleMainPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMainPhoto(file);
    setMainPreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    setGalleryFiles(files);
    setGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const validateForm = () => {
    if (!form.businessName.trim()) return "Business name is required.";
    if (!form.category) return "Category is required.";
    if (!form.city) return "City is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (!mainPhoto) return "Main business photo is required.";

    for (const day of DAYS) {
      const currentDay = schedule[day.key];
      if (currentDay.isOpen && (!currentDay.open || !currentDay.close)) {
        return `Please complete opening and closing hours for ${day.label}.`;
      }
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const data = new FormData();
      data.append("businessName", form.businessName.trim());
      data.append("category", form.category);
      data.append("city", form.city);
      data.append("address", form.address.trim());
      data.append("phone", form.phone.trim());
      data.append("description", form.description.trim());
      data.append("schedule", JSON.stringify(schedule));

      if (mainPhoto) {
        data.append("mainPhoto", mainPhoto);
      }

      galleryFiles.forEach((file) => {
        data.append("photos", file);
      });

      const res = await api.post("/businesses", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?._id) {
        localStorage.setItem("businessId", res.data._id);
      }

      localStorage.removeItem("pendingBusinessDraft");

      setSuccess("Business created successfully. Waiting for admin approval.");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create business."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f7f8fc] px-4 py-8 md:px-6">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_20px_80px_rgba(19,34,73,0.10)] lg:grid-cols-[1.02fr_0.98fr]">
        <div className="relative hidden min-h-[920px] overflow-hidden lg:block">
          <img
            src={businessImage}
            alt="Business setup visual"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(19,34,73,0.78),rgba(19,34,73,0.34),rgba(19,34,73,0.12))]" />
          <div className="absolute inset-y-0 right-0 w-36 bg-[linear-gradient(to_right,rgba(255,255,255,0),rgba(255,255,255,0.94))]" />

          <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
              <Building2 size={24} />
            </div>

            <div className="max-w-md">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-white/80">
                BUSINESS SETUP
              </p>

              <h2 className="text-4xl font-bold leading-tight">
                Make your business profile look trustworthy and professional
              </h2>

              <p className="mt-5 text-base leading-7 text-white/85">
                Add your photos, contact details, and weekly schedule so
                customers can discover your business and book with confidence.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {["Photo gallery", "Weekly schedule", "Professional profile"].map(
                  (pill) => (
                    <span
                      key={pill}
                      className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur"
                    >
                      {pill}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-5 md:p-8 lg:p-10">
          <div className="w-full max-w-2xl">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#132249]/60">
                NOBTY
              </p>
              <h1 className="mt-2 text-3xl font-bold text-[#132249]">
                Complete your business profile
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                This is the second step after account creation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="rounded-2xl border border-gray-200 bg-[#f9fbff] p-5">
                <h2 className="mb-4 text-xl font-semibold text-[#132249]">
                  Business Information
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Business Name
                    </label>
                    <InputWithIcon
                      icon={Building2}
                      name="businessName"
                      value={form.businessName}
                      onChange={handleChange}
                      placeholder="Enter business name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Category
                    </label>
                    <SelectWithIcon
                      icon={Tag}
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      options={CATEGORY_OPTIONS}
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      City
                    </label>
                    <SelectWithIcon
                      icon={MapPin}
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      options={CITY_OPTIONS}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Phone
                    </label>
                    <InputWithIcon
                      icon={Phone}
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+212..."
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Address
                  </label>
                  <InputWithIcon
                    icon={MapPin}
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                  />
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Description
                  </label>
                  <div className="relative">
                    <FileText
                      size={18}
                      className="absolute left-4 top-4 text-gray-400"
                    />
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Tell customers about your business"
                      rows="4"
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#132249] focus:ring-2 focus:ring-[#132249]/10"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-[#f9fbff] p-5">
                <h2 className="mb-4 text-xl font-semibold text-[#132249]">
                  Business Photos
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <FileUploadCard
                    title="Upload main photo"
                    subtitle="One cover photo for your business"
                    onChange={handleMainPhotoChange}
                  />

                  <FileUploadCard
                    title="Upload gallery photos"
                    subtitle="Select multiple images"
                    multiple
                    onChange={handleGalleryChange}
                  />
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-gray-800">
                      Main photo preview
                    </p>

                    {mainPreview ? (
                      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                        <img
                          src={mainPreview}
                          alt="Main preview"
                          className="h-56 w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-sm text-gray-500">
                        No main image selected
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-800">
                        Gallery preview
                      </p>
                      <span className="text-xs text-gray-500">
                        {galleryCountText}
                      </span>
                    </div>

                    {galleryPreviews.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {galleryPreviews.map((src, index) => (
                          <div
                            key={`${src}-${index}`}
                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                          >
                            <img
                              src={src}
                              alt={`Gallery preview ${index + 1}`}
                              className="h-28 w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-sm text-gray-500">
                        No gallery images selected
                      </div>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-500">
                  Upload a strong cover photo and a few gallery images to make
                  your business profile feel more premium.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-[#f9fbff] p-5">
                <h2 className="mb-4 text-xl font-semibold text-[#132249]">
                  Weekly Schedule
                </h2>

                <div className="space-y-3">
                  {DAYS.map((day) => {
                    const value = schedule[day.key];

                    return (
                      <div
                        key={day.key}
                        className="rounded-2xl border border-gray-200 bg-white p-4"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                value.isOpen
                                  ? "bg-[#eefbf3] text-[#18794e]"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {value.isOpen ? (
                                <Check size={18} />
                              ) : (
                                <Clock3 size={18} />
                              )}
                            </div>

                            <div>
                              <p className="font-semibold capitalize text-[#132249]">
                                {day.label}
                              </p>
                              <p className="text-sm text-gray-500">
                                {value.isOpen ? "Open" : "Closed"}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                              <input
                                type="checkbox"
                                checked={value.isOpen}
                                onChange={(e) =>
                                  handleScheduleChange(
                                    day.key,
                                    "isOpen",
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4 rounded border-gray-300 text-[#132249] focus:ring-[#132249]"
                              />
                              Open this day
                            </label>

                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={value.open}
                                disabled={!value.isOpen}
                                onChange={(e) =>
                                  handleScheduleChange(
                                    day.key,
                                    "open",
                                    e.target.value
                                  )
                                }
                                className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#132249] focus:ring-2 focus:ring-[#132249]/10 disabled:bg-gray-100 disabled:text-gray-400"
                              />
                              <span className="text-sm text-gray-500">to</span>
                              <input
                                type="time"
                                value={value.close}
                                disabled={!value.isOpen}
                                onChange={(e) =>
                                  handleScheduleChange(
                                    day.key,
                                    "close",
                                    e.target.value
                                  )
                                }
                                className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#132249] focus:ring-2 focus:ring-[#132249]/10 disabled:bg-gray-100 disabled:text-gray-400"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#132249] py-3 font-medium text-white transition hover:-translate-y-[1px] hover:opacity-95 disabled:opacity-50"
              >
                {loading ? "Creating business..." : "Finish setup"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}