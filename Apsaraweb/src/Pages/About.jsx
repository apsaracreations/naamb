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
  FaPlusCircle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
      icon: <FaPalette className="text-4xl  text-[#310000]/90" />,
      title: "Preserving Tradition",
      text: "From handloom weaving to embroidery, we honor India’s timeless crafts while merging them with modern design and training practices.",
    },
    {
      icon: <FaLeaf className="text-4xl  text-[#310000]/90" />,
      title: "Sustainable Livelihoods",
      text: "Apsara promotes eco-friendly production, women entrepreneurship, and community-based job creation through responsible initiatives.",
    },
    {
      icon: <FaHandsHelping className="text-4xl  text-[#310000]/90" />,
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
      text: "Certified under Service and Manufacturing sectors — UDYAM-KL-10-0002138 & UDYAM-KL-10-0033882.",
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
  ];

  return (
    <div className="min-h-screen bg-[#f9f8f6] font-sans">
      {/* HERO SECTION */}
      <section
        className="relative text-center py-60 px-6 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/gps-cs-s/AG0ilSw9EjUL_FzweFhSs1uFcWA1yqwoHoKJhgqSnypUmIZsKpY3Y76uNW3SmjU6ZGipz6ojKWGBqBOCnXZdA_PnrlvFqNL8zU4H5lMQFoDxeUyhqBWHMDQieDbv7lt6k6GoFN7M2SSBMiAMW8tM=s1360-w1360-h1020-rw')",
        }}
      >
        <div className="absolute inset-0 bg-[#310000]/70"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-white">
          <h1 className="text-5xl md:text-6xl font-serif font-light mb-6 border-b-2 border-[#f5e6ca]/40 inline-block pb-2">
            About Apsara Institute
          </h1>
          <p className="text-lg md:text-xl text-gray-100 leading-relaxed">
            Empowering individuals since 2006 through skill, creativity, and
            community — nurturing the spirit of self-reliance across Kerala.
          </p>
        </div>
      </section>

      {/* NEW STORY SECTION: VISHNU PRIYA & NAAMP */}
      <section className="container mx-auto px-6 lg:px-20 py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-[#310000] mb-8 border-b-2 border-[#3A2D2D]/20 inline-block pb-2 leading-tight">
            Together, Let’s Make Women Empowerment a Living Reality
          </h2>
          
          <div className="space-y-6 text-gray-700 text-lg leading-relaxed ">
            <p>
              In the quiet lanes of rural Kerala, there once lived a young girl named Vishnu Priya. Her world was simple, but her dreams were vast. Inspired by the rich traditions of Kerala’s arts and crafts, she longed to become an entrepreneur, someone who could create, inspire, and uplift other women along with her. But life was not easy. Her family’s financial struggles weighed heavily on her, and many of her dreams seemed like distant stars, visible, yet forever out of reach.
            </p>
            <p className="not-italic">
              Then came the turning point in her life. In <strong>2004</strong>, <strong>Kudumbashree</strong>, Kerala’s mission for women’s development, extended a helping hand. With their support, Vishnu Priya found both the courage and the platform to step into entrepreneurship, breathing life into her dream of working with arts and crafts. 
            </p>
            <p className="not-italic">
              Yet, as she moved forward, she realized that countless other women and families around her were still caught in the same cycle of financial hardship. She knew she could not walk this journey alone. So, she began a mission: to bring women together, to instill confidence in them, and to help them build small businesses of their own. With just a sewing machine at home, each woman could earn at least <strong>₹8,000 a month</strong>.
            </p>
            <p className="not-italic font-medium text-[#310000] bg-[#f7efe1] p-6 border-l-4 border-[#310000]">
              To make this vision a reality, she launched a brand called <strong>“Naamp”</strong>, meaning <strong>“She and I together.”</strong> Naamp is not just a product. It is a symbol of cooperation, resilience, and love that explains the story of women who chose courage over despair.
            </p>
            <p className="not-italic">
              Our mission is to expand Naamp with the support of technology, improving both employment opportunities and the income of our sisters. And this is where you can make a difference. By choosing to buy Naamp products, you are not just purchasing a pouch, but you are empowering, supporting, and standing with women who are writing a new chapter in their lives.
            </p>
          </div>
        </div>
      </section>

      {/* STORY SECTION: JOURNEY */}
      <section className="container mx-auto px-6 lg:px-20 pb-24 grid grid-cols-1 lg:grid-cols-[35%_65%] gap-12 items-center">
        <div className="overflow-hidden shadow-xl h-[300px] lg:h-[560px] ">
          <img
            src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzQCILKWwbgFO85dSg5eiqwYCDrqqYSBlQFvysG9yEOY7md8g65wWVg5PUm9G6_ypPCwp5WrhCORdmjCh7vdJpNAZ8YF-n-r1H00hFUkLWNyvSst5N93_VJNw9f4OMuERRi2B6t=s1360-w1360-h1020-rw"
            alt="Apsara Institute Training Center"
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-4xl font-serif text-[#310000] mb-4 border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
            Our Journey of Skill & Empowerment
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Established in <strong>2006</strong>,{" "}
            <strong>
              Apsara Training Institute for Skill Development and Management
            </strong>{" "}
            began as a small initiative to uplift local communities through
            skill-based education. Over time, it evolved into a recognized center
            for traditional art forms and vocational training, shaping thousands
            of lives across Kerala. Officially recognized by the{" "}
            <strong>Khadi and Village Industries Commission (KVIC)</strong> and
            affiliated with the{" "}
            <strong>Local Self Government Department (LSGD)</strong> of Kerala,
            Apsara stands as a symbol of trust and excellence in grassroots
            education.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Our training includes a diverse range of disciplines such as{" "}
            <strong>
              handloom weaving, embroidery, tailoring, handicrafts, and
              entrepreneurship development
            </strong>
            . Each course blends traditional craftsmanship with modern
            techniques, ensuring our learners are industry-ready while
            preserving cultural roots. Today, Apsara Institute continues to
            redefine skill development — not just by teaching, but by inspiring
            independence, confidence, and innovation.
          </p>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="bg-[#f7efe1] py-20 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h3 className="text-3xl font-serif text-[#310000] mb-5 border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
              Our Vision
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              M/s Apsara Training Institute for Skill Development and Management focus on
              empowerment of youth through Skill based Development for their self sustained
              development and Capacity building through Vocational training by promoting
              Micro Small and Medium Enterprises (MSME's) in rural and urban areas of the
              country.
            </p>
          </div>
          <div>
            <h3 className="text-3xl font-serif text-[#310000] mb-5 border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
              Our Mission
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our Mission is to reach out to the unreached/less privileged through a multifaceted
              approach focusing on Skill Development training, capacity building and other
              development initiatives/Income generation activities.
            </p>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
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
          {/* 16+ Certifications Card */}
          <div className="bg-white border border-[#e5dfd3] p-6 rounded-xl shadow-md hover:shadow-lg transition text-center flex flex-col items-center justify-center border-dashed border-2">
             <FaPlusCircle className="text-3xl text-[#310000]/60 mb-3" />
             <h4 className="text-2xl font-bold text-[#310000]">16+ Certifications</h4>
             <p className="text-gray-500 text-sm italic">from National & State-level departments</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 bg-[#310000]/95 text-white px-6">
        <h2 className="text-3xl md:text-4xl font-serif mb-4 border-b-2 border-[#f5e6ca]/40 inline-block pb-2">
          Empowering Skills, Building Futures
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          Join us in our mission to create opportunities, preserve culture, and
          transform lives through education and skill.
        </p>
        <button
          onClick={() => handleNavigate("/contact")}
          className="px-8 py-3 cursor-pointer bg-[#e5dfd3] text-[#3A2D2D] rounded-full font-bold tracking-wide hover:bg-gray-100 transition"
        >
          Contact Us
        </button>
      </section>
    </div>
  );
};

export default About;