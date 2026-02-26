import { LoginButton } from "@/components/LoginButton";
import { Activity, Globe, Zap } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-brand selection:text-black overflow-hidden flex flex-col">
      {/* Top Nav / Header */}
      <header className="w-full border-b border-white/20 p-6 flex justify-between items-center relative z-20 bg-black">
        <div className="flex items-center gap-3 font-mono text-brand font-bold text-xl uppercase tracking-wider">
          <Logo className="w-8 h-8" />
          <span>MetricDeck</span>
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-white/50 hidden sm:block">
          v2.0.4 // System Online
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center px-6 py-12 md:py-24 relative">
        {/* Abstract Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="flex flex-col items-start">
            <div className="inline-block border border-brand text-brand font-mono text-sm px-3 py-1 mb-8 uppercase tracking-widest bg-brand/10 shadow-[0_0_15px_rgba(255,79,0,0.3)]">
              Warning: High Performance Analytics
            </div>
            
            <h1 className="text-[14vw] md:text-[9vw] font-black leading-[0.85] tracking-tighter uppercase mb-8">
              Data <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-[#ff8c00]">Without</span> <br />
              The Noise.
            </h1>
            
            <p className="text-xl md:text-2xl font-mono text-white/60 max-w-2xl mb-12 border-l-4 border-brand pl-6">
              A hyper-minimal, high-contrast GA4 operator dashboard. 
              Monitor all your properties at a glance. No fluff. Just metrics.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <LoginButton />
              <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
                [ Demo Mode Active ]
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Marquee / Ticker */}
      <div className="border-y border-white/20 bg-brand text-black overflow-hidden py-4 relative z-20 shadow-[0_0_30px_rgba(255,79,0,0.2)]">
        <div className="flex whitespace-nowrap animate-marquee font-mono font-bold uppercase tracking-widest text-sm md:text-base">
          <span className="mx-4">• Real-time GA4 Sync</span>
          <span className="mx-4">• Multi-property views</span>
          <span className="mx-4">• Zero configuration</span>
          <span className="mx-4">• High contrast mode</span>
          <span className="mx-4">• Real-time GA4 Sync</span>
          <span className="mx-4">• Multi-property views</span>
          <span className="mx-4">• Zero configuration</span>
          <span className="mx-4">• High contrast mode</span>
          <span className="mx-4">• Real-time GA4 Sync</span>
          <span className="mx-4">• Multi-property views</span>
          <span className="mx-4">• Zero configuration</span>
          <span className="mx-4">• High contrast mode</span>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 relative z-20 bg-black">
        {[
          { icon: Globe, title: "Multi-Site", desc: "Monitor all properties in one unified view." },
          { icon: Activity, title: "Raw Metrics", desc: "Users, Sessions, Views, Bounce Rate." },
          { icon: Zap, title: "Fast AF", desc: "Server-side fetching & smart caching." }
        ].map((feature, i) => (
          <div key={i} className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/20 last:border-r-0 hover:bg-white/5 transition-colors group">
            <feature.icon className="w-12 h-12 text-brand mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" />
            <h3 className="font-mono text-2xl md:text-3xl font-bold uppercase mb-4">{feature.title}</h3>
            <p className="text-white/60 text-lg font-mono">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
