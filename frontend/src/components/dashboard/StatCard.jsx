export default function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-3 text-3xl font-bold text-slate-900">{value}</h3>
          {subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}
        </div>

        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
            <Icon className="text-blue-600" size={22} />
          </div>
        )}
      </div>
    </div>
  );
}