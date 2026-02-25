import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiGithub, FiExternalLink, FiYoutube } from "react-icons/fi";
import StackTag from "./StackTag";

export default function ProjectCard({ project }) {
  return (
    <Link to={`/project/${project.id}`} className="block group h-full">
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-slate_card/50 rounded-2xl overflow-hidden border border-white/[0.04] hover:border-white/[0.1] transition-all duration-300 h-full flex flex-col"
      >
        {/* Image */}
        {project.image && (
          <div className="relative aspect-[16/9] overflow-hidden bg-obsidian">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate_card/80 via-transparent to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h3 className="font-fira text-base font-semibold text-text_primary group-hover:text-cyber transition-colors">
                {project.title}
              </h3>
              <p className="text-text_muted/70 text-xs mt-0.5 line-clamp-1">
                {project.tagline}
              </p>
            </div>
            {/* Tiny action icons */}
            <div className="flex items-center gap-2 shrink-0 pt-0.5">
              {project.github && (
                <FiGithub className="text-text_muted/40 text-sm" />
              )}
              {project.live && (
                <FiExternalLink className="text-text_muted/40 text-sm" />
              )}
              {project.yt && (
                <FiYoutube className="text-text_muted/40 text-sm" />
              )}
            </div>
          </div>

          {/* Stack pills */}
          <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
            {project.stack?.slice(0, 5).map((s, i) => (
              <StackTag key={i} title={s.title} logo={s.logo} />
            ))}
            {project.stack?.length > 5 && (
              <span className="text-text_muted/40 text-[11px] font-fira self-center ml-1">
                +{project.stack.length - 5}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
