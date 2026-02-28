<div className="stack" style={{ marginTop: 12 }}>
  {filtered.map((lead) => (
    <LeadCard
      key={
        lead.id ||
        lead.source_id ||
        lead.permalink ||
        `${lead.source}-${lead.author}-${lead.posted_at}`
      }
      lead={lead}
    />
  ))}
</div>
