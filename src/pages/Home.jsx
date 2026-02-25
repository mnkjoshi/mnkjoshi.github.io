import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GitHubCalendar } from "react-github-calendar";
import { FiGithub, FiLinkedin, FiArrowRight, FiCode, FiShield, FiCpu } from "react-icons/fi";
import PageWrapper from "../components/PageWrapper";
import SectionHeading from "../components/SectionHeading";
import ProjectCard from "../components/ProjectCard";
import HackathonCard from "../components/HackathonCard";
import BlogCard from "../components/BlogCard";
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

export default function Home() {
  const { data: projects, loading: pLoad } = useCollection("projects");
  const { data: hackathons, loading: hLoad } = useCollection("hackathons", "date");
  const { data: blogs, loading: bLoad } = useCollection("blogs", "date");

  const featured = projects.filter((p) => p.featured);

  return (
    <PageWrapper>
      {/* ── Ambient background ── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-cyber/[0.035] blur-[140px]" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-neon/[0.025] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(94,234,212,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,212,.25) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* ── Floating particle orbs (full page) ── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {[
          // Original 12
          { size: "w-2 h-2", color: "bg-cyber/30", x: "left-[10%]", y: "top-[20%]", dur: 18, delay: 0 },
          { size: "w-1.5 h-1.5", color: "bg-cyber/20", x: "left-[70%]", y: "top-[15%]", dur: 22, delay: 2 },
          { size: "w-3 h-3", color: "bg-neon/20", x: "left-[85%]", y: "top-[55%]", dur: 20, delay: 4 },
          { size: "w-1.5 h-1.5", color: "bg-cyber/25", x: "left-[40%]", y: "top-[70%]", dur: 16, delay: 1 },
          { size: "w-2 h-2", color: "bg-neon/20", x: "left-[25%]", y: "top-[85%]", dur: 24, delay: 3 },
          { size: "w-1.5 h-1.5", color: "bg-cyber/20", x: "left-[60%]", y: "top-[40%]", dur: 19, delay: 5 },
          { size: "w-2.5 h-2.5", color: "bg-cyber/25", x: "left-[50%]", y: "top-[10%]", dur: 21, delay: 1.5 },
          { size: "w-1 h-1", color: "bg-neon/25", x: "left-[90%]", y: "top-[30%]", dur: 17, delay: 3.5 },
          { size: "w-2 h-2", color: "bg-neon/15", x: "left-[5%]", y: "top-[50%]", dur: 23, delay: 6 },
          { size: "w-1.5 h-1.5", color: "bg-cyber/30", x: "left-[78%]", y: "top-[75%]", dur: 15, delay: 0.5 },
          { size: "w-3 h-3", color: "bg-cyber/15", x: "left-[30%]", y: "top-[35%]", dur: 25, delay: 7 },
          { size: "w-1 h-1", color: "bg-neon/20", x: "left-[55%]", y: "top-[90%]", dur: 18, delay: 2.5 },
          // Second set of 12
          { size: "w-1.5 h-1.5", color: "bg-cyber/20", x: "left-[15%]", y: "top-[8%]", dur: 20, delay: 1.2 },
          { size: "w-2 h-2", color: "bg-neon/25", x: "left-[33%]", y: "top-[52%]", dur: 17, delay: 4.5 },
          { size: "w-1 h-1", color: "bg-cyber/30", x: "left-[82%]", y: "top-[12%]", dur: 23, delay: 0.8 },
          { size: "w-2.5 h-2.5", color: "bg-neon/15", x: "left-[48%]", y: "top-[88%]", dur: 19, delay: 6.5 },
          { size: "w-1.5 h-1.5", color: "bg-cyber/25", x: "left-[3%]", y: "top-[65%]", dur: 21, delay: 2.8 },
          { size: "w-2 h-2", color: "bg-neon/20", x: "left-[65%]", y: "top-[28%]", dur: 16, delay: 5.5 },
          { size: "w-1 h-1", color: "bg-cyber/20", x: "left-[22%]", y: "top-[42%]", dur: 24, delay: 3.2 },
          { size: "w-3 h-3", color: "bg-cyber/15", x: "left-[92%]", y: "top-[68%]", dur: 18, delay: 7.5 },
          { size: "w-1.5 h-1.5", color: "bg-neon/25", x: "left-[57%]", y: "top-[5%]", dur: 22, delay: 1.8 },
          { size: "w-2 h-2", color: "bg-cyber/20", x: "left-[75%]", y: "top-[48%]", dur: 15, delay: 4.2 },
          { size: "w-1 h-1", color: "bg-neon/20", x: "left-[38%]", y: "top-[18%]", dur: 20, delay: 8 },
          { size: "w-2.5 h-2.5", color: "bg-cyber/25", x: "left-[12%]", y: "top-[92%]", dur: 17, delay: 0.3 },
          // Third set of 12
          { size: "w-2 h-2", color: "bg-neon/20", x: "left-[45%]", y: "top-[32%]", dur: 19, delay: 3.8 },
          { size: "w-1 h-1", color: "bg-cyber/30", x: "left-[88%]", y: "top-[82%]", dur: 22, delay: 6.2 },
          { size: "w-1.5 h-1.5", color: "bg-neon/25", x: "left-[8%]", y: "top-[38%]", dur: 16, delay: 1.5 },
          { size: "w-3 h-3", color: "bg-cyber/15", x: "left-[62%]", y: "top-[62%]", dur: 24, delay: 5.2 },
          { size: "w-2 h-2", color: "bg-cyber/25", x: "left-[28%]", y: "top-[78%]", dur: 18, delay: 8.5 },
          { size: "w-1.5 h-1.5", color: "bg-neon/15", x: "left-[95%]", y: "top-[45%]", dur: 21, delay: 2.2 },
          { size: "w-1 h-1", color: "bg-cyber/20", x: "left-[52%]", y: "top-[58%]", dur: 17, delay: 7.2 },
          { size: "w-2.5 h-2.5", color: "bg-neon/20", x: "left-[18%]", y: "top-[3%]", dur: 23, delay: 4.8 },
          { size: "w-2 h-2", color: "bg-cyber/30", x: "left-[72%]", y: "top-[92%]", dur: 15, delay: 0.6 },
          { size: "w-1.5 h-1.5", color: "bg-cyber/20", x: "left-[42%]", y: "top-[25%]", dur: 20, delay: 3.5 },
          { size: "w-1 h-1", color: "bg-neon/25", x: "left-[83%]", y: "top-[8%]", dur: 19, delay: 9 },
          { size: "w-2 h-2", color: "bg-cyber/15", x: "left-[2%]", y: "top-[82%]", dur: 25, delay: 5.8 },
        ].map((orb, i) => (
          <motion.div
            key={i}
            className={`absolute ${orb.size} ${orb.color} ${orb.x} ${orb.y} rounded-full blur-[1px]`}
            animate={{
              y: [0, -25, 8, -18, 0],
              x: [0, 14, -10, 16, 0],
              opacity: [0.5, 1, 0.6, 0.9, 0.5],
            }}
            transition={{
              duration: orb.dur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: orb.delay,
            }}
          />
        ))}
      </div>

      {/* ── Hero ── */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20 relative">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-fira text-cyber/80 text-xs mb-3 tracking-widest uppercase"
          >
            Hey, I&apos;m
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="font-fira text-3xl md:text-5xl font-bold mb-2 leading-tight"
          >
            Manav Joshi<span className="text-cyber">.</span>
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="font-fira text-lg md:text-xl text-text_muted/80 font-medium mb-5"
          >
            I build things for the web &amp; beyond.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text_muted/70 text-sm max-w-lg mb-7 leading-relaxed"
          >
            Engineering student passionate about building performant software,
            competing in hackathons, and exploring cybersecurity. Currently
            focused on full-stack development and systems research.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            className="flex items-center gap-3"
          >
            <a
              href="https://github.com/mnkjoshi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-white/[0.1] text-text_muted px-4 py-2 rounded-lg font-fira text-xs hover:border-cyber/40 hover:text-cyber transition-colors"
            >
              <FiGithub className="text-sm" /> GitHub
            </a>
            <a
              href="https://linkedin.com/in/mnkjoshi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-cyber/90 text-obsidian px-4 py-2 rounded-lg font-fira text-xs font-semibold hover:bg-cyber transition-colors"
            >
              <FiLinkedin className="text-sm" /> LinkedIn
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── What I Do ── */}
      <section className="pb-14">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-3 gap-4"
        >
          {[
            {
              icon: <FiCode className="text-cyber/70 text-base" />,
              label: "Full-Stack Dev",
              desc: "React, Node, Go — end-to-end product engineering.",
            },
            {
              icon: <FiShield className="text-cyber/70 text-base" />,
              label: "Cybersecurity",
              desc: "CTFs, reverse engineering, and penetration testing.",
            },
            {
              icon: <FiCpu className="text-cyber/70 text-base" />,
              label: "Systems Research",
              desc: "Low-latency consensus & distributed computing.",
            },
          ].map((c) => (
            <motion.div
              key={c.label}
              variants={fadeUp}
              className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.04] rounded-xl px-5 py-4 flex flex-col gap-1.5"
            >
              {c.icon}
              <h3 className="font-fira text-xs font-semibold text-text_primary">
                {c.label}
              </h3>
              <p className="text-text_muted/60 text-xs leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Projects ── */}
      <section className="py-10">
        <div className="flex items-end justify-between mb-1">
          <SectionHeading title="Projects" />
          <Link
            to="/projects"
            className="text-text_muted/50 text-xs font-fira flex items-center gap-1 hover:text-cyber transition-colors mb-6"
          >
            All <FiArrowRight className="text-[10px]" />
          </Link>
        </div>
        {pLoad ? (
          <Loader />
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-5"
          >
            {(featured.length ? featured : projects.slice(0, 6)).map((p) => (
              <motion.div key={p.id} variants={fadeUp} className="h-full">
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ── Hackathons ── */}
      <section className="py-10">
        <div className="flex items-end justify-between mb-1">
          <SectionHeading title="Hackathons" />
          <Link
            to="/hackathons"
            className="text-text_muted/50 text-xs font-fira flex items-center gap-1 hover:text-cyber transition-colors mb-6"
          >
            All <FiArrowRight className="text-[10px]" />
          </Link>
        </div>
        {hLoad ? (
          <Loader />
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {hackathons.slice(0, 6).map((h) => (
              <motion.div key={h.id} variants={fadeUp} className="h-full">
                <HackathonCard hackathon={h} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ── GitHub Activity ── */}
      <section className="py-10">
        <SectionHeading title="GitHub" />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.04] rounded-2xl p-5 flex justify-center overflow-x-auto"
        >
          <GitHubCalendar
            username="mnkjoshi"
            colorScheme="dark"
            blockSize={11}
            blockMargin={4}
            fontSize={12}
            theme={{
              dark: ["#1A202C", "#134e4a", "#0d9488", "#5eead4", "#a7f3d0"],
            }}
          />
        </motion.div>
      </section>

      {/* ── Blog ── */}
      <section className="py-10">
        <div className="flex items-end justify-between mb-1">
          <SectionHeading title="Blog" />
          <Link
            to="/blog"
            className="text-text_muted/50 text-xs font-fira flex items-center gap-1 hover:text-cyber transition-colors mb-6"
          >
            All <FiArrowRight className="text-[10px]" />
          </Link>
        </div>
        {bLoad ? (
          <Loader />
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {blogs.slice(0, 3).map((b) => (
              <motion.div key={b.id} variants={fadeUp} className="h-full">
                <BlogCard blog={b} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </PageWrapper>
  );
}
