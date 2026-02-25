import { motion } from "framer-motion";
import PageWrapper from "../components/PageWrapper";
import SectionHeading from "../components/SectionHeading";
import BlogCard from "../components/BlogCard";
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

export default function Blog() {
  const { data: blogs, loading } = useCollection("blogs", "date");

  return (
    <PageWrapper>
      <SectionHeading
        title="Blog"
        subtitle="Technical write-ups, tutorials, and thoughts"
      />

      {loading ? (
        <Loader />
      ) : blogs.length === 0 ? (
        <p className="text-text_muted text-center py-20">
          No posts yet. Check back soon!
        </p>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {blogs.map((b) => (
            <motion.div key={b.id} variants={item} className="h-full">
              <BlogCard blog={b} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </PageWrapper>
  );
}
