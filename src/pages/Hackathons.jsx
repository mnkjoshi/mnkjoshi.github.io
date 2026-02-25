import { motion } from "framer-motion";
import PageWrapper from "../components/PageWrapper";
import SectionHeading from "../components/SectionHeading";
import HackathonCard from "../components/HackathonCard";
import Loader from "../components/Loader";
import { useCollection } from "../hooks/useFirestore";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Hackathons() {
  const { data: hackathons, loading } = useCollection("hackathons", "date");

  const won = hackathons.filter((h) => h.isWinner).length;
  const attended = hackathons.length;

  return (
    <PageWrapper>
      <SectionHeading
        title="Hackathons"
        subtitle="Competitions, CTFs, and build events I've participated in"
      />

      {/* Stats */}
      {!loading && attended > 0 && (
        <div className="flex items-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <span className="font-fira text-2xl font-bold text-cyber">{won}</span>
            <span className="text-text_muted text-sm font-fira">Won</span>
          </div>
          <div className="w-px h-6 bg-white/[0.08]" />
          <div className="flex items-center gap-2">
            <span className="font-fira text-2xl font-bold text-text_primary">{attended}</span>
            <span className="text-text_muted text-sm font-fira">Attended</span>
          </div>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : hackathons.length === 0 ? (
        <p className="text-text_muted text-center py-20">
          No hackathons posted yet. Check back soon!
        </p>
      ) : (
        <>
          {/* Featured hackathons pinned at top */}
          {hackathons.filter((h) => h.featured).length > 0 && (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid sm:grid-cols-2 gap-5"
            >
              {hackathons
                .filter((h) => h.featured)
                .map((h) => (
                  <motion.div key={h.id} variants={item} className="h-full">
                    <HackathonCard hackathon={h} />
                  </motion.div>
                ))}
            </motion.div>
          )}

          {/* Remaining hackathons */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {hackathons
              .filter((h) => !h.featured)
              .map((h) => (
                <motion.div key={h.id} variants={item} className="h-full">
                  <HackathonCard hackathon={h} />
                </motion.div>
              ))}
          </motion.div>
        </>
      )}
    </PageWrapper>
  );
}
