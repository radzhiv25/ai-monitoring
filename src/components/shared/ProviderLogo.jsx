import { useState } from "react";

const brand = {
  OpenAI: ["openai", "412991"],
  Anthropic: ["anthropic", "D97757"],
  Google: ["google", "4285F4"],
  Microsoft: ["microsoft", "5E5E5E"],
  GitHub: ["githubcopilot", "24292F"],
  Midjourney: ["midjourney", "5865F2"],
  Perplexity: ["perplexity", "1FB8CD"],
  Cursor: ["cursor", "24292F"],
  Notion: ["notion", "171717"],
  Runway: ["runway", "171717"],
};

/** Uses Simple Icons' brand SVGs when available, with a readable initials fallback. */
export default function ProviderLogo({ provider, className = "" }) {
  const [failed, setFailed] = useState(false);
  const [slug, color] = brand[provider] ?? [];
  return <span className={`provider-logo ${className}`} role="img" aria-label={`${provider} logo`}>
    {slug && !failed ? <img src={`https://cdn.simpleicons.org/${slug}/${color}`} alt="" loading="lazy" onError={() => setFailed(true)} /> : <span aria-hidden="true">{provider?.slice(0, 1) ?? "AI"}</span>}
  </span>;
}
