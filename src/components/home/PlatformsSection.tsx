import { TrendingUp, BarChart3, Wallet, LineChart, PieChart, CandlestickChart } from "lucide-react";

const platforms = [
  { name: "XYZ Options", icon: TrendingUp, description: "Binary options trading" },
  { name: "ABC Index", icon: BarChart3, description: "Index trading platform" },
  { name: "Binex", icon: CandlestickChart, description: "Crypto & forex trading" },
  { name: "Quotex Pro", icon: LineChart, description: "Professional trading" },
  { name: "Platform 5", icon: Wallet, description: "Multi-asset trading" },
  { name: "Platform 6", icon: PieChart, description: "Social trading" },
];

const PlatformsSection = () => {
  return (
    <section className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block">
            Trading Platforms
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Supported <span className="gradient-text">Platforms</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose from our list of trusted trading platforms. We support all major platforms for instant account activation.
          </p>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform, index) => (
            <div
              key={index}
              className="glass-card p-6 group hover:border-primary/50 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <platform.icon className="w-6 h-6 text-primary" />
                </div>
                
                {/* Content */}
                <div>
                  <h3 className="font-display font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    {platform.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">{platform.description}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Instant Activation</span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Available
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformsSection;
