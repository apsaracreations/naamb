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
      icon: <FaCertificate className="text-3xl  text-[#310000]/90" />,
      title: "Khadi India (KVIC)",
      text: "Approved Training Centre under Khadi and Village Industries Commission, Government of India.",
    },
    {
      icon: <FaUniversity className="text-3xl  text-[#310000]/90" />,
      title: "Local Self Government Department (LSGD)",
      text: "Registered and approved under the Government of Kerala for certified training programs.",
    },
    {
      icon: <FaFemale className="text-3xl  text-[#310000]/90" />,
      title: "Women & Child Development Dept.",
      text: "Recognized for advancing women’s vocational skills and rural empowerment.",
    },
    {
      icon: <FaIndustry className="text-3xl  text-[#310000]/90" />,
      title: "MSME Certification",
      text: "Certified under both Service and Manufacturing sectors — UDYAM-KL-10-0002138 & UDYAM-KL-10-0033882.",
    },
    {
      icon: <FaHandshake className="text-3xl  text-[#310000]/90" />,
      title: "Skill Development Collaborations",
      text: "Partnered with multiple national and state-level organizations to expand skill training initiatives.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f9f8f6] font-sans">
      {/* HERO SECTION */}
      <section
        className="relative text-center py-24 px-6 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://www.gujarattourism.com/content/dam/gujrattourism/images/other-images/handicraft/Warli-Painting-banner.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[#310000]/80"></div>
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

      {/* STORY SECTION */}
<section className="container mx-auto px-6 lg:px-20 py-24 grid grid-cols-1 lg:grid-cols-[35%_65%] gap-12 items-center">
  {/* Left Side: Image */}
  <div className="overflow-hidden shadow-xl h-[300px] lg:h-[560px] ">
    <img
      src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrzlSliZQi25JMEHnHu4thjX6oMM0pnfOJP1oTNgozgPPTKm9vC44RNvLkq-gcZZybqYdap0mBtJzlh7l99zldSPVWv8Za-M4FjRGUirTtpz9ngwCGUdEmp36qhL7KG5y3y0uat=s1360-w1360-h1020-rw"
      alt="Apsara Institute Training Center"
      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
    />
  </div>

  {/* Right Side: Content */}
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
          {/* Vision */}
          <div>
            <h3 className="text-3xl font-serif text-[#310000] mb-5 border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
              Our Vision
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              To nurture a society where skill, creativity, and culture move hand
              in hand — building a generation that values craftsmanship as much
              as innovation. Apsara Institute envisions becoming a beacon of
              empowerment that transforms traditional arts into sustainable
              livelihoods, connecting India’s rich heritage with the modern
              world.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              We aspire to create opportunities for every learner, especially
              women and youth, to stand strong through knowledge, dignity, and
              self-reliant success.
            </p>
          </div>

          {/* Mission */}
          <div>
            <h3 className="text-3xl font-serif text-[#310000] mb-5 border-b-2 border-[#3A2D2D]/20 inline-block pb-2">
              Our Mission
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              To deliver accessible, inclusive, and high-quality skill
              development programs that empower individuals to become creators,
              innovators, and entrepreneurs. We are dedicated to preserving
              heritage crafts, supporting artisans, and promoting eco-conscious
              production methods.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              By blending traditional expertise with modern education and
              technology, Apsara Institute continues to shape confident
              individuals who uplift their communities and drive positive social
              and economic change.
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
