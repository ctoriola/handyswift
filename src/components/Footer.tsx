import { Separator } from "./ui/separator";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

// Custom X (Twitter) icon component
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

export function Footer() {
  const quickLinks = [
    { label: "About Us", href: "#" },
    { label: "Services", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" }
  ];

  const legal = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Help Center", href: "#" }
  ];

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <h3 className="text-2xl" style={{color: '#4ade80'}}>HandySwift</h3>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Swift solutions for everyday needs. Connecting you with trusted professionals across Nigeria.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-3">
              <a 
                href="https://www.instagram.com/handyswift?igsh=MW9nNzY0Z3B4cmduNw==" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/handyswiftng?s=21" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-primary/90 transition-all duration-300 hover:scale-110"
              >
                <XIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-slate-400 hover:text-secondary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-secondary group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg mb-6">Legal</h4>
            <ul className="space-y-3">
              {legal.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-slate-400 hover:text-secondary transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-secondary group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <a href="mailto:handyswiftng@outlook.com" className="hover:text-secondary transition-colors">
                  handyswiftng@outlook.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <a href="tel:+2341234567890" className="hover:text-secondary transition-colors">
                  +234 123 456 7890
                </a>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span>Abuja, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-slate-800 mb-8" />
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2025 HandySwift. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm italic">
            "Swift solutions for everyday needs."
          </p>
        </div>
      </div>
    </footer>
  );
}
