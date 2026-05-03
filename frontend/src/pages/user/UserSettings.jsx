import React, { useState } from "react";
import { Mail, MapPin, Phone, Save, User } from "lucide-react";

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400"
        />
      </div>
    </div>
  );
}

export default function UserSettings() {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: localStorage.getItem("username") || "",
    email: localStorage.getItem("email") || "",
    phone: "",
    city: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      localStorage.setItem("username", form.name);
      alert("Profile settings saved successfully");
    } catch (error) {
      console.error("Save user settings error:", error);
      alert("Failed to save profile settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Settings</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Manage your profile and personal information
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      <form
        onSubmit={handleSave}
        className="rounded-xl border border-slate-100 bg-white p-5"
      >
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-sm font-bold text-slate-900">
            Personal Information
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Update the details linked to your account
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            icon={User}
          />

          <Field
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            icon={Mail}
            type="email"
          />

          <Field
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            icon={Phone}
          />

          <Field
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Enter your city"
            icon={MapPin}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}