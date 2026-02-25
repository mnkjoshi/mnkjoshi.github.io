import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX, FiSettings } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/hackathons", label: "Hackathons" },
  { to: "/blog", label: "Blog" },
  { to: "/resume", label: "Resume" },
];

const activeCls = "text-cyber";
const inactiveCls = "text-text_muted hover:text-cyber transition-colors";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-obsidian/80 backdrop-blur-md border-b border-slate_card">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <NavLink to="/" className="font-fira text-xl font-bold text-cyber tracking-tight">
          {"<MJ />"}
        </NavLink>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 font-fira text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) => (isActive ? activeCls : inactiveCls)}
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `${isActive ? "text-cyber" : "text-text_muted/40 hover:text-text_muted"} transition-colors`
            }
            title="Admin"
          >
            <FiSettings className="text-sm" />
          </NavLink>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-text_primary text-2xl"
          aria-label="Toggle menu"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-obsidian border-b border-slate_card"
          >
            <div className="flex flex-col items-center gap-4 py-6 font-fira text-sm">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => (isActive ? activeCls : inactiveCls)}
                >
                  {l.label}
                </NavLink>
              ))}
              <NavLink
                to="/admin"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${isActive ? "text-cyber" : "text-text_muted/40 hover:text-text_muted"} transition-colors`
                }
              >
                <FiSettings className="text-sm" />
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
