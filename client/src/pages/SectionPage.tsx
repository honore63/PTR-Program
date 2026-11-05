import { Redirect } from "wouter";

type SectionPageProps = { path: string; language?: string };

/**
 * Legacy section routes kept as permanent aliases after the site structure
 * changed. They point visitors to the equivalent page in the new navigation.
 */
export default function SectionPage({ path }: SectionPageProps) {
  if (path === "/activities") return <Redirect to="/news" />;
  if (path === "/practices") return <Redirect to="/resources" />;
  return <Redirect to="/" />;
}
