import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import fdicImg from "../assets/fdic.png";

const Footer = () => {
  const socialMedia = [
    { icon: Twitter, name: "X", handle: "@bankname" },
    { icon: Facebook, name: "Facebook", handle: "@bankname" },
    { icon: Instagram, name: "Instagram", handle: "@bankname" },
    { icon: Linkedin, name: "LinkedIn", handle: "@bankname" },
  ];

  return (
    <footer className="bg-blue-800 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Left side information */}
          <div className="space-y-4 ">
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xl font-semibold">
              <span>Routing Number: 101104928</span>
              <span className="hidden md:inline">|</span>
              <span>
                Customer Support:{" "}
                <span className="text-yellow-500">888-827-1887</span>
              </span>
              <span className="hidden md:inline">|</span>
              <span>
                Lost/Stolen Card: <br />
                <span className="text-yellow-500">888-827-1887</span>
              </span>
            </div>

            <div className="flex flex-wrap gap-x-2 gap-y-1">
              <span>© Copyright 2025 - The Bennington State Bank</span>
              <span className="hidden md:inline">|</span>
              <a href="#" className="text-blue-600 hover:underline">
                All Rights Reserved
              </a>
              <span className="hidden md:inline">|</span>
              <a href="#" className="text-yellow-600 hover:underline">
                Sitemap
              </a>
              <span className="hidden md:inline">|</span>
              <button
                className="px-4 py-1 bg-yellow-400 text-white text-center rounded-lg 
                    hover:bg-blue-700 transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Support
              </button>
            </div>
            <div className="w-full">
              <img
                src={fdicImg}
                alt="Footer decorative image"
                className="h-8 w-auto object-contain"
              />
            </div>
          </div>
          {/* Right side social media */}
          <div className="flex gap-4">
            {socialMedia.map((social) => (
              <a
                key={social.name}
                href="#"
                className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200
                    transform hover:scale-110"
                aria-label={social.name}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
