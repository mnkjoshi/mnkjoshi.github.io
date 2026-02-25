import { useParams, Link } from "react-router-dom";
import { FiGithub, FiExternalLink, FiYoutube, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import PageWrapper from "../components/PageWrapper";
import StackTag from "../components/StackTag";
import Loader from "../components/Loader";
import { useDocument } from "../hooks/useFirestore";

export default function ProjectDetail() {
  const { id } = useParams();
  const { data: project, loading } = useDocument("projects", id);

  if (loading) return <Loader />;
  if (!project)
    return (
      <PageWrapper>
        <p className="text-text_muted text-center py-20">Project not found.</p>
      </PageWrapper>
    );

  return (
    <PageWrapper>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-text_muted/60 hover:text-cyber transition-colors text-xs font-fira mb-6"
      >
        <FiArrowLeft className="text-[10px]" /> Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Hero image */}
        {project.image && (
          <div className="relative aspect-[2/1] rounded-2xl overflow-hidden mb-8 border border-white/[0.04]">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent" />
          </div>
        )}

        <h1 className="font-fira text-2xl md:text-3xl font-bold mb-1">
          {project.title}
        </h1>
        <p className="text-text_muted/60 font-fira text-xs mb-5">{project.tagline}</p>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-cyber/90 text-obsidian px-4 py-2 rounded-lg font-fira text-xs font-semibold hover:bg-cyber transition-colors"
            >
              <FiExternalLink /> Live
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 border border-white/[0.1] text-text_muted px-4 py-2 rounded-lg font-fira text-xs hover:border-cyber/40 hover:text-cyber transition-colors"
            >
              <FiGithub /> Source
            </a>
          )}
          {project.yt && (
            <a
              href={project.yt}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 border border-white/[0.1] text-text_muted px-4 py-2 rounded-lg font-fira text-xs hover:border-cyber/40 hover:text-cyber transition-colors"
            >
              <FiYoutube /> Demo
            </a>
          )}
        </div>

        {/* Description */}
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="font-fira text-xs font-medium tracking-wider uppercase text-text_muted/50 mb-3">
            About
          </h2>
          <p className="text-text_muted/80 text-sm leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>

        {/* Tech stack */}
        {project.stack?.length > 0 && (
          <div>
            <h2 className="font-fira text-xs font-medium tracking-wider uppercase text-text_muted/50 mb-3">
              Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((s, i) => (
                <StackTag key={i} title={s.title} logo={s.logo} />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </PageWrapper>
  );
}
