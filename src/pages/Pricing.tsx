import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageCircle, AlertCircle, Wallet, RefreshCcw, CreditCard } from "lucide-react";

const Pricing = () => {
  return (
    <>
      <Helmet>
        <title>Pricing - TradeID | Wallet Recharge & Activation Fees</title>
        <meta name="description" content="Simple, transparent pricing for trading ID activation. Minimum wallet recharge ₹250. Instant UPI payments with no hidden fees." />
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
                  Pricing
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  Simple & <span className="gradient-text">Transparent</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  No hidden fees, no surprises. Pay only for your trading wallet recharge and start trading immediately.
                </p>
              </div>
            </div>
          </section>

          {/* Main Pricing Card */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-lg mx-auto">
                <div className="glass-card p-8 relative overflow-hidden gradient-border">
                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                    INSTANT ACTIVATION
                  </div>

                  {/* Header */}
                  <div className="text-center mb-8">
                    <h2 className="font-display text-2xl font-bold mb-2">Wallet Recharge</h2>
                    <p className="text-muted-foreground text-sm">Start trading with minimum investment</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-muted-foreground text-lg">₹</span>
                      <span className="font-display text-6xl font-bold text-primary">250</span>
                    </div>
                    <p className="text-muted-foreground mt-2">Minimum Recharge</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {[
                      "Instant account activation",
                      "Full wallet balance for trading",
                      "No activation fees",
                      "Secure UPI payment",
                      "WhatsApp support included",
                      "24/7 automated processing"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <a
                    href="https://wa.me/919999999999?text=Hi%2C%20I%20want%20to%20create%20a%20new%20trading%20ID"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="whatsapp" size="xl" className="w-full gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Start on WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Info Sections */}
          <section className="py-16 bg-gradient-to-b from-card/30 to-background">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Minimum Wallet Recharge */}
                <div className="glass-card p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-3">Minimum Wallet Recharge</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    The minimum wallet recharge amount is ₹250. This amount goes directly into your trading wallet and is fully available for trading.
                  </p>
                  <div className="text-sm text-muted-foreground">
                    Higher recharges are welcome and recommended for active trading.
                  </div>
                </div>

                {/* Activation Fees */}
                <div className="glass-card p-6">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <CreditCard className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-3">Activation Fees</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    We do not charge any activation fees or service charges. Your entire recharge amount goes into your trading wallet.
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm text-primary font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Zero hidden charges
                  </div>
                </div>

                {/* Recharge System */}
                <div className="glass-card p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <RefreshCcw className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-3">Recharge System</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Add funds anytime through WhatsApp. Simply request a recharge, scan the QR code, and your wallet will be updated instantly upon payment verification.
                  </p>
                  <div className="text-sm text-muted-foreground">
                    UPI payments only. Instant verification.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Refund Policy */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className="glass-card p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-xl mb-2">Refund Policy</h3>
                      <p className="text-muted-foreground">
                        Please read our refund policy carefully before making a payment.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      <strong className="text-foreground">1. Pre-Activation Refunds:</strong> If your trading account is not created within 24 hours of payment confirmation, you may request a full refund.
                    </p>
                    <p>
                      <strong className="text-foreground">2. Post-Activation:</strong> Once your trading account is activated and credentials are shared, the wallet amount becomes part of your trading balance and cannot be refunded.
                    </p>
                    <p>
                      <strong className="text-foreground">3. Payment Issues:</strong> If there's a payment verification issue or transaction failure, our team will assist in resolving it within 24-48 hours.
                    </p>
                    <p>
                      <strong className="text-foreground">4. How to Request:</strong> Contact us via WhatsApp with your transaction details and payment proof for refund requests.
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">
                      For any payment-related queries, contact our support team immediately via WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Preview */}
          <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="font-display text-3xl font-bold mb-4">
                  Common <span className="text-primary">Questions</span>
                </h2>
              </div>

              <div className="max-w-3xl mx-auto space-y-4">
                {[
                  {
                    q: "What payment methods are accepted?",
                    a: "We accept UPI payments only. Scan the QR code provided and pay using any UPI app like GPay, PhonePe, or Paytm."
                  },
                  {
                    q: "How long does activation take?",
                    a: "Most accounts are activated within 5-15 minutes after payment verification. Maximum time is 24 hours."
                  },
                  {
                    q: "Can I recharge more than ₹250?",
                    a: "Yes, you can recharge any amount above ₹250. The entire amount goes to your trading wallet."
                  },
                  {
                    q: "Is there a maximum recharge limit?",
                    a: "There's no maximum limit. Contact us for high-value recharges for priority processing."
                  }
                ].map((faq, index) => (
                  <div key={index} className="glass-card p-6">
                    <h4 className="font-display font-semibold mb-2">{faq.q}</h4>
                    <p className="text-muted-foreground text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Pricing;
