import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Users, Briefcase } from "lucide-react";

export function FinalCTA() {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden">
      {/* Background enhancement */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
      </div>
      
      {/* Geometric pattern */}
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
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
            Ready to get started?
          </h2>
          <p className="text-lg md:text-xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of Nigerians connecting with trusted providers today. 
            Get started in less than 2 minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              className="group bg-white text-primary hover:bg-slate-50 px-8 py-6 rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/signup')}
            >
              <Users className="w-5 h-5 mr-2" />
              <span>Join as a User</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              className="group bg-secondary text-slate-900 hover:bg-secondary/90 px-8 py-6 rounded-xl shadow-2xl hover:shadow-secondary/30 transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/provider-signup')}
            >
              <Briefcase className="w-5 h-5 mr-2" />
              <span>Join as a Provider</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 pt-12 border-t border-white/20 grid grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl text-white mb-2">50K+</div>
              <div className="text-white/80 text-sm md:text-base">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl text-white mb-2">10K+</div>
              <div className="text-white/80 text-sm md:text-base">Verified Providers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
