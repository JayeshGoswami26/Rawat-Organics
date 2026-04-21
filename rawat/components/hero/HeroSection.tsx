import { MaterialSymbol } from "@/components/MaterialSymbol";
import { PillLink } from "@/components/ui/PillButton";

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-[85vh] w-full flex-col items-center justify-center bg-primary px-6 py-28 text-center sm:py-32"
      aria-label="Introduction"
    >
      <div className="pointer-events-none absolute top-1/4 left-8 opacity-25">
        <MaterialSymbol name="spa" className="text-6xl text-white" aria-hidden />
      </div>
      <div className="pointer-events-none absolute right-12 bottom-1/4 opacity-20 md:right-20">
        <MaterialSymbol name="eco" className="text-4xl text-white" aria-hidden />
      </div>

      <div className="relative z-10 max-w-4xl">
        <h1 className="font-headline text-4xl font-extrabold leading-[1.1] tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl">
          Pure. Natural. Organic.
        </h1>
        <p className="mx-auto mt-8 max-w-2xl font-body text-lg font-light leading-relaxed text-white/90 md:text-xl">
          Experience the heritage of soil. A botanical atelier dedicated to cultivating the essence of
          nature&apos;s most refined harvests.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <PillLink href="#contact" variant="gradient" size="lg" className="w-full sm:w-auto">
            Inquire Now
          </PillLink>
          <PillLink href="#story" variant="glass" size="lg" className="w-full sm:w-auto">
            Our Story
          </PillLink>
        </div>
      </div>
    </section>
  );
}
