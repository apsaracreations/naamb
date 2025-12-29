import React from 'react';
import {
  FaGraduationCap,
  FaIndustry,
  FaHandshake
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
      title: 'Crafts & Vocational Skills',
      icon: <FaGraduationCap className="w-6 h-6 text-[#310000]" />,
      description:
        'Hands-on training in traditional and modern craft techniques for product manufacturing.',
      courses: [
        'Fashion Designing Training',
        'Embroidery Training',
        'Crafts Training (Wood, Fibre, Metal, Terracotta)',
        'Tailoring Coaching'
      ]
    },
    {
      title: 'Entrepreneurship & Manufacturing',
      icon: <FaIndustry className="w-6 h-6 text-[#310000]" />,
      description:
        'Training focused on establishing and scaling small businesses using sustainable practices.',
      courses: [
        'Enterprise Development Training',
        'Waste to Wealth Manufacturing',
        'General Skills Training (220+ Skills)'
      ]
    },
    {
      title: 'Soft Skills & Leadership',
      icon: <FaHandshake className="w-6 h-6 text-[#310000]" />,
      description:
        'Developing interpersonal and professional abilities for career growth and management.',
      courses: [
        'Communication & Personality Development',
        'Effective Communication Skills',
        'Leadership & Interview Training'
      ]
    }
  ];

  const benefits = [
    {
      icon: <MdSpeed className="w-6 h-6" />,
      title: 'Machine Proficiency',
      detail:
        'Gain practical mastery in using advanced, high-speed machinery relevant to your trade.'
    },
    {
      icon: <MdDesignServices className="w-6 h-6" />,
      title: 'Design & Product Skills',
      detail:
        'Learn material selection, product design, and arrangement techniques with professional guidance.'
    },
    {
      icon: <MdBusinessCenter className="w-6 h-6" />,
      title: 'Business & Finance',
      detail:
        'Master marketing, valuation, auditing, and registration essentials to start your own venture.'
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
            Empowering Futures Through Vocational & Entrepreneurial Training
          </p>
        </div>
      </header>

      {/* About Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-serif text-[#310000] mb-4 border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
            About the Institute
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            The <strong>Apsara Training Institute</strong> is a socially driven
            institution empowering women and youth through hands-on skill
            development, vocational training, and entrepreneurship programs.
            Since its inception, the institute has transformed countless lives
            by bridging traditional craftsmanship with modern vocational
            education. With government affiliations including KVIC and MSME
            registration, Apsara stands for sustainability, creativity, and
            empowerment.
          </p>
        </div>

        <div className="overflow-hidden shadow-lg">
          <img
            src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrzlSliZQi25JMEHnHu4thjX6oMM0pnfOJP1oTNgozgPPTKm9vC44RNvLkq-gcZZybqYdap0mBtJzlh7l99zldSPVWv8Za-M4FjRGUirTtpz9ngwCGUdEmp36qhL7KG5y3y0uat=s1360-w1360-h1020-rw"
            alt="Apsara Training Workshop"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </section>

      {/* Training Programs */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-serif text-center text-[#310000] mb-10 border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
          Our Training Programs
        </h2>

        {/* Banner Image Above the Cards */}
        <div className="mb-10 overflow-hidden shadow-md rounded-xl">
          <img
            src="https://nepalyouthfoundation.org/wp-content/uploads/2024/04/DSC05529-1-1-scaled.jpg"
            alt="Training Program Overview"
            className="w-full h-96 object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trainingCategories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </section>

      {/* Key Benefits */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-serif text-center text-[#310000] mb-10 border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
          Key Benefits
        </h2>
        <div className="grid grid-cols-1  md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 bg-gradient-to-r from-[#310000]/95 to-[#310000]/95 text-white rounded-t-[2rem]">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 border-b-2 border-[#f5e6ca]/40 inline-block pb-2">
          Ready to Begin Your Journey?
        </h2>
        <p className="text-lg text-white/90 mb-8">
          Transform your skills into a successful career or thriving enterprise.
        </p>
        <button
          onClick={() => handleNavigate('/contact')}
          className="px-10 py-3 bg-white text-[#310000] cursor-pointer rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-transform duration-300"
        >
          Contact Us
        </button>
      </section>
    </div>
  );
};

export default Training;
