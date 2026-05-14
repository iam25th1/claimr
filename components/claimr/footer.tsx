"use client";

export function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF2D7A] to-[#2D6EFF] rounded-lg" />
              <div className="absolute inset-[2px] bg-[#0a0a0a] rounded-[6px] flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">Claimr</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm text-[#a1a1aa]">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-[#71717a]">
            © 2026 Claimr. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
