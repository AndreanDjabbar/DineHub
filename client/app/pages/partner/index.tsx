import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  FiCheckCircle,
  FiUsers,
  FiTrendingUp,
  FiShield,
  FiSmartphone,
  FiClock,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import Button from "../components/Button";

const PartnerPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    phone: "",
    location: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement partner registration API call
    console.log("Partner form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-red-600 to-red-700 text-white py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-bold">Partner with DineHub</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Grow Your Restaurant Business
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
              Join hundreds of restaurants streamlining their operations with
              our modern POS and ordering system
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Partner with Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
              <div className="bg-red-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <FiTrendingUp className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Increase Revenue</h3>
              <p className="text-gray-600">
                Streamline orders and reduce wait times to serve more customers
                and boost your sales by up to 30%.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
              <div className="bg-red-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <FiUsers className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                Better Customer Experience
              </h3>
              <p className="text-gray-600">
                Provide seamless ordering, real-time updates, and personalized
                service to delight your customers.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
              <div className="bg-red-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <FiSmartphone className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Modern Technology</h3>
              <p className="text-gray-600">
                Cloud-based POS system accessible from any device, anywhere,
                anytime with real-time sync.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
              <div className="bg-red-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <FiClock className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Save Time</h3>
              <p className="text-gray-600">
                Automate operations, manage staff efficiently, and focus on what
                matters - great food and service.
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
              <div className="bg-red-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <FiShield className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Reliable</h3>
              <p className="text-gray-600">
                Enterprise-grade security with daily backups and 99.9% uptime
                guarantee for peace of mind.
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition">
              <div className="bg-red-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <FiCheckCircle className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Easy to Use</h3>
              <p className="text-gray-600">
                Intuitive interface with minimal training required. Get your
                team up and running in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything You Need to Succeed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Digital Menu Management",
              "Real-time Order Tracking",
              "Kitchen Display System",
              "Staff Management",
              "Sales Analytics & Reports",
              "Table Management",
              "Inventory Management",
              "QR Code Ordering",
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg border border-gray-100 hover:border-red-500 transition"
              >
                <FiCheckCircle className="text-red-600 text-xl shrink-0" />
                <span className="font-medium text-gray-800">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-100 mx-auto">
          <div className="text-center mb-12">
            <Button onClick={() => navigate("/partner-payment")}>
              Join Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnerPage;
