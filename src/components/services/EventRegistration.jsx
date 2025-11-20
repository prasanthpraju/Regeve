 // components/ServicesWebsite.jsx
import React from 'react';
import { QrCode, Gift, Utensils, BarChart2, ArrowRight } from 'lucide-react';

const EventRegistration = () => {
  const services = [
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "Event Registration",
      description: "Streamline attendee registration with QR code integration for seamless check-ins and digital ticketing.",
      features: [
        "QR Code Registration",
        "Digital Ticket Management",
        "Real-time Check-in Tracking",
        "Attendee Data Collection"
      ],
      color: "blue"
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Lucky Draw System",
      description: "Engage attendees with fair and transparent lucky draws featuring automated selection and winner management.",
      features: [
        "Participant Management",
        "Random Selection Algorithm",
        "Live Winner Display",
        "Prize Distribution Tracking"
      ],
      color: "purple"
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      title: "Food Management",
      description: "Track food consumption and manage catering services with real-time monitoring and waste reduction analytics.",
      features: [
        "Meal Category Planning",
        "Consumption Tracking",
        "Dietary Requirement Management",
        "Waste Analytics"
      ],
      color: "green"
    },
    {
      icon: <BarChart2 className="w-8 h-8" />,
      title: "Event Dashboard",
      description: "Comprehensive overview of event metrics including registration, attendance, and activity participation.",
      features: [
        "Real-time Analytics",
        "Attendance Monitoring",
        "System Status Overview",
        "Performance Reporting"
      ],
      color: "orange"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'bg-blue-100 text-blue-600',
        border: 'border-blue-200'
      },
      purple: {
        bg: 'bg-purple-50',
        icon: 'bg-purple-100 text-purple-600',
        border: 'border-purple-200'
      },
      green: {
        bg: 'bg-green-50',
        icon: 'bg-green-100 text-green-600',
        border: 'border-green-200'
      },
      orange: {
        bg: 'bg-orange-50',
        icon: 'bg-orange-100 text-orange-600',
        border: 'border-orange-200'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-white pt-24 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
           Event Registration
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools to manage every aspect of your event, from registration to analytics
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => {
            const colorClasses = getColorClasses(service.color);
            return (
              <div 
                key={index} 
                className={`${colorClasses.bg} rounded-xl p-8 border ${colorClasses.border} hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${colorClasses.icon}`}>
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="mt-6 flex items-center text-gray-700 hover:text-gray-900 font-medium text-sm">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-2">500+</div>
            <div className="text-gray-600 text-sm">Events Managed</div>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-2">95%</div>
            <div className="text-gray-600 text-sm">Client Satisfaction</div>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-2">50K+</div>
            <div className="text-gray-600 text-sm">Attendees Served</div>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-2">24/7</div>
            <div className="text-gray-600 text-sm">Support Available</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Discover how our event management solutions can streamline your next event.
            </p>
            <button className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
              Request Demo
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventRegistration;