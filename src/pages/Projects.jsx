import { motion } from "framer-motion";
import PageWrapper from "../components/PageWrapper";
import SectionHeading from "../components/SectionHeading";
import ProjectCard from "../components/ProjectCard";
import Loader from "../components/Loader";
import { useCollection } from "../hooks/useFirestore";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Projects() {
  const { data: projects, loading } = useCollection("projects");

  return (
    <PageWrapper>
      <SectionHeading title="Projects" />

      {loading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <p className="text-text_muted text-center py-20">
          No projects yet. Check back soon!
        </p>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 gap-5"
        >
          {projects.map((p) => (
            <motion.div key={p.id} variants={fadeUp} className="h-full">
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </PageWrapper>
  );
}
