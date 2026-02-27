export default function LeadCard({ lead }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-green-500 transition">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-white">
          {lead.title}
        </h3>

        <span className={`px-2 py-1 text-xs rounded ${
          lead.score >= 80
            ? "bg-green-600"
            : lead.score >= 50
            ? "bg-yellow-600"
            : "bg-red-600"
        }`}>
          {lead.score}
        </span>
      </div>

      <p className="text-sm text-zinc-400 mt-2 line-clamp-3">
        {lead.content}
      </p>

      <div className="flex justify-between mt-4 text-xs text-zinc-500">
        <span>{lead.source}</span>
        <a
          href={lead.permalink}
          target="_blank"
          rel="noreferrer"
          className="text-green-400 hover:underline"
        >
          View Post →
        </a>
      </div>
    </div>
  );
}
