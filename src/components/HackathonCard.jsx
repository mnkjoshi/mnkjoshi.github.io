import { motion } from "framer-motion";
import { FiAward, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function HackathonCard({ hackathon }) {
  const isWinner = hackathon.isWinner;
  const isFeatured = hackathon.featured;
  const date = hackathon.date?.toDate
    ? hackathon.date.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      })
    : "";

  const Wrapper = hackathon.projectLink ? Link : "div";
  const wrapperProps = hackathon.projectLink
    ? { to: hackathon.projectLink, className: "block group h-full" }
    : { className: "block h-full" };

  return (
    <Wrapper {...wrapperProps}>
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`rounded-2xl p-6 flex flex-col gap-3 border transition-all duration-300 h-full ${
          isFeatured
            ? "bg-amber-500/[0.04] border-amber-400/25 hover:border-amber-400/50 shadow-[0_0_40px_-8px_rgba(245,158,11,0.15)]"
            : isWinner
            ? "bg-[#B000FF]/[0.04] border-[#B000FF]/20 hover:border-[#B000FF]/40 shadow-[0_0_30px_-8px_rgba(176,0,255,0.12)]"
            : "bg-slate_card/50 border-white/[0.04] hover:border-white/[0.1]"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-text_muted/50 text-xs font-fira">{date}</p>
            <h3 className="font-fira text-base font-semibold text-text_primary mt-1 group-hover:text-cyber transition-colors">
              {hackathon.name}
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0 mt-1">
            {hackathon.logo && (
              <img
                src={hackathon.logo}
                alt=""
                className="w-12 h-12 rounded-lg object-contain bg-white/[0.05] border border-white/[0.06] p-0.5"
              />
            )}
            {isFeatured && (
              <span className="flex items-center gap-1 bg-amber-400/10 text-amber-400 text-[10px] font-fira font-semibold px-2 py-0.5 rounded-full border border-amber-400/20">
                <FiStar className="text-[10px]" />
                Featured
              </span>
            )}
            {isWinner && <FiAward className={`text-lg ${isFeatured ? "text-amber-400/80" : "text-neon/70"}`} />}
          </div>
        </div>

        <span
          className={`text-sm font-fira font-medium ${
            isFeatured ? "text-amber-400/80" : isWinner ? "text-neon/80" : "text-cyber/70"
          }`}
        >
          {hackathon.placement}
        </span>

        <p className="text-text_muted/60 text-sm leading-relaxed line-clamp-3">
          {hackathon.description}
        </p>
      </motion.div>
    </Wrapper>
  );
}
