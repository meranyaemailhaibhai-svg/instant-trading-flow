import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, MessageCircle, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-border/50">
      {/* WhatsApp CTA Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-b border-border/50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Trading?
            </h3>
            <p className="text-muted-foreground mb-6">
              Get your trading ID activated in minutes. Our automated system ensures instant onboarding with verified payments.
            </p>
            <a
              href="https://wa.me/919999999999?text=Hi%2C%20I%20want%20to%20create%20a%20new%20trading%20ID"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="whatsapp" size="xl" className="gap-3">
                <MessageCircle className="w-5 h-5" />
                Chat Now on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <span className="font-display font-bold text-xl">
                Trade<span className="text-primary">ID</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Automated trading ID creation system with instant onboarding, verified payments, and 24/7 support.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "About", "Pricing", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platforms */}
          <div>
            <h4 className="font-display font-semibold mb-4">Platforms</h4>
            <ul className="space-y-2">
              {["XYZ Options", "ABC Index", "Binex", "Quotex Pro", "Platform 5", "Platform 6"].map((platform) => (
                <li key={platform}>
                  <span className="text-muted-foreground text-sm">{platform}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span>WhatsApp Support</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 99999 99999</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@tradeid.com</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} TradeID. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
