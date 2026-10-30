import React from 'react';
import { Camera, ClipboardCheck, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Add your room',
      description: 'Upload a quick smartphone photo of your rental living room, kitchen, bedroom, or bathroom. No tidy-up needed.',
      icon: Camera,
    },
    {
      number: '02',
      title: 'Set your rules',
      description: 'Select your preferred aesthetic and lease-safe presets—peel-and-stick cabinet wraps, tension rods, or zero-drill lighting.',
      icon: ClipboardCheck,
    },
    {
      number: '03',
      title: 'Get your plan',
      description: 'See a photorealistic Before/After redesign adhering 100% to your lease, with a curated damage-free shopping list.',
      icon: Sparkles,
    },
  ];

  return (
    <section id="how-it-works" className="w-full py-16 sm:py-24 bg-[#F0ECE1]/50 dark:bg-[#1E1814] text-[#4A3B32] dark:text-[#FAF8F5] border-b border-[#E8E2D8] dark:border-[#3A3029] transition-colors" style={{ contentVisibility: 'auto' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-widest text-[#C69C6D] font-semibold">
            Simple 3-Step Process
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#4A3B32] dark:text-[#FAF8F5] mt-2">
            How Eden Canvas Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#7C7267] dark:text-[#B8B2A6]">
            Transforming a rental shouldn’t mean risking your security deposit. Here’s how we protect your lease.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-[#FAF8F5] dark:bg-[#251E19] border border-[#E8E2D8] dark:border-[#3A3029] rounded-3xl p-7 sm:p-8 flex flex-col justify-between shadow-2xs hover:border-[#C69C6D]/60 dark:hover:border-[#C69C6D]/60 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-semibold text-[#C69C6D] px-2.5 py-1 rounded-full bg-[#F0ECE1] dark:bg-[#1B1613]">
                      Step {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-[#F0ECE1] dark:bg-[#1B1613] text-[#4A3B32] dark:text-[#C69C6D] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#4A3B32] dark:text-[#FAF8F5] mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#7C7267] dark:text-[#B8B2A6] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
