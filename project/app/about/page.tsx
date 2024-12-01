"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { LinkedinIcon, GithubIcon, TwitterIcon } from "lucide-react";

// Sample employee data
const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    bio: "Visionary leader with 15 years of e-commerce experience, passionate about creating innovative shopping solutions.",
    image: "https://freeparalegal.org/wp-content/uploads/2023/08/July-1536x1024-1.jpg",
    socials: {
      linkedin: "#",
      github: "#",
      twitter: "#"
    }
  },
  {
    name: "Lased Bliss",
    role: "Chief Technology Officer",
    bio: "Tech genius driving our platform's cutting-edge technological innovations and user experience.",
    image: "https://media.istockphoto.com/id/1300972574/photo/millennial-male-team-leader-organize-virtual-workshop-with-employees-online.jpg?s=612x612&w=0&k=20&c=uP9rKidKETywVil0dbvg_vAKyv2wjXMwWJDNPHzc_Ug=",
    socials: {
      linkedin: "https://www.linkedin.com/in/las3ed-bliss/",
      github: "#",
      twitter: "#"
    }
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Customer Experience",
    bio: "Customer-first advocate ensuring every interaction meets our highest standards of satisfaction.",
    image: "https://media.istockphoto.com/id/1303539316/photo/one-beautiful-woman-looking-at-the-camera-in-profile.jpg?s=612x612&w=0&k=20&c=zzAlaDFbbaVuRG3he04Jk7ul7uRcgZMWU65yRfImA94=",
    socials: {
      linkedin: "#",
      github: "#",
      twitter: "#"
    }
  }
];

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 lg:pt-32 pb-16 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Our Story, Our Passion
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Founded with a mission to revolutionize online shopping, we're committed to delivering exceptional products and unparalleled customer experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We believe in creating a seamless, enjoyable shopping experience that empowers customers to discover, explore, and purchase products that enhance their lives. Our commitment to quality, innovation, and customer satisfaction drives everything we do.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={ref} className="py-16 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
            }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  variants={fadeInUp}
                  className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105"
                >
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-indigo-600 mb-4">{member.role}</p>
                    <p className="text-gray-600 mb-4">{member.bio}</p>
                    <div className="flex justify-center space-x-4">
                      <a href={member.socials.linkedin} className="text-gray-500 hover:text-indigo-600">
                        <LinkedinIcon className="h-6 w-6" />
                      </a>
                      <a href={member.socials.github} className="text-gray-500 hover:text-indigo-600">
                        <GithubIcon className="h-6 w-6" />
                      </a>
                      <a href={member.socials.twitter} className="text-gray-500 hover:text-indigo-600">
                        <TwitterIcon className="h-6 w-6" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={fadeInUp}
              className="text-center p-6 bg-indigo-50 rounded-lg"
            >
              <h3 className="text-xl font-semibold mb-4 text-indigo-600">Innovation</h3>
              <p className="text-gray-600">Constantly pushing boundaries and exploring new technologies</p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="text-center p-6 bg-indigo-50 rounded-lg"
            >
              <h3 className="text-xl font-semibold mb-4 text-indigo-600">Integrity</h3>
              <p className="text-gray-600">Maintaining the highest standards of honesty and transparency</p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="text-center p-6 bg-indigo-50 rounded-lg"
            >
              <h3 className="text-xl font-semibold mb-4 text-indigo-600">Customer First</h3>
              <p className="text-gray-600">Dedicated to providing exceptional experiences and support</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}