import { useState } from "react";

const brand = {
  Anthropic: ["anthropic", "D97757"],
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

/** Uses the ChatGPT mark for OpenAI and Simple Icons for other providers, with an initials fallback. */
export default function ProviderLogo({ provider, className = "" }) {
  const [failed, setFailed] = useState(false);
  const [slug, color] = brand[provider] ?? [];
  const logoUrl = provider === "OpenAI"
    ? "https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg"
    : slug ? `https://cdn.simpleicons.org/${slug}/${color}` : null;
  return <span className={`provider-logo ${className}`} role="img" aria-label={`${provider === "OpenAI" ? "ChatGPT" : provider} logo`}>
    {logoUrl && !failed ? <img src={logoUrl} alt="" loading="lazy" onError={() => setFailed(true)} /> : <span aria-hidden="true">{provider?.slice(0, 1) ?? "AI"}</span>}
  </span>;
}
