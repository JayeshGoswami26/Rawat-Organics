import Image from "next/image";

export default function WholeSpices() {
  return (
    <main className="pt-24">
      {/* Hero Section */}
      <section className="relative h-[819px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Mixed Whole Spices" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW8iCEUQxYaAYZjJ_1A9dxMTXbQI1dLulsCsRvjJVgtV2f7sBX0Rp2SD-jop3V5MW7G3GCk-EqQu2cuiEoP_QjaVdN4wMSGvmgMBuQuDwwSO9VUUvHi10jZCLeDZxNK1GZEJ_-mKEudClVejGXj971qNhbJ7Z2EQaMuxiwJh7yOM8pFlkHIkgmwTowBHqv0rhp5zPxFKO0kPDArfCW-v3J0Fj-lusHkVSXF8w2Dq8levkvdNoPbNdvvBEKSiANZO1ojjOgLS5l1eSs"
          />
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-2xl bg-surface/90 backdrop-blur-sm p-12 md:p-16 rounded-xl shadow-2xl">
            <span className="text-secondary font-headline tracking-[0.2em] uppercase text-xs mb-4 block">The Botanical Atelier</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-primary font-headline font-extrabold leading-tight mb-6">
              Our Whole Spices: <br/>Nature&apos;s Unaltered Essence
            </h1>
            <p className="text-lg text-secondary max-w-lg mb-8 leading-relaxed">
              Hand-harvested and sun-dried, our whole spices retain their essential oils and vibrant aromatics. Experience purity in its most primal form.
            </p>
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-primary/20"></div>
              <span className="text-primary font-headline italic">Crafted for the Discerning Palate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl font-headline font-bold text-primary mb-4">The Collection</h2>
            <p className="text-secondary">Explore our curated selection of raw botanicals, sourced directly from regenerative estates where tradition meets the soil.</p>
          </div>
          <div className="flex items-center gap-4 bg-surface-container-low px-6 py-3 rounded-full">
            <span className="text-sm font-headline text-primary">Sort by:</span>
            <button className="text-sm font-bold text-primary flex items-center gap-1">Aromatic Intensity <span className="material-symbols-outlined text-sm">expand_more</span></button>
          </div>
        </div>

        {/* Bento-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Product Card 1: Peppercorns (Large) */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-xl overflow-hidden group">
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/2 overflow-hidden h-64 md:h-full">
                <img alt="Tellicherry Black Pepper" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6ziLvQI-i7m7HeO4nTAz-1UWMGx08xp68Rspgz6PQGSnw5gykWXLuCSL3ddNQcELquRAxGl8WLWu9B-1TZOG_QRJimXHvI4uMz8IFfTKktqnTMqvhB5kV8fJCF6X3rEXqf8HLASbptrDb2sYiuz8HwMUDuNpagBy1xTTCMePbqL7rWKSscQXgrwDchvUitlvwzfVd7uOKx5hEQD1aF5fRzYANsvzyPvC4euazStK9GV1xXPZ7ZooQPPqWmwlVf7YIgRjmvFlavjjm"/>
              </div>
              <div className="md:w-1/2 p-10 flex flex-col justify-center relative">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJz06S52XnHn0xVU0FPEYQqO4Df28N8XEhMGZTj6PFBgcnrmistKzw1IUo-HisW1ZX2F6znr7k_cvqLZJfMmfN30eaVSjK4MPtiSV5POg0j8a8GieZL78QvK3eHZqfZvgJtqyr9OvIPrQssvrrDIRnE-0FCsuOmqzYXruk2L2-H53mjmYiGiRuM236DeOhTb66-qiIbWf0vBLlj6mcSM9RKX1jn0DwlEz2NF_R5TgZn_UpbI2Tn7izu1rA7SKFqKXJgizhRlVo11ZH')" }}></div>
                <h3 className="text-2xl font-headline font-bold text-primary mb-2">Tellicherry Black Pepper</h3>
                <p className="text-secondary mb-6 italic">Aromatic, bold, and citrusy</p>
                <p className="text-on-surface-variant text-sm mb-8 leading-relaxed relative">
                  Sourced from the Malabar Coast, these late-harvest berries offer a complex heat and a refined, woody finish.
                </p>
                <button className="flex items-center gap-2 text-primary font-headline font-bold hover:gap-4 transition-all group-hover:text-secondary relative z-10 w-max">
                  View Details <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Card 2: Cinnamon (Tall) */}
          <div className="lg:col-span-5 bg-surface-container-high rounded-xl overflow-hidden group">
            <div className="h-80 overflow-hidden">
              <img alt="Ceylon Cinnamon Sticks" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQL1VZKSgH4DAo7ekPJZ4s9hsABP-67XWsAVFEC3tMcHLTwlF8tnPbtxr8oVEUmOOFh713VNVyDqL--FuwTft-odemnhcu8YbWAHT8pxZf_rwb_fHUhrseS-q--WfnBYQr1sGxK4hjLrcfDpTHvC3DNgUpLmRMiltceOE7aqwdbGoCfyVQIKWgxxqzvjddT507tWGaXAiLxSE1mJT943yFhhs6LJAbdNauLYg404t6acb9pHJjBTurqDGX_EWqHK7oa-UGSu5M8Ix6"/>
            </div>
            <div className="p-10 relative">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJz06S52XnHn0xVU0FPEYQqO4Df28N8XEhMGZTj6PFBgcnrmistKzw1IUo-HisW1ZX2F6znr7k_cvqLZJfMmfN30eaVSjK4MPtiSV5POg0j8a8GieZL78QvK3eHZqfZvgJtqyr9OvIPrQssvrrDIRnE-0FCsuOmqzYXruk2L2-H53mjmYiGiRuM236DeOhTb66-qiIbWf0vBLlj6mcSM9RKX1jn0DwlEz2NF_R5TgZn_UpbI2Tn7izu1rA7SKFqKXJgizhRlVo11ZH')" }}></div>
              <h3 className="text-2xl font-headline font-bold text-primary mb-2">Ceylon Cinnamon Sticks</h3>
              <p className="text-secondary mb-6 italic">Woody, sweet, and delicate</p>
              <button className="flex items-center gap-2 text-primary font-headline font-bold hover:gap-4 transition-all relative z-10 w-max">
                View Details <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Product Card 3: Cardamom */}
          <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl overflow-hidden group shadow-sm shadow-primary/5">
            <div className="h-64 overflow-hidden">
              <img alt="Green Cardamom Pods" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhLO3MOh5HhEpyGbaR1MbZclj8s12t4B_0_BSsW_rWOrLw3jg59A2aKM6tGN2dFLIdVvaUhRbn9705XTj7ZDFSEQwu9atbKtUyHQ-HZHgZb1ho_7u9lir8jwNexVCSMhY_MfpAKpI-potVDPe0HM7Z8hBse_aqmQ952PH93wCalhnfoHSg2cr_lfd_XL2iDHHZ9Xt6t4KQwh4WiQ5rtyeVjemMYNerpH6B6c4jCI7m18c1qT11u480ifjOUT_niUyxXGHfHPZ3z1fd"/>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-headline font-bold text-primary mb-2">Green Cardamom Pods</h3>
              <p className="text-secondary mb-6 italic">Floral, spicy, and camphoraceous</p>
              <button className="text-primary font-headline font-bold border-b border-primary/20 pb-1 hover:border-primary transition-all">
                View Details
              </button>
            </div>
          </div>

          {/* Product Card 4: Star Anise */}
          <div className="lg:col-span-8 bg-primary text-on-primary rounded-xl overflow-hidden group flex flex-col md:flex-row">
            <div className="md:w-1/2 p-12 flex flex-col justify-center">
              <span className="text-primary-fixed font-headline uppercase tracking-widest text-xs mb-4 block">Limited Harvest</span>
              <h3 className="text-3xl font-headline font-bold mb-4">Star Anise</h3>
              <p className="text-on-primary-container italic mb-6">Pungent, licorice-like, and warm</p>
              <p className="text-on-primary-container/80 text-sm mb-8 leading-relaxed">
                A culinary jewel, our Star Anise is dried naturally to preserve its symmetrical beauty and intense aromatic soul.
              </p>
              <button className="bg-surface text-primary px-8 py-3 rounded-full font-headline font-bold w-fit hover:scale-105 transition-transform">
                View Details
              </button>
            </div>
            <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
              <img alt="Star Anise" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1-ojoj8xtDiQ_ug5rOdVkKoW0dQ7eJ9lGPbKtZDoeryFupG8Tn8ZRFUIXn2ZSX-RWG1MFHvWeY2SNoI7Z3GV52dIsjomG6XGvVWlkbyv2H9TPqRD7FR2WlxrArQzCSeXIHGyRogGQeAmMuQZj0W7uTZ70cwQ_v3M3hdtfaPu8u2ThrE4rI188_fnymhBEoPMQbYUTncaEtGKIC_Ig0sm33IjstyoXW5LM74sq3ykbvimDXIr2wwFCXnifVip8jg-rIOgfJlneWrRa"/>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Quote Section */}
      <section className="bg-surface-container-high py-32 mt-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJz06S52XnHn0xVU0FPEYQqO4Df28N8XEhMGZTj6PFBgcnrmistKzw1IUo-HisW1ZX2F6znr7k_cvqLZJfMmfN30eaVSjK4MPtiSV5POg0j8a8GieZL78QvK3eHZqfZvgJtqyr9OvIPrQssvrrDIRnE-0FCsuOmqzYXruk2L2-H53mjmYiGiRuM236DeOhTb66-qiIbWf0vBLlj6mcSM9RKX1jn0DwlEz2NF_R5TgZn_UpbI2Tn7izu1rA7SKFqKXJgizhRlVo11ZH')" }}></div>
        <div className="max-w-4xl mx-auto text-center px-8 relative z-10">
          <span className="material-symbols-outlined text-6xl text-primary/10 mb-8" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
          <h2 className="text-3xl md:text-5xl font-headline italic text-primary leading-tight mb-8">
            &quot;The journey of a thousand flavors begins with a single, unaltered whole spice.&quot;
          </h2>
          <p className="font-headline tracking-widest uppercase text-sm text-secondary">— The Rawat Philosophy</p>
        </div>
      </section>
    </main>
  )
}
