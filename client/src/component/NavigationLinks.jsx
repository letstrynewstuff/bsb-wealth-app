import React from "react";

const NavigationLinks = () => {
  const navigationLinks = [
    "Personal Banking",
    "Business",
    "Privacy",
    "Security",
    "Contact",
    "Careers",
    "Locations",
  ];

  return (
    <div className="bg-[#002a81] py-6 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-3 sm:gap-x-8 md:gap-x-12">
          {navigationLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-white text-base sm:text-lg font-medium 
                transition-all duration-200 
                hover:text-opacity-80 hover:underline
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#002a81]
                relative group"
            >
              {link}
              <span
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white 
                  transition-all duration-200 group-hover:w-full"
              ></span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default NavigationLinks;
