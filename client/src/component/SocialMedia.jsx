import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useState } from 'react'

const SocialMedia = () => {
    const [hoveredSocial, setHoveredSocial] = useState(null);


  const socialMedia = [
    { icon: Twitter, name: "X", handle: "X" },
    { icon: Facebook, name: "Facebook", handle: "Facebook" },
    { icon: Instagram, name: "Instagram", handle: "Instagram" },
    { icon: Linkedin, name: "LinkedIn", handle: "LinkedIn" },
  ];



  return (
    <div className="bg-blue-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white text-center mb-8 sm:mb-12">
          Follow Us On Social Media
        </h2>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-16">
          {socialMedia.map((social) => (
            <div
              key={social.name}
              className="relative group"
              onMouseEnter={() => setHoveredSocial(social.name)}
              onMouseLeave={() => setHoveredSocial(null)}
            >
              <div className="cursor-pointer transform transition-transform duration-200 hover:scale-110">
                <social.icon
                  size={32}
                  className="text-yellow-400 transition-colors duration-200 hover:text-yellow-300"
                />
              </div>
              {/* Hover tooltip - show only on larger screens */}
              {hoveredSocial === social.name && (
                <div
                  className="hidden sm:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                    bg-white text-blue-600 px-3 py-1 rounded-md shadow-lg
                    text-sm font-medium whitespace-nowrap"
                >
                  {social.handle}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SocialMedia