import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function BlogCard({ blog }) {
  const date = blog.date?.toDate
    ? blog.date.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <Link to={`/blog/${blog.id}`} className="block group h-full">
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-slate_card/50 rounded-2xl p-5 flex flex-col gap-2 border border-white/[0.04] hover:border-white/[0.1] transition-all duration-300 h-full"
      >
        <p className="text-text_muted/50 text-[11px] font-fira">{date}</p>
        <h3 className="font-fira text-sm font-semibold text-text_primary group-hover:text-cyber transition-colors">
          {blog.title}
        </h3>

        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {blog.tags?.map((t, i) => (
            <span
              key={i}
              className="bg-white/[0.04] text-text_muted/60 rounded-md px-2 py-0.5 text-[11px] font-fira border border-white/[0.06]"
            >
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </Link>
  );
}
