import { MessageCircle, ListChecks, QrCode, Rocket } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    step: "01",
    title: "Chat on WhatsApp",
    description: "Start a conversation with our automated bot. Simply send 'New ID' or 'Create Account' to begin.",
    color: "text-[#25D366]",
    bgColor: "bg-[#25D366]/10",
  },
  {
    icon: ListChecks,
    step: "02",
    title: "Select Trading Platform",
    description: "Choose from our list of supported trading platforms. Reply with the platform number or name.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: QrCode,
    step: "03",
    title: "Pay with UPI QR",
    description: "Scan the UPI QR code to recharge your wallet. Minimum recharge ₹250 for instant activation.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Receive Your Trading ID",
    description: "Get your trading credentials via WhatsApp within minutes. Start trading immediately!",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block">
            Simple Process
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Get your trading ID in four simple steps. Our automated system handles everything for you.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="glass-card p-6 relative group hover:border-primary/30 transition-all duration-300"
            >
              {/* Step Number */}
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-border">
                <span className="text-xs font-bold text-primary">{step.step}</span>
              </div>

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl ${step.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className={`w-7 h-7 ${step.color}`} />
              </div>

              {/* Content */}
              <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>

              {/* Connector Line (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
