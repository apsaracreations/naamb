import React from "react";
import {
  FaHandsHelping,
  FaLeaf,
  FaUserGraduate,
  FaPalette,
  FaCertificate,
  FaUniversity,
  FaFemale,
  FaIndustry,
  FaHandshake,
  FaRecycle,
  FaCheckCircle,
  FaAward,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AboutBanner from "../assets/AboutBanner.jpg"

const About = () => {
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
  };

  const values = [
    {
      icon: <FaUserGraduate className="text-4xl text-[#310000]/90" />,
      title: "Empower Through Education",
      text: "We believe skill development is the most powerful form of empowerment. Our programs help individuals turn their creativity into sustainable livelihoods.",
    },
    {
      icon: <FaPalette className="text-4xl text-[#310000]/90" />,
      title: "Preserving Tradition",
      text: "From handloom weaving to embroidery, we honor India’s timeless crafts while merging them with modern design and training practices.",
    },
    {
      icon: <FaLeaf className="text-4xl text-[#310000]/90" />,
      title: "Sustainable Livelihoods",
      text: "Apsara promotes eco-friendly production, women entrepreneurship, and community-based job creation through responsible initiatives.",
    },
    {
      icon: <FaHandsHelping className="text-4xl text-[#310000]/90" />,
      title: "Community & Growth",
      text: "We work closely with artisans, women, and youth—ensuring equal opportunity, fair training, and a culture of mutual growth.",
    },
  ];

  const approvals = [
    {
      icon: <FaUniversity className="text-3xl text-[#310000]/90" />,
      title: "Local Self Government Department (LSGD)",
      text: "Registered and approved under the Government of Kerala for certified training programs.",
    },
    {
      icon: <FaCertificate className="text-3xl text-[#310000]/90" />,
      title: "Khadi India (KVIC)",
      text: "Approved Training Centre under Khadi and Village Industries Commission, Government of India.",
    },
    {
      icon: <FaRecycle className="text-3xl text-[#310000]/90" />,
      title: "Kerala Suchitwa Mission",
      text: "Recognized agency for solid waste (non-biodegradable) management and recycling initiatives under LSGD.",
    },
    {
      icon: <FaIndustry className="text-3xl text-[#310000]/90" />,
      title: "MSME & District Industry Centre",
      text: "Certified under both Service and Manufacturing sectors — UDYAM-KL-10-0002138 & UDYAM-KL-10-0033882.",
    },
    {
      icon: <FaFemale className="text-3xl text-[#310000]/90" />,
      title: "Women & Child Development Dept.",
      text: "Recognized for advancing women’s vocational skills and rural empowerment.",
    },
    {
      icon: <FaHandshake className="text-3xl text-[#310000]/90" />,
      title: "Skill Development Collaborations",
      text: "Partnered with multiple national and state-level organizations to expand skill training initiatives.",
    },
    {
      icon: <FaAward className="text-3xl text-[#310000]/90" />,
      title: "16+ Certifications",
      text: "Recognized by various National & State-level departments for excellence in social entrepreneurship.",
    },
  ];

  const subBrands = [
    { title: "Apsara Creations", desc: "TMEGP unit under KBIB focusing on traditional production." },
    { title: "Apsara Training Institute", desc: "Our MSME certified skill development wing." },
    { title: "Apsara Skill Park", desc: "Advanced industrial training and skill incubation." },
    { title: "Naamb Project", desc: "Sustainable waste-to-wealth initiative empowering women." },
  ];

  const experienceItems = [
    "Experience Center",
    "Training Demo Space",
    "Product Display Lab",
    "Live Working Demo",
    "Training Enquiry Desk",
  ];

  return (
    <div className="min-h-screen bg-[#f9f8f6] font-sans">
      {/* HERO SECTION */}
      <section
        className="relative text-center py-24 px-6 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: `url(${AboutBanner})`,
  }}
      >
        <div className="absolute inset-0 bg-[#310000]/80"></div>
        <div className="relative z-10 max-w-5xl mx-auto text-white">
          <h1 className="text-5xl md:text-6xl font-serif font-light mb-4 border-b-2 border-[#f5e6ca]/40 inline-block pb-2">
            Apsara Eco Hub
          </h1>
          <p className="text-2xl font-semibold italic text-[#f5e6ca] mb-6">"i+aval" — Co-creation. Collective Empowerment.</p>
          <p className="text-lg md:text-xl font-semibold text-gray-100 leading-relaxed">
            Headquartered in Ottapalam, we are a community-based livelihood movement 
            shaping futures since 2003.
          </p>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="container mx-auto px-6 lg:px-20 py-24 grid grid-cols-1 lg:grid-cols-[35%_65%] gap-12 items-center">
        <div className="overflow-hidden shadow-xl h-[300px] lg:h-[650px]">
          <img
            src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800"
            alt="Vishnu Priya - Social Enterprise Leader"
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-serif text-[#310000] mb-4 border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
            Together, Let’s Make Women Empowerment a Living Reality
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            In the quiet lanes of rural Kerala, there once lived a young girl named <strong>Vishnu Priya</strong>. 
            Inspired by the rich traditions of Kerala’s arts and crafts, she longed to become an entrepreneur who could 
            uplift other women. Despite financial struggles, the turning point came in <strong>2004</strong> when 
            <strong> Kudumbashree</strong>, Kerala’s mission for women’s development, extended a helping hand.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            Realizing she could not walk this journey alone, she began a mission to help women build small businesses 
            of their own. With just a sewing machine at home, each woman could earn a dignified livelihood. To scale 
            this vision, she launched <strong>“Naamb”</strong>, meaning <strong>“She and I together.”</strong>
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            <strong>Naamb</strong> is more than a product; it is a symbol of resilience and love, telling the story 
            of women who chose courage over despair. By choosing <strong>Naamb</strong>, you are standing with women 
            who are writing a new chapter in their lives.
          </p>

          <div className="bg-[#310000] text-[#f5e6ca] p-6 rounded-sm italic shadow-lg">
            "Our mission is to expand Naamb with the support of technology, improving both employment 
            opportunities and the income of our sisters." 
            <span className="block mt-2 font-bold not-italic text-white">— Vishnu Priya</span>
          </div>
        </div>
      </section>

      {/* BRAND ECOSYSTEM SECTION */}
      <section className="bg-[#f2ede4] py-20 px-6 lg:px-20 border-y border-[#e5dfd3]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif text-[#310000] text-center mb-12">The Apsara Ecosystem</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subBrands.map((brand, i) => (
              <div key={i} className="bg-white p-6 border-l-4 border-[#310000] shadow-sm">
                <h4 className="font-bold text-[#310000] mb-2">{brand.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{brand.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISION & MISSION SECTION */}
      <section className="bg-[#f7efe1] py-20 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h3 className="text-3xl font-serif text-[#310000] mb-5 border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
              Our Vision
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              M/s Apsara Training Institute for Skill Development and Management focuses on the transition from a 
              <strong> small production unit to a community-based livelihood movement</strong>. We focus on 
              empowerment of youth through Skill-based Development for their self-sustained development and 
              Capacity building through Vocational training by promoting Micro Small and Medium Enterprises 
              (MSMEs) in rural and urban areas of the country.
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-serif text-[#310000] mb-5 border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
              Our Mission
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our Mission is to reach out to the unreached/less privileged through a multifaceted approach focusing 
              on Skill Development training, capacity building and other development initiatives/Income generation activities.
            </p>
          </div>
        </div>
      </section>

      {/* CORE VALUES SECTION */}
      <section className="container mx-auto px-6 lg:px-16 py-20">
        <h2 className="text-4xl font-serif text-[#310000] text-center mb-12 border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((val, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-xl border border-[#e5dfd3] shadow-md text-center hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-4">{val.icon}</div>
              <h4 className="text-xl font-semibold text-[#3A2D2D] mb-2">
                {val.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">{val.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CORPORATE & ESG SECTION */}
      <section className="py-24 px-6 lg:px-20 bg-white border-t border-[#e5dfd3]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-serif text-[#310000] mb-6">Corporate ESG Partner</h2>
            <p className="text-gray-700 text-lg mb-6">
              We are a key sustainable partner for <strong>Bank, IT, and CSR sectors</strong>. 
              Our initiatives fall under the <strong>ESG (Environment, Social, Governance)</strong> category, 
              providing corporate gifting solutions that tell a story of sustainability.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-[#310000]" />
                <span className="font-medium">Sustainable Corporate Gifting</span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-[#310000]" />
                <span className="font-medium">CSR Community Impact Programs</span>
              </div>
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-[#310000]" />
                <span className="font-medium">Zero-Waste Procurement Solutions</span>
              </div>
            </div>
          </div>
          <div className="bg-[#f7efe1] p-10 border border-[#e5dfd3]">
            <h3 className="text-2xl font-serif text-[#310000] mb-6">The Naamb Project</h3>
            <p className="text-gray-700 mb-4">
              <strong>Naamb</strong> is our integrated waste collection and upcycling platform. 
              Supported by Apsara Training Institute (MSME) since 2008 and Apsara Creations (TMEGP unit), 
              Naamb is a <strong>0-Waste Initiative</strong> that transforms waste into wealth.
            </p>
            <div className="flex items-center gap-4 text-[#310000] font-bold">
              <FaRecycle className="text-3xl" />
              <span>Sustainable Wealth & Livelihood</span>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE CENTER GRID */}
      <section className="bg-[#310000] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-[#f5e6ca] font-serif text-3xl mb-10">Visit Our Eco Hub</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {experienceItems.map((item, i) => (
              <div key={i} className="border border-[#f5e6ca]/30 p-4 text-center text-white text-sm hover:bg-[#f5e6ca] hover:text-[#310000] transition duration-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPROVALS & AFFILIATIONS */}
      <section className="bg-[#f7efe1] py-20 px-6 lg:px-20">
        <h2 className="text-4xl font-serif text-[#3A2D2D] text-center mb-12 border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
          Approvals & Affiliations
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {approvals.map((app, i) => (
            <div
              key={i}
              className="bg-white border border-[#e5dfd3] p-6 rounded-xl shadow-md hover:shadow-lg transition text-center"
            >
              <div className="flex justify-center mb-3">{app.icon}</div>
              <h4 className="text-lg font-semibold text-[#3A2D2D] mb-2">
                {app.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {app.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 bg-[#310000]/95 text-white px-6">
        <h2 className="text-3xl md:text-4xl font-serif mb-4 border-b-2 border-[#f5e6ca]/40 inline-block pb-2">
          Empowering Skills, Building Futures
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          Join the movement from Ottapalam to the world. Let's build a sustainable future together.
        </p>
        <button
          onClick={() => handleNavigate("/contact")}
          className="px-8 py-3 cursor-pointer bg-[#e5dfd3] text-[#3A2D2D] rounded-full font-bold tracking-wide hover:bg-gray-100 transition"
        >
          Partner With Us
        </button>
      </section>
    </div>
  );
};

export default About;