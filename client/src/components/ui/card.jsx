import { ArrowRight } from "lucide-react";

function Card({ title, description, icon, gradient, onClick }) {
  return (
    <div
      className={`bg-gradient-to-r ${gradient} rounded-lg shadow-lg p-6 text-white cursor-pointer transform transition-transform duration-300 hover:scale-105`}
      onClick={onClick}
    >
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-2xl font-bold ml-4">{title}</h2>
      </div>
      <p className="mb-4">{description}</p>
      <div className="flex items-center justify-end">
        <span className="mr-2">Get Started</span>
        <ArrowRight className="w-5 h-5" />
      </div>
    </div>
  );
}

export default Card;
