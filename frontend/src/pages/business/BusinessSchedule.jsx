import React, { useState } from "react";
import { updateWorkingHours } from "../../services/businessScheduleService";

const initialSchedule = {
  monday: { isOpen: true, open: "09:00", close: "18:00" },
  tuesday: { isOpen: true, open: "09:00", close: "18:00" },
  wednesday: { isOpen: true, open: "09:00", close: "18:00" },
  thursday: { isOpen: true, open: "09:00", close: "18:00" },
  friday: { isOpen: true, open: "09:00", close: "18:00" },
  saturday: { isOpen: true, open: "09:00", close: "18:00" },
  sunday: { isOpen: false, open: "", close: "" },
};

const dayLabels = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export default function BusinessSchedule() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [saving, setSaving] = useState(false);

  const handleToggle = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen,
        open: !prev[day].isOpen ? prev[day].open || "09:00" : "",
        close: !prev[day].isOpen ? prev[day].close || "18:00" : "",
      },
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateWorkingHours(schedule);
      alert("Working schedule updated successfully");
    } catch (error) {
      console.error("Update schedule error:", error);
      alert("Failed to update working schedule");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm opacity-90">Schedule</p>
            <h2 className="mt-1 text-2xl font-bold">
              Set your working schedule
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-blue-100">
              Define your open days and working hours so customers can only book
              during your real availability.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Schedule"}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-4 md:px-6">
          <h3 className="text-lg font-semibold text-slate-800">
            Weekly Availability
          </h3>
          <p className="text-sm text-slate-500">
            Choose which days are open and set the start and end time for each day.
          </p>
        </div>

        <div className="p-4 md:p-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <div className="col-span-4">Day</div>
              <div className="col-span-3">Open Time</div>
              <div className="col-span-3">Close Time</div>
              <div className="col-span-2">Status</div>
            </div>

            {Object.keys(schedule).map((day) => {
              const item = schedule[day];

              return (
                <div
                  key={day}
                  className="grid grid-cols-12 items-center border-b border-slate-100 px-4 py-4 last:border-b-0"
                >
                  <div className="col-span-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {dayLabels[day]}
                    </p>
                  </div>

                  <div className="col-span-3">
                    <input
                      type="time"
                      value={item.open}
                      disabled={!item.isOpen}
                      onChange={(e) =>
                        handleTimeChange(day, "open", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <div className="col-span-3">
                    <input
                      type="time"
                      value={item.close}
                      disabled={!item.isOpen}
                      onChange={(e) =>
                        handleTimeChange(day, "close", e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  <div className="col-span-2 flex justify-start">
                    <button
                      onClick={() => handleToggle(day)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        item.isOpen
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {item.isOpen ? "Open" : "Closed"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Open Days</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-800">
            {Object.values(schedule).filter((day) => day.isOpen).length}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Closed Days</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-800">
            {Object.values(schedule).filter((day) => !day.isOpen).length}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Default Hours</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-800">
            09:00 - 18:00
          </h3>
        </div>
      </div>
    </div>
  );
}