import { Shield, TrendingUp, AlertTriangle, CheckCircle2, Lock, Zap } from "lucide-react";

export function SafetyTips() {
  const tips = [
    {
      icon: Shield,
      title: "Stay Safe from Scammers",
      description: "Always verify provider credentials and reviews before booking. Never pay upfront for services, and never share sensitive personal information.",
      tips: [
        "Check provider verification badges",
        "Read reviews from other users",
        "Never share sensitive personal information",
        "Use in-app messaging for all communications"
      ]
    },
    {
      icon: TrendingUp,
      title: "Boost Your Productivity",
      description: "HandySwift saves you time by connecting you with the right professionals quickly. Focus on what matters while we handle the heavy lifting.",
      tips: [
        "Post jobs in under 5 minutes",
        "Receive multiple offers to compare",
        "Schedule services at your convenience",
        "Track all jobs in one dashboard"
      ]
    },
    {
      icon: Zap,
      title: "Emergency & Unexpected Situations",
      description: "Life is unpredictable. HandySwift is here 24/7 to help you find urgent assistance when you need it most.",
      tips: [
        "Filter for immediate availability",
        "Contact verified providers instantly",
        "Get rapid response for urgent needs",
        "Peace of mind with trusted professionals"
      ]
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-secondary/8 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl text-slate-900 mb-4">
            Stay Safe & Work Smarter with HandySwift
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Your safety and success are our top priorities. Here's how HandySwift helps you work smarter and stay protected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-primary/30 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <tip.icon className="w-8 h-8 text-primary group-hover:text-secondary transition-colors duration-300" />
              </div>

              {/* Title */}
              <h3 className="text-2xl text-slate-900 mb-3">{tip.title}</h3>

              {/* Description */}
              <p className="text-slate-600 mb-6 leading-relaxed">{tip.description}</p>

              {/* Tips List */}
              <ul className="space-y-3">
                {tip.tips.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Safety Notice - REMOVED */}
      </div>
    </section>
  );
}