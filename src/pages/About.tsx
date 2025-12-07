import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Shield, Users, Zap, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - TradeID | Automated Trading ID System</title>
        <meta name="description" content="Learn about TradeID's mission to simplify trading account creation with automated WhatsApp onboarding and instant ID activation." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-hero-glow" />
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <span className="text-primary font-medium text-sm uppercase tracking-wider mb-4 block">
                  About Us
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Revolutionizing <span className="gradient-text">Trading Onboarding</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We're on a mission to make trading accessible to everyone by eliminating the friction in account creation. Our automated WhatsApp-based system handles everything from platform selection to payment verification.
                </p>
              </div>
            </div>
          </section>

          {/* Who We Are */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                    Who We <span className="text-primary">Are</span>
                  </h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    TradeID is a technology-driven platform that automates the entire process of creating trading accounts. We partner with multiple trading platforms to provide instant account activation through a simple WhatsApp conversation.
                  </p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Our team combines expertise in fintech automation, payment processing, and customer service to deliver a seamless onboarding experience that operates 24/7.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="glass-card px-4 py-3">
                      <div className="text-2xl font-display font-bold text-primary">10K+</div>
                      <div className="text-sm text-muted-foreground">Active Users</div>
                    </div>
                    <div className="glass-card px-4 py-3">
                      <div className="text-2xl font-display font-bold text-primary">6+</div>
                      <div className="text-sm text-muted-foreground">Platforms</div>
                    </div>
                    <div className="glass-card px-4 py-3">
                      <div className="text-2xl font-display font-bold text-primary">99%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold mb-1">Secure & Verified</h3>
                        <p className="text-sm text-muted-foreground">All payments are verified through secure UPI transactions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold mb-1">Instant Processing</h3>
                        <p className="text-sm text-muted-foreground">Automated workflows process requests in minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold mb-1">Dedicated Support</h3>
                        <p className="text-sm text-muted-foreground">Expert team available to assist whenever needed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How Onboarding Works */}
          <section className="py-16 md:py-24 bg-gradient-to-b from-card/30 to-background">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  How <span className="text-primary">Onboarding</span> Works
                </h2>
                <p className="text-muted-foreground">
                  Our automated system guides you through every step of the process
                </p>
              </div>
              <div className="max-w-3xl mx-auto space-y-4">
                {[
                  "Send a message on WhatsApp to start the process",
                  "Select your preferred trading platform from the menu",
                  "Provide your name for account registration",
                  "Scan the UPI QR code and complete payment",
                  "Payment is automatically verified via webhook",
                  "Admin creates your trading credentials",
                  "Receive your login details on WhatsApp instantly"
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-4 glass-card p-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Automated Onboarding */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-6 text-center">
                      <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
                      <h3 className="font-display font-semibold mb-1">24/7 Availability</h3>
                      <p className="text-xs text-muted-foreground">Always online</p>
                    </div>
                    <div className="glass-card p-6 text-center">
                      <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                      <h3 className="font-display font-semibold mb-1">Secure Payments</h3>
                      <p className="text-xs text-muted-foreground">UPI verified</p>
                    </div>
                    <div className="glass-card p-6 text-center">
                      <Zap className="w-8 h-8 text-accent mx-auto mb-3" />
                      <h3 className="font-display font-semibold mb-1">Fast Processing</h3>
                      <p className="text-xs text-muted-foreground">Minutes, not days</p>
                    </div>
                    <div className="glass-card p-6 text-center">
                      <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                      <h3 className="font-display font-semibold mb-1">No Hassle</h3>
                      <p className="text-xs text-muted-foreground">Simple chat flow</p>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                    Why Automated Onboarding is <span className="text-primary">Safe</span>
                  </h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Our automated system eliminates human errors and ensures consistent, secure processing of every request. Payment verification happens through secure webhooks, and your data is protected at every step.
                  </p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    We never store sensitive payment information. All transactions are processed through UPI's secure infrastructure, and you receive instant confirmation for every action.
                  </p>
                  <a
                    href="https://wa.me/919999999999?text=Hi%2C%20I%20want%20to%20create%20a%20new%20trading%20ID"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="hero" size="lg" className="gap-2">
                      Get Started Now
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Response Time */}
          <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <Clock className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                  Lightning Fast <span className="text-primary">Response</span>
                </h2>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  Most trading IDs are activated within 5-15 minutes after payment confirmation. Our automated system ensures minimal wait time while our admin team handles credential creation promptly.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="glass-card p-6">
                    <div className="text-3xl font-display font-bold text-primary mb-1">{'<'}5 min</div>
                    <div className="text-sm text-muted-foreground">Bot Response</div>
                  </div>
                  <div className="glass-card p-6">
                    <div className="text-3xl font-display font-bold text-accent mb-1">Instant</div>
                    <div className="text-sm text-muted-foreground">Payment Verify</div>
                  </div>
                  <div className="glass-card p-6">
                    <div className="text-3xl font-display font-bold text-primary mb-1">{'<'}15 min</div>
                    <div className="text-sm text-muted-foreground">ID Activation</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default About;
