import { motion } from "framer-motion";
import { FiDownload, FiExternalLink, FiMapPin } from "react-icons/fi";
import PageWrapper from "../components/PageWrapper";
import SectionHeading from "../components/SectionHeading";
import Loader from "../components/Loader";
import { useCollection } from "../hooks/useFirestore";
import { resumeData } from "../data/dummy";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function TimelineEntry({ exp }) {
  const start = exp.startDate?.toDate
    ? exp.startDate.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      })
    : "";
  const end = exp.endDate?.toDate
    ? exp.endDate.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      })
    : "Present";

  return (
    <motion.div variants={fadeUp} className="relative mb-8 last:mb-0">
      {/* Timeline dot */}
      <span className="absolute -left-[21px] top-2 w-2.5 h-2.5 rounded-full bg-cyber/80 ring-[3px] ring-obsidian" />

      <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-start gap-3">
            {exp.logo && (
              <img
                src={exp.logo}
                alt={exp.company}
                className="w-9 h-9 rounded-lg object-contain border border-white/[0.06] bg-white/[0.03] shrink-0 mt-0.5"
              />
            )}
            <div>
              <h3 className="font-fira text-sm font-semibold text-text_primary">
                {exp.role}
              </h3>
              <p className="text-cyber/70 text-xs font-fira">{exp.company}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-text_muted/50 text-[11px] font-fira whitespace-nowrap">
              {start} — {end}
            </p>
            {exp.location && (
              <p className="text-text_muted/40 text-[10px] font-fira flex items-center justify-end gap-1 mt-0.5">
                <FiMapPin className="text-[9px]" /> {exp.location}
              </p>
            )}
          </div>
        </div>
        <ul className="space-y-1">
          {exp.descriptionPoints?.map((pt, i) => (
            <li
              key={i}
              className="text-text_muted/70 text-xs leading-relaxed flex gap-2"
            >
              <span className="text-cyber/50 mt-0.5 shrink-0">▹</span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>
        {exp.links?.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {exp.links.map((link, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-cyber/60 text-[11px] font-fira hover:text-cyber transition-colors"
              >
                <FiExternalLink size={10} /> {new URL(link).hostname}
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SkillCategory({ label, items }) {
  return (
    <div>
      <h3 className="font-fira text-[11px] font-medium tracking-wider uppercase text-text_muted/40 mb-2">
        {label}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {items.map((s) => (
          <span
            key={s}
            className="bg-white/[0.03] text-text_muted/70 text-[11px] font-fira rounded-md px-2.5 py-1 border border-white/[0.05] hover:border-cyber/30 hover:text-cyber transition-colors"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Resume() {
  const { data: experiences, loading: expLoading } = useCollection("experiences", "startDate");
  const { data: leadership, loading: leadLoading } = useCollection("leadership", "startDate");
  const loading = expLoading || leadLoading;

  const { education, skills } = resumeData;

  return (
    <PageWrapper>
      {/* PDF button */}
      <div className="flex justify-end mb-8">
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-cyber/90 text-obsidian px-4 py-2 rounded-lg font-fira text-xs font-semibold hover:bg-cyber transition-colors"
        >
          <FiDownload className="text-sm" /> PDF Resume
        </a>
      </div>

      {/* Education */}
      <section className="mb-10">
        <SectionHeading title="Education" />
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-fira text-sm font-semibold text-text_primary">
                {education.school}
              </h3>
              <p className="text-cyber/70 text-xs font-fira">{education.degree}</p>
            </div>
            <p className="text-text_muted/50 text-[11px] font-fira whitespace-nowrap shrink-0">
              {education.graduation}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {education.coursework.map((c) => (
              <span
                key={c}
                className="bg-white/[0.03] text-text_muted/60 text-[11px] font-fira rounded-md px-2 py-0.5 border border-white/[0.05]"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Experience */}
      <section className="mb-10">
        <SectionHeading title="Technical Experience" />
        {loading ? (
          <Loader />
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="relative pl-6 border-l border-white/[0.06]"
          >
            {experiences.map((exp) => (
              <TimelineEntry key={exp.id} exp={exp} />
            ))}
          </motion.div>
        )}
      </section>

      {/* Leadership */}
      <section className="mb-10">
        <SectionHeading title="Leadership" />
        {loading ? (
          <Loader />
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="relative pl-6 border-l border-white/[0.06]"
          >
            {leadership.map((exp) => (
              <TimelineEntry key={exp.id} exp={exp} />
            ))}
          </motion.div>
        )}
      </section>

      {/* Skills */}
      <section>
        <SectionHeading title="Technical Skills" />
        <div className="grid sm:grid-cols-2 gap-5">
          <SkillCategory label="Languages" items={skills.languages} />
          <SkillCategory label="Frameworks & Libraries" items={skills.frameworks} />
          <SkillCategory label="Developer Tools" items={skills.tools} />
          <SkillCategory label="APIs" items={skills.apis} />
        </div>
      </section>
    </PageWrapper>
  );
}
