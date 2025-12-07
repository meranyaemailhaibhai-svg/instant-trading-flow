import { Zap, Shield, Bell, Clock, CheckCircle, HeadphonesIcon } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Instant Onboarding",
    description: "Get started within minutes. Our automated system processes your request immediately without any delays.",
  },
  {
    icon: Shield,
    title: "Verified Payments",
    description: "Secure UPI payment verification with automatic transaction matching and instant confirmation.",
  },
  {
    icon: Bell,
    title: "Auto Notifications",
    description: "Receive real-time updates on WhatsApp for every step - from payment to account activation.",
  },
  {
    icon: Clock,
    title: "24/7 System",
    description: "Our automated onboarding system works round the clock, so you can start trading anytime.",
  },
  {
    icon: CheckCircle,
    title: "No Manual Wait",
    description: "Fully automated workflow means no waiting for manual verification or approval processes.",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description: "Get help whenever you need it with our dedicated support team available on WhatsApp.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block">
            Why Choose Us
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Benefits of Our <span className="gradient-text">System</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Experience the fastest, most secure way to get your trading ID activated.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative"
            >
              <div className="glass-card p-8 h-full hover:border-primary/30 transition-all duration-300">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-display font-semibold text-xl mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
