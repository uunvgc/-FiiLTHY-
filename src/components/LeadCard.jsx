
export default function LeadCard({ lead }) {
  const score = Number(lead?.score ?? 0);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-green-500 transition">
      <div className="flex justify-between items-start gap-3">
        <h3 className="text-lg font-semibold text-white">
          {lead?.title || "(no title)"}
        </h3>

        <span
          className={`px-2 py-1 text-xs rounded ${
            score >= 80 ? "bg-green-600" : score >= 50 ? "bg-yellow-600" : "bg-red-600"
          }`}
        >
          {score}
        </span>
      </div>

      {lead?.content ? (
        <p className="text-sm text-zinc-400 mt-2">
          {String(lead.content).slice(0, 280)}
          {String(lead.content).length > 280 ? "…" : ""}
        </p>
      ) : (
        <p className="text-sm text-zinc-500 mt-2">(no content)</p>
      )}

      <div className="flex justify-between mt-4 text-xs text-zinc-500">
        <span>{lead?.source || ""}</span>

        {lead?.permalink ? (
          <a
            href={lead.permalink}
            target="_blank"
            rel="noreferrer"
            className="text-green-400 hover:underline"
          >
            View Post →
          </a>
        ) : (
          <span className="text-zinc-600">No link</span>
        )}
      </div>
    </div>
  );
}
