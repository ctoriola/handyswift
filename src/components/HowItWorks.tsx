import { Button } from "./ui/button";
import { Search, Users, Calendar, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HowItWorks() {
  const navigate = useNavigate();
  
  const steps = [
    {
      icon: Search,
      title: "Search for a service",
      description: "Tell us what you need and where you are"
    },
    {
      icon: Users,
      title: "Compare verified providers",
      description: "View profiles, ratings, and reviews"
    },
    {
      icon: Calendar,
      title: "Book instantly or post a job",
      description: "Schedule immediately or let providers bid"
    },
    {
      icon: Star,
      title: "Get it done and leave a review",
      description: "Enjoy quality service and share your experience"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
            Simple, Fast, and Reliable
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Getting the help you need has never been easier
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-px bg-gradient-to-r from-gray-300 to-transparent transform -translate-x-1/2 z-0"></div>
              )}
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <step.icon className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/get-started')}
            className="bg-[#007AFF] hover:bg-[#007AFF]/90 active:bg-[#D3D3D3] text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}
