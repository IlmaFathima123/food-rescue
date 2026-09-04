export default function StatStrip({ stats }) {
  return (
    <dl className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-ink/10 border border-ink/10 bg-white">
      {stats.map((stat) => (
        <div key={stat.label} className="px-5 py-6 sm:px-6">
          <dt className="text-sm text-ink-soft">{stat.label}</dt>
          <dd className="mt-1 font-display text-3xl sm:text-4xl text-leaf-deep">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
