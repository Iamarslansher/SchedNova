import { Github, Linkedin, MessageCircle } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
              Product
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Security
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
              Resources
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
              Legal
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
              Connect
            </h3>
            <div className="mt-4 flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">
              &copy; {currentYear} SchedNova. All rights reserved.
            </p>
            <p className="text-sm text-slate-500">
              Developed with <span className="text-red-500">❤</span> by{" "}
              <span className="font-semibold text-slate-300">
                Dev Arsalan Sher
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
