import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PageTransition } from "../components/PageTransition";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Info } from "lucide-react";
import { useState } from "react";

export function SendOffer() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [message, setMessage] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the offer to the backend
    alert("Offer sent successfully!");
    navigate("/provider-dashboard");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        
        {/* Header */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 pt-24 pb-12">
          <div className="container mx-auto px-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl text-white mb-4">
                Send Your Offer
              </h1>
              <p className="text-xl text-white/90">
                Submit your offer for this job request
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 -mt-8 pb-16">
          <div className="max-w-3xl mx-auto">
            {/* Offer Form */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Message/Note Section */}
                <div>
                  <Label htmlFor="message" className="text-slate-900 mb-2 block">
                    Your Message <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-slate-600 mb-3">
                    Introduce yourself and explain your approach to this job
                  </p>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Hello! I have over 10 years of experience in plumbing repairs. I can assess the issue and provide a detailed quote. I'm available this week..."
                    className="w-full min-h-[150px] p-4 rounded-xl border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    required
                  />
                </div>

                {/* Price Range Section */}
                <div>
                  <Label className="text-slate-900 mb-2 block">
                    Price Range <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-slate-600 mb-3">
                    Provide an estimated price range for this job
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minPrice" className="text-sm text-slate-700 mb-1.5 block">
                        Minimum Price
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₦</span>
                        <Input
                          id="minPrice"
                          type="number"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          placeholder="15,000"
                          className="pl-8 h-12 rounded-xl border-slate-300 focus:border-primary focus:ring-primary/20"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="maxPrice" className="text-sm text-slate-700 mb-1.5 block">
                        Maximum Price
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₦</span>
                        <Input
                          id="maxPrice"
                          type="number"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          placeholder="20,000"
                          className="pl-8 h-12 rounded-xl border-slate-300 focus:border-primary focus:ring-primary/20"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing Note */}
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-900">
                        <strong>Note:</strong> Pricing is negotiable
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Your final price can be discussed and agreed upon with the client through messaging
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="text-sm text-slate-700 mb-3">Offer Preview:</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-600">
                      <span className="text-slate-900">Price Range:</span>{" "}
                      {minPrice && maxPrice 
                        ? `₦${parseInt(minPrice).toLocaleString()} - ₦${parseInt(maxPrice).toLocaleString()}`
                        : "Not specified"}
                    </p>
                    <p className="text-slate-600">
                      <span className="text-slate-900">Message Length:</span>{" "}
                      {message.length} characters
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => navigate(-1)}
                    variant="outline"
                    className="flex-1 h-12 rounded-xl border-slate-300 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Submit Offer
                  </Button>
                </div>
              </form>
            </div>

            {/* Tips Section */}
            <div className="mt-6 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-lg text-slate-900 mb-4">Tips for a successful offer:</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">✓</span>
                  <span>Be professional and courteous in your message</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">✓</span>
                  <span>Clearly explain your experience and qualifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">✓</span>
                  <span>Provide a realistic price range based on the job requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">✓</span>
                  <span>Mention your availability and estimated completion time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
}
