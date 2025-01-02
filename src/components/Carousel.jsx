import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "React 18 Released!",
      subtitle: "1ST ODI",
      description: "India are favourites but...!",
      ctaText: "TRADE NOW",
      bgColor: "bg-yellow-300",
      textColor: "text-black",
    },
    {
      title: "BABAR DROPPED",
      subtitle: "#PAKVENG 3RD TEST",
      description: "Pakistan to take lead?",
      ctaText: "TRADE NOW",
      bgColor: "bg-blue-600",
      textColor: "text-white",
    },
    {
      title: "IND VS NZ",
      subtitle: "INDIA TO BOUNCE BACK?",
      description: "Who will win?",
      ctaText: "TRADE NOW",
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-700",
      textColor: "text-white",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
  {/* Main Carousel */}
  <div className="relative">
    <div
      className="flex transition-transform duration-500 ease-out"
      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
    >
      {slides.map((slide, index) => (
        <div key={index} className="min-w-full">
          <Card
            className={`${slide.bgColor} ${slide.textColor} overflow-hidden rounded-lg`}
          >
            <div className="flex flex-col items-center justify-between p-4 md:flex-row md:items-center md:p-6">
              <div className="flex flex-col justify-center items-center md:items-start space-y-2">
                <span className="space-x-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white md:text-sm">
                  {slide.subtitle}
                </span>
                <h3 className="text-xl font-bold md:text-2xl">
                  {slide.title}
                </h3>
                <p className="text-sm md:text-lg">{slide.description}</p>
                <Button
                  variant="secondary"
                  className="mt-4 bg-black text-white hover:bg-gray-800"
                >
                  {slide.ctaText}
                </Button>
              </div>

              {/* Placeholder for player images */}
              <div className="flex h-36 w-full items-center justify-center p-2 md:h-48 md:w-1/3 md:justify-end">
                <img
                  src="https://img.freepik.com/free-photo/medium-shot-man-wearing-vr-glasses_23-2149126949.jpg"
                  alt="Player"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  </div>

  {/* Dots Navigation */}
  <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 transform space-x-2 md:bottom-4">
    {slides.map((_, index) => (
      <button
        key={index}
        className={`h-2 w-2 rounded-full transition-all duration-300 ${
          currentSlide === index ? "w-4 bg-white" : "bg-white/50"
        }`}
        onClick={() => setCurrentSlide(index)}
      />
    ))}
  </div>
</div>

  );
}
