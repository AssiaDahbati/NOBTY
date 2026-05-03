import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Mail,
  MapPin,
  Search,
  ShieldCheck,
  Tag,
  User2,
  Image as ImageIcon,
  Phone,
  CalendarDays,
} from "lucide-react";
import {
  getBusinessRequests,
  approveBusiness,
  rejectBusiness,
} from "../../services/adminService";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80";

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const data = await getApprovedBusinesses();
      setBusinesses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch approved businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const filteredBusinesses = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return businesses;

    return businesses.filter((item) => {
      const businessName = item.businessName?.toLowerCase() || "";
      const category = item.category?.toLowerCase() || "";
      const city = item.city?.toLowerCase() || "";
      const address = item.address?.toLowerCase() || "";
      const ownerEmail = item.owner?.email?.toLowerCase() || "";
      const ownerPhone = item.owner?.phone?.toLowerCase() || "";
      const description = item.description?.toLowerCase() || "";

      return (
        businessName.includes(q) ||
        category.includes(q) ||
        city.includes(q) ||
        address.includes(q) ||
        ownerEmail.includes(q) ||
        ownerPhone.includes(q) ||
        description.includes(q)
      );
    });
  }, [search, businesses]);

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Businesses</h1>
            <p className="mt-1 text-sm text-slate-500">
              View all approved businesses currently visible on the platform.
            </p>
          </div>

          <div className="relative w-full xl:w-[360px]">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search business, owner, city, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-[#f8fafc] py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 2xl:grid-cols-[1.7fr_0.8fr]">
        <div className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center text-slate-500">
              Loading businesses...
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Building2 className="text-slate-400" size={28} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-800">
                No approved businesses
              </h3>
              <p className="mt-1 max-w-md text-sm text-slate-500">
                There are currently no approved businesses matching your search.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBusinesses.map((item) => {
                const image =
                  item.mainPhoto ||
                  (Array.isArray(item.photos) && item.photos[0]) ||
                  FALLBACK_IMAGE;

                return (
                  <div
                    key={item._id}
                    className="overflow-hidden rounded-[26px] border border-slate-200 bg-[#fbfcfe] p-5 transition hover:border-slate-300"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start">
                          <div className="h-28 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white md:w-40">
                            <img
                              src={image}
                              alt={item.businessName}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-xl font-bold text-slate-900">
                                {item.businessName}
                              </h3>

                              <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                <ShieldCheck size={14} />
                                Approved
                              </span>
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                  <User2 size={16} />
                                  Owner
                                </div>
                                <p className="mt-2 font-semibold text-slate-900">
                                  {item.owner?.email || "Unknown"}
                                </p>
                                <p className="mt-1 break-all text-sm text-slate-500">
                                  {item.phone || item.owner?.phone || "-"}
                                </p>
                              </div>

                              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                  <Tag size={16} />
                                  Category
                                </div>
                                <p className="mt-2 font-semibold capitalize text-slate-900">
                                  {item.category || "-"}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                  Created{" "}
                                  {item.createdAt
                                    ? new Date(item.createdAt).toLocaleDateString()
                                    : "-"}
                                </p>
                              </div>

                              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                  <MapPin size={16} />
                                  Location
                                </div>
                                <p className="mt-2 font-semibold text-slate-900">
                                  {item.city || "-"}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                  {item.address || "No address provided"}
                                </p>
                              </div>
                            </div>

                            {(item.description || "").trim() && (
                              <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4">
                                <p className="text-sm font-medium text-slate-500">
                                  Description
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-700">
                                  {item.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="w-full xl:w-[240px]">
                        <div className="rounded-2xl border border-slate-100 bg-white p-4">
                          <p className="text-sm font-medium text-slate-500">
                            Business status
                          </p>
                          <p className="mt-2 text-lg font-bold text-green-700">
                            Live on platform
                          </p>

                          <div className="mt-4 space-y-3 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                              <Mail size={16} />
                              <span className="truncate">
                                {item.owner?.email || "No email"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Phone size={16} />
                              <span>{item.phone || "No phone"}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <CalendarDays size={16} />
                              <span>
                                {item.createdAt
                                  ? new Date(item.createdAt).toLocaleDateString()
                                  : "Unknown"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <ImageIcon size={16} />
                              <span>
                                {item.mainPhoto || (item.photos && item.photos.length)
                                  ? "Images uploaded"
                                  : "No images"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">
              Businesses summary
            </h3>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-[#f8fafc] p-5">
                <p className="text-sm text-slate-500">Approved now</p>
                <p className="mt-2 text-4xl font-bold text-slate-900">
                  {filteredBusinesses.length}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8fafc] p-5">
                <p className="text-sm text-slate-500">Visibility rule</p>
                <p className="mt-3 text-sm leading-7 text-slate-700">
                  Only approved businesses should be discoverable by users and
                  available for booking.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">
              Management notes
            </h3>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>• Approved businesses are visible publicly</li>
              <li>• Keep category and city data consistent</li>
              <li>• Verify business details before future edits</li>
              <li>• Add filters for approved/rejected later</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}