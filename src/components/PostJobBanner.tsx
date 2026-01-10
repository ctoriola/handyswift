import { Button } from "./ui/button";
import { Plus, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PostJobBanner() {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Modern background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-20 w-64 h-64 bg-primary/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(180deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          
          {/* Heading */}
          <h2 className="text-3xl md:text-5xl text-white mb-6">
            Can't find what you're looking for?
          </h2>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Post your job and let verified providers come to you with competitive offers. 
            It's free and takes less than 2 minutes.
          </p>
          
          {/* CTA Button */}
          <Button 
            onClick={() => navigate('/post-job')}
            className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            <span>Post a Job</span>
          </Button>
          
          {/* Trust indicator */}
          <p className="text-white/60 text-sm mt-6">
            Join 50,000+ satisfied customers who found their perfect service provider
          </p>
        </div>
      </div>
    </section>
  );
}
