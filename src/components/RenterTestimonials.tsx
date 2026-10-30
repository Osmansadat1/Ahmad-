import React from 'react';
import { Star } from 'lucide-react';

export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  tag: string;
  feedback: string;
}

export const RENTER_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'elena-s',
    name: 'Elena S.',
    location: 'Brooklyn, NY',
    tag: 'Deposit 100% Returned',
    feedback:
      'Turned an eccentric pre-war studio with uneven rental plaster into an intentional Japandi haven without putting a single nail in the wall.',
  },
  {
    id: 'marcus-t',
    name: 'Marcus T.',
    location: 'Austin, TX',
    tag: 'Cabinet Wrap',
    feedback:
      'The tension rod drapery and peel-and-stick countertop suggestions transformed my 90s builder-grade rental kitchen in one weekend.',
  },
  {
    id: 'chloe-w',
    name: 'Chloe W.',
    location: 'Seattle, WA',
    tag: 'Zero Wall Holes',
    feedback:
      'I was terrified of losing my $2,400 security deposit. Eden Canvas showed me how to use ambient layered lighting and removable art instead of repainting.',
  },
  {
    id: 'julian-m',
    name: 'Julian M.',
    location: 'Chicago, IL',
    tag: 'Deposit 100% Returned',
    feedback:
      'Kept our heavy vintage dining table while redesigning the rest of the loft around it. Practical, beautiful, and 100% lease-compliant.',
  },
  {
    id: 'hannah-k',
    name: 'Hannah K.',
    location: 'Denver, CO',
    tag: 'Zero Wall Holes',
    feedback:
      'Every design tool wanted me to tear down drywall or hardwire sconces. Eden gave me rechargeable brass sconces and damage-free mounts.',
  },
  {
    id: 'liam-d',
    name: 'Liam D.',
    location: 'Portland, OR',
    tag: 'Cabinet Wrap',
    feedback:
      'Finally, interior design for real renters. Walked out of my move-out inspection with my entire security deposit returned in full.',
  },
];

interface RenterTestimonialsProps {
  onCtaClick?: () => void;
}

export const RenterTestimonials: React.FC<RenterTestimonialsProps> = ({ onCtaClick }) => {
  return (
    <section
      id="renter-stories"
      aria-label="Renter feedback and quiet luxury stories"
      className="py-16 sm:py-24 bg-[#FAF8F5] dark:bg-[#1B1613] border-b border-[#E8E2D8] dark:border-[#3A3029] transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-[#7C7267] dark:text-[#B8B2A6] text-center mb-2 font-semibold">
            Quiet Luxury For Real Rentals
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#4A3B32] dark:text-[#FAF8F5] text-center tracking-tight">
            Loved by 250,000+ Mindful Renters
          </h2>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#7C7267] dark:text-[#B8B2A6]">
            <div className="flex items-center text-[#C69C6D]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#C69C6D] text-[#C69C6D]" />
              ))}
            </div>
            <span className="font-medium text-[#4A3B32] dark:text-[#FAF8F5]">4.9 / 5</span>
            <span className="text-[#A2978A]">·</span>
            <span>Zero lease violations reported</span>
          </div>
        </div>

        {/* 3x2 Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RENTER_TESTIMONIALS.map((item) => (
            <article
              key={item.id}
              className="bg-white dark:bg-[#251E19] border border-[#E8E2D8] dark:border-[#3A3029] rounded-2xl p-7 flex flex-col justify-between hover:border-[#C69C6D]/80 transition-colors duration-300 shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1 text-[#C69C6D]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#C69C6D] text-[#C69C6D]" />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#6E7864]/10 dark:bg-[#6E7864]/20 text-[#6E7864] dark:text-[#8B9680] border border-[#6E7864]/20">
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#5C4C41] dark:text-[#D5CFC7] leading-relaxed italic">
                  "{item.feedback}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E8E2D8]/60 dark:border-[#3A3029] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#4A3B32] dark:text-[#FAF8F5]">
                  {item.name}
                </span>
                <span className="text-[#7C7267] dark:text-[#B8B2A6]">
                  {item.location}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
