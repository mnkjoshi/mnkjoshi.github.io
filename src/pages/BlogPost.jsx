import { useParams, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PageWrapper from "../components/PageWrapper";
import Loader from "../components/Loader";
import { useDocument } from "../hooks/useFirestore";

export default function BlogPost() {
  const { id } = useParams();
  const { data: post, loading } = useDocument("blogs", id);

  if (loading) return <Loader />;
  if (!post)
    return (
      <PageWrapper>
        <p className="text-text_muted text-center py-20">Post not found.</p>
      </PageWrapper>
    );

  const date = post.date?.toDate
    ? post.date.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <PageWrapper className="max-w-3xl">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-text_muted hover:text-cyber transition-colors text-sm font-fira mb-8"
      >
        <FiArrowLeft /> All Posts
      </Link>

      <article>
        <p className="text-text_muted text-sm font-fira mb-2">{date}</p>
        <h1 className="font-fira text-3xl md:text-4xl font-bold mb-4">
          {post.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags?.map((t, i) => (
            <span
              key={i}
              className="bg-slate-800 text-cyber rounded-full px-3 py-1 text-xs font-fira"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="prose-custom text-text_primary leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </PageWrapper>
  );
}
