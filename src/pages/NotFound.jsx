import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

export default function NotFound() {
  return (
    <PageWrapper className="text-center py-32">
      <h1 className="font-fira text-6xl font-bold text-cyber mb-4">404</h1>
      <p className="text-text_muted mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-cyber text-obsidian px-6 py-3 rounded-lg font-fira text-sm font-semibold hover:bg-cyber/90 transition-colors"
      >
        Go Home
      </Link>
    </PageWrapper>
  );
}
