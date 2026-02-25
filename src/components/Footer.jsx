import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-slate_card py-8 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-center gap-4">
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/mnkjoshi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text_muted hover:text-cyber transition-colors"
            aria-label="GitHub"
          >
            <FiGithub size={20} />
          </a>
          <a
            href="https://linkedin.com/in/mnkjoshi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text_muted hover:text-cyber transition-colors"
            aria-label="LinkedIn"
          >
            <FiLinkedin size={20} />
          </a>
          <a
            href="mailto:manav@mnkjoshi.ca"
            className="text-text_muted hover:text-cyber transition-colors"
            aria-label="Email"
          >
            <FiMail size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
