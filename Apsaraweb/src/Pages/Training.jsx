import React from 'react';
import {
  FaGraduationCap,
  FaIndustry,
  FaHandshake,
  FaLeaf,
  FaRecycle,
  FaGlobe
} from 'react-icons/fa';
import {
  MdCheckCircle,
  MdSpeed,
  MdDesignServices,
  MdBusinessCenter
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

// Category Card
const CategoryCard = ({ title, icon, description, courses }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition duration-300 border border-[#e5dfd3]">
    <div className="flex items-center mb-4">
      <div className="p-3 rounded-full bg-[#f7efe1]">{icon}</div>
      <h3 className="text-xl font-bold text-[#310000] ml-4">{title}</h3>
    </div>
    <p className="text-gray-600 mb-4 text-sm">{description}</p>
    <ul className="space-y-2">
      {courses.map((course) => (
        <li
          key={course}
          className="flex items-start text-gray-800 text-sm bg-gray-50 rounded-md px-3 py-2"
        >
          <MdCheckCircle className="text-[#310000] mt-0.5 mr-2" />
          {course}
        </li>
      ))}
    </ul>
  </div>
);

// Benefit Card
const BenefitCard = ({ icon, title, detail }) => (
  <div className="bg-[#310000]/90 text-white  p-6 rounded-2xl shadow-lg text-center transition">
    <div className="flex justify-center mb-3">
      <div className="p-3 bg-[#f7efe1] rounded-full text-[#310000]">
        {icon}
      </div>
    </div>
    <h3 className="text-lg font-semibold mb-2 text-[#F5E6CA]">{title}</h3>
    <p className="text-gray-200 text-sm">{detail}</p>
  </div>
);

const Training = () => {
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
  };

  const trainingCategories = [
    {
      title: 'Traditional Crafts & Arts',
      icon: <FaGraduationCap className="w-6 h-6 text-[#310000]" />,
      description:
        'Preserving heritage through technical mastery of natural fibers and traditional materials.',
      courses: [
        'Fashion & Embroidery Training',
        'Bamboo & Jute Crafting',
        'Terracotta & Pottery Arts',
        'Traditional Musical Instruments'
      ]
    },
    {
      title: 'Sustainability & MSME',
      icon: <FaRecycle className="w-6 h-6 text-[#310000]" />,
      description:
        'Promoting Micro, Small and Medium Enterprises through eco-friendly production methods.',
      courses: [
        'Wealth from Waste (Recycling)',
        'Eco-friendly Pouch Making',
        'Bio-degradable Product Design',
        'Organic Food Processing'
      ]
    },
    {
      title: 'Enterprise Management',
      icon: <FaIndustry className="w-6 h-6 text-[#310000]" />,
      description:
        'Capacity building for sustainable livelihoods and successful business ownership.',
      courses: [
        'Enterprise Development (EDP)',
        'Vriksha Ayurveda Farming',
        'Organic Waste to Manure',
        'MSME Registration & Growth'
      ]
    }
  ];

  const benefits = [
    {
      icon: <MdSpeed className="w-6 h-6" />,
      title: 'Skill-Based Empowerment',
      detail:
        'Focus on technical proficiency and capacity building for self-sustained development.'
    },
    {
      icon: <FaGlobe className="w-6 h-6" />,
      title: 'Inclusive Outreach',
      detail:
        'Reaching the unreached and less privileged through multifaceted development initiatives.'
    },
    {
      icon: <MdBusinessCenter className="w-6 h-6" />,
      title: 'Income Generation',
      detail:
        'Practical training designed specifically to facilitate immediate and steady income activities.'
    }
  ];

  return (
    <div className="bg-[#f9f8f6] font-sans">
      {/* Header */}
      <header
        className="relative text-center py-24 md:py-40 overflow-hidden"
        style={{
          backgroundImage: `url('https://www.tallengestore.com/cdn/shop/products/minia_8_1c32153b-8579-4908-83fb-025740c6345f.jpg?v=1569137585')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-[#310000]/90"></div>
        <div className="relative z-10 text-white px-6">
          <h1 className="text-5xl md:text-6xl font-serif font-light  mb-4 border-b-2 border-[#f5e6ca]/40 inline-block pb-2">
            Skill Development & Management
          </h1>
          <p className="text-lg md:text-xl text-white max-w-3xl mx-auto">
            Empowerment Through Skill-Based Development & Vocational Excellence
          </p>
        </div>
      </header>

      {/* Vision & Mission Section (Updated from Image) */}
      {/* <section className="bg-[#f7efe1] py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-[#310000]">
            <h3 className="text-2xl font-serif text-[#310000] mb-4 flex items-center">
              Our Vision
            </h3>
            <p className="text-gray-700 leading-relaxed italic">
              "To focus on empowerment of youth through Skill based Development for their self sustained development and Capacity building through Vocational training by promoting Micro Small and Medium Enterprises (MSME's) in rural and urban areas of the country."
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-[#310000]">
            <h3 className="text-2xl font-serif text-[#310000] mb-4 flex items-center">
              Our Mission
            </h3>
            <p className="text-gray-700 leading-relaxed italic">
              "To reach out to the unreached /less privileged through a multifaceted approach focusing on Skill Development training, capacity building and other development initiatives /Income generation activities."
            </p>
          </div>
        </div>
      </section> */}

      {/* Main Training Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-serif text-[#310000] mb-4 border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
            Vocational Training Excellence
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Apsara Training Institute offers over <strong>210 specialized skill courses</strong>. 
            Our approach blends traditional craftsmanship with modern industrial standards, 
            ensuring that every trainee becomes a creator and an entrepreneur. We focus on 
            <strong> "Wealth from Waste"</strong> and eco-friendly production to build 
            sustainable livelihoods for over 50,000 youth and women across Kerala.
          </p>
          <div className="flex gap-4">
             <div className="text-center">
                <span className="block text-3xl font-bold text-[#310000]">210+</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Courses</span>
             </div>
             <div className="w-px h-10 bg-gray-300"></div>
             <div className="text-center">
                <span className="block text-3xl font-bold text-[#310000]">50k+</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Trained</span>
             </div>
             <div className="w-px h-10 bg-gray-300"></div>
             <div className="text-center">
                <span className="block text-3xl font-bold text-[#310000]">100%</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Eco-Friendly</span>
             </div>
          </div>
        </div>

        <div className="overflow-hidden shadow-lg rounded-2xl">
          <img
            src="https://nepalyouthfoundation.org/wp-content/uploads/2024/04/DSC05529-1-1-scaled.jpg"
            alt="Apsara Training Workshop"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </section>

      {/* Programs Grid */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-serif text-center text-[#310000] mb-12 border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
          Specialized Training Sectors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trainingCategories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </section>

      {/* Key Benefits */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-serif text-center text-[#310000] mb-12 border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
          Why Choose Apsara?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 bg-[#310000] text-white rounded-t-[2rem]">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 border-b-2 border-[#f5e6ca]/40 inline-block pb-2">
          Start Your Enterprise Today
        </h2>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Imparting craft skills and creating value from eco-friendly natural resources to rejuvenate dying crafts and generate steady income.
        </p>
        <button
          onClick={() => handleNavigate('/contact')}
          className="px-10 py-3 bg-[#f7efe1] text-[#310000] cursor-pointer rounded-full font-bold text-lg shadow-lg hover:bg-white transition-all duration-300"
        >
          Enroll in a Program
        </button>
      </section>
    </div>
  );
};

export default Training;