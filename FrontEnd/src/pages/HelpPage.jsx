import { useState } from "react";
import { ChevronDown, ChevronUp, Search, Mail, Phone } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const HelpPage = () => {
  const [faqOpen, setFaqOpen] = useState(null);

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: e.target[0].value,
      email: e.target[1].value,
      message: e.target[2].value
    };
    localStorage.setItem('contactFormData', JSON.stringify(formData));
    toast.success("Your feedback has been saved locally!");
  };
  
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Help & Support</h1>
          <p className="mt-2 text-zinc-500">How can we assist you today?</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for help topics..." 
            className="input input-bordered w-full pl-12"
          />
          <Search className="absolute left-4 top-3 w-5 h-5 text-zinc-400" />
        </div>

        {/* FAQ Section */}
        <div className="bg-base-300 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-medium">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                question: "How do I update my profile?",
                answer: "Go to your Profile Page, make the necessary changes, and click on 'Update Profile'."
              },
              {
                question: "How can I reset my password?",
                answer: "Click on 'Forgot Password' on the login page and follow the instructions."
              },
              {
                question: "How do I contact support?",
                answer: "You can use the contact form below or reach out via email or phone."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-base-100 rounded-lg p-4">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-md font-medium">{faq.question}</h3>
                  {faqOpen === index ? <ChevronUp /> : <ChevronDown />}
                </div>
                {faqOpen === index && (
                  <p className="mt-2 text-zinc-500">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-base-300 rounded-xl p-6">
          <h2 className="text-xl font-medium mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <a href="#" className="hover:text-primary">Account Settings</a>
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">Contact Us</a>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-base-300 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-medium">Contact Support</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Your Name" 
              className="input input-bordered w-full"
              required
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              className="input input-bordered w-full"
              required
            />
            <textarea 
              placeholder="How can we help you?" 
              className="textarea textarea-bordered w-full"
              required
            ></textarea>
            <button type="submit" className="btn btn-primary w-full">Submit</button>
          </form>

          <div className="text-sm text-zinc-400 space-y-2">
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              support@example.com
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              +123-456-7890
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
