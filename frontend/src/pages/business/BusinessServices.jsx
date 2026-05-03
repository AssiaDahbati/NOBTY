import React, { useEffect, useMemo, useState } from "react";
import {
  createBusinessService,
  deleteBusinessService,
  getBusinessServices,
  getMyBusiness,
  updateBusinessService,
} from "../../services/businessServiceManager";

const initialForm = {
  name: "",
  description: "",
  price: "",
  duration: "",
  image: null,
};

export default function BusinessServices() {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("create");
  const [businessId, setBusinessId] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const loadBusiness = async () => {
      try {
        const business = await getMyBusiness();
        setBusinessId(business._id);
        localStorage.setItem("businessId", business._id);
      } catch (error) {
        console.error("Failed to load business:", error);
        setLoading(false);
      }
    };

    loadBusiness();
  }, []);

  const fetchServices = async () => {
    try {
      if (!businessId) return;

      setLoading(true);
      const data = await getBusinessServices();
      setServices(data);

      if (data.length && !selected) {
        setSelected(data[0]);
        setForm({
          name: data[0].name || "",
          description: data[0].description || "",
          price: data[0].price || "",
          duration: data[0].duration || "",
          image: null,
        });
        setPreview(data[0].image || "");
        setMode("edit");
      }
    } catch (error) {
      console.error("Fetch services error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchServices();
    }
  }, [businessId]);

  const filteredServices = useMemo(() => {
    let list = [...services];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (service) =>
          service.name?.toLowerCase().includes(q) ||
          service.description?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [services, search]);

  useEffect(() => {
    if (!filteredServices.length) {
      if (mode === "edit") {
        setSelected(null);
        setForm(initialForm);
        setPreview("");
        setMode("create");
      }
      return;
    }

    if (mode === "edit") {
      const exists = filteredServices.some(
        (service) => service._id === selected?._id
      );

      if (!exists) {
        const first = filteredServices[0];
        setSelected(first);
        setForm({
          name: first.name || "",
          description: first.description || "",
          price: first.price || "",
          duration: first.duration || "",
          image: null,
        });
        setPreview(first.image || "");
      }
    }
  }, [filteredServices, selected, mode]);

  const handleSelect = (service) => {
    setSelected(service);
    setMode("edit");
    setForm({
      name: service.name || "",
      description: service.description || "",
      price: service.price || "",
      duration: service.duration || "",
      image: null,
    });
    setPreview(service.image || "");
  };

  const handleCreateNew = () => {
    setSelected(null);
    setMode("create");
    setForm(initialForm);
    setPreview("");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files?.[0] || null;

      setForm((prev) => ({
        ...prev,
        image: file,
      }));

      if (file) {
        setPreview(URL.createObjectURL(file));
      } else {
        setPreview(selected?.image || "");
      }

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!businessId) {
      console.error("Business ID is missing");
      return;
    }

    if (!form.name || !form.price || !form.duration) return;

    try {
      setSaving(true);

      if (mode === "create") {
        const created = await createBusinessService({
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          duration: Number(form.duration),
          image: form.image,
        });

        setServices((prev) => [created, ...prev]);
        setSelected(created);
        setMode("edit");
        setForm({
          name: created.name || "",
          description: created.description || "",
          price: created.price || "",
          duration: created.duration || "",
          image: null,
        });
        setPreview(created.image || "");
      } else if (selected) {
        const updated = await updateBusinessService(selected._id, {
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          duration: Number(form.duration),
          image: form.image,
        });

        setServices((prev) =>
          prev.map((service) =>
            service._id === updated._id ? updated : service
          )
        );
        setSelected(updated);
        setForm({
          name: updated.name || "",
          description: updated.description || "",
          price: updated.price || "",
          duration: updated.duration || "",
          image: null,
        });
        setPreview(updated.image || "");
      }
    } catch (error) {
      console.error("Save service error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteBusinessService(selected._id);

      const nextServices = services.filter(
        (service) => service._id !== selected._id
      );
      setServices(nextServices);

      if (nextServices.length > 0) {
        const next = nextServices[0];
        setSelected(next);
        setMode("edit");
        setForm({
          name: next.name || "",
          description: next.description || "",
          price: next.price || "",
          duration: next.duration || "",
          image: null,
        });
        setPreview(next.image || "");
      } else {
        setSelected(null);
        setMode("create");
        setForm(initialForm);
        setPreview("");
      }
    } catch (error) {
      console.error("Delete service error:", error);
    } finally {
      setDeleting(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: services.length,
      avgPrice: services.length
        ? Math.round(
            services.reduce((sum, item) => sum + Number(item.price || 0), 0) /
              services.length
          )
        : 0,
      avgDuration: services.length
        ? Math.round(
            services.reduce(
              (sum, item) => sum + Number(item.duration || 0),
              0
            ) / services.length
          )
        : 0,
    };
  }, [services]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm opacity-90">Services</p>
            <h2 className="mt-1 text-2xl font-bold">
              Manage your business services
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-blue-100">
              Add new services, update pricing and duration, and keep your
              offerings organized.
            </p>
          </div>

          <button
            onClick={handleCreateNew}
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Add New Service
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Services</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-800">
            {stats.total}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Average Price</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-800">
            {stats.avgPrice}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Average Duration</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-800">
            {stats.avgDuration} min
          </h3>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-4 md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                Service Manager
              </h3>
              <p className="text-sm text-slate-500">
                Create, edit, and remove services
              </p>
            </div>

            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white sm:w-80"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12">
          <div className="xl:col-span-5 border-r border-slate-200 bg-slate-50/60">
            <div className="px-4 py-4 md:px-6">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Services List
                </div>

                {loading ? (
                  <div className="p-6 text-sm text-slate-500">
                    Loading services...
                  </div>
                ) : filteredServices.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      ✂️
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700">
                      No services found
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Add your first service to get started.
                    </p>
                  </div>
                ) : (
                  filteredServices.map((service) => {
                    const isActive =
                      selected?._id === service._id && mode === "edit";

                    return (
                      <button
                        key={service._id}
                        onClick={() => handleSelect(service)}
                        className={`w-full border-b border-slate-100 px-4 py-4 text-left transition last:border-b-0 hover:bg-slate-50 ${
                          isActive
                            ? "border-l-4 border-blue-600 bg-blue-50"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={
                              service.image ||
                              "https://via.placeholder.com/80x80?text=Service"
                            }
                            alt={service.name}
                            className="h-16 w-16 rounded-xl object-cover"
                          />

                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {service.name}
                                </p>
                                <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                                  {service.description || "No description"}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="text-sm font-semibold text-slate-800">
                                  {service.price}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {service.duration} min
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="xl:col-span-7 bg-white">
            <div className="h-full p-4 md:p-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  {mode === "create" ? "Create New Service" : "Edit Service"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {mode === "create"
                    ? "Add a new service for your customers"
                    : "Update the selected service details"}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-4 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Service Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Haircut"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                    required
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
                    rows={5}
                    placeholder="Describe this service..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="e.g. 150"
                      min="0"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      placeholder="e.g. 45"
                      min="1"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Service Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {preview && (
                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <img
                      src={preview}
                      alt="Service preview"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : mode === "create"
                      ? "Create Service"
                      : "Update Service"}
                  </button>

                  {mode === "edit" && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deleting ? "Deleting..." : "Delete Service"}
                    </button>
                  )}

                  {mode === "edit" && (
                    <button
                      type="button"
                      onClick={handleCreateNew}
                      className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
                    >
                      New Service
                    </button>
                  )}
                </div>
              </form>

              {mode === "edit" && selected && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Selected service
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {selected.name}
                    </span>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                      {selected.price}
                    </span>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                      {selected.duration} min
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}