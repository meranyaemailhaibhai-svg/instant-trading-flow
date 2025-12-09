import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Phone, Mail, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const faqs = [
  {
    q: "How do I create a new trading ID?",
    a: "Simply click on 'Start on WhatsApp' button and send us a message. Our automated system will guide you through platform selection, name collection, and payment process."
  },
  {
    q: "What is the minimum wallet recharge amount?",
    a: "The minimum wallet recharge amount is ₹250. This amount goes directly into your trading wallet and is fully available for trading."
  },
  {
    q: "How long does it take to receive my trading ID?",
    a: "Most trading IDs are activated within 5-15 minutes after payment verification. Maximum processing time is 24 hours."
  },
  {
    q: "Which trading platforms do you support?",
    a: "We support XYZ Options, ABC Index, Binex, Quotex Pro, and several other platforms. Check our home page for the complete list."
  },
  {
    q: "Is my payment secure?",
    a: "Yes, all payments are processed through UPI's secure infrastructure. We use webhook-based verification and never store your payment details."
  },
  {
    q: "Can I request a refund?",
    a: "Refunds are available only if your account is not created within 24 hours of payment. Once credentials are shared, the amount becomes part of your trading wallet."
  },
  {
    q: "How can I add more funds to my wallet?",
    a: "Simply message us on WhatsApp requesting a recharge. We'll send you a QR code, and your wallet will be updated instantly after payment verification."
  },
  {
    q: "What if I face issues with my trading account?",
    a: "Contact us immediately via WhatsApp. Our support team is available to help resolve any issues with your trading account or credentials."
  }
];

const Contact = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("contact_submissions")
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        });

      if (error) {
        console.error("Error submitting form:", error);
        toast.error("Failed to send message. Please try again.");
      } else {
        toast.success("Message sent! We'll get back to you within 24 hours.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - TradeID | 24/7 WhatsApp Support</title>
        <meta name="description" content="Get in touch with TradeID support. WhatsApp available 24/7 for trading ID creation, wallet recharge, and technical assistance." />
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
                  Contact Us
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  We're Here to <span className="gradient-text">Help</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Have questions? Need support? Reach out to us anytime. Our team is available 24/7 on WhatsApp.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Methods */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-6 text-center group hover:border-[#25D366]/50 transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#25D366]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#25D366]/20 transition-colors">
                    <MessageCircle className="w-7 h-7 text-[#25D366]" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">WhatsApp</h3>
                  <p className="text-muted-foreground text-sm mb-3">Fastest way to reach us</p>
                  <span className="text-primary text-sm font-medium">Chat Now →</span>
                </a>

                {/* Phone */}
                <a
                  href="tel:+919999999999"
                  className="glass-card p-6 text-center group hover:border-primary/50 transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <Phone className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">Phone</h3>
                  <p className="text-muted-foreground text-sm mb-3">+91 99999 99999</p>
                  <span className="text-primary text-sm font-medium">Call Now →</span>
                </a>

                {/* Email */}
                <a
                  href="mailto:support@tradeid.com"
                  className="glass-card p-6 text-center group hover:border-accent/50 transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                    <Mail className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">Email</h3>
                  <p className="text-muted-foreground text-sm mb-3">support@tradeid.com</p>
                  <span className="text-primary text-sm font-medium">Send Email →</span>
                </a>
              </div>

              {/* Response Time */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Average response time: Under 5 minutes on WhatsApp</span>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section className="py-16 bg-gradient-to-b from-card/30 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                    Send Us a Message
                  </h2>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Name</label>
                      <Input
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea
                      placeholder="Tell us more about your query..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Frequently Asked <span className="text-primary">Questions</span>
                </h2>
                <p className="text-muted-foreground">
                  Find answers to common questions about our trading ID creation system.
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="glass-card overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full p-6 flex items-center justify-between text-left hover:bg-foreground/5 transition-colors"
                    >
                      <h4 className="font-display font-semibold pr-4">{faq.q}</h4>
                      {openFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="px-6 pb-6">
                        <p className="text-muted-foreground">{faq.a}</p>
                      </div>
                    )}
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

export default Contact;
