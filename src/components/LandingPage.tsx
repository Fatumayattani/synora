import React from 'react';
import { ArrowRight, Users, Zap, Shield, Code, CheckCircle, Star, Github, Twitter } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Logo and Badge */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center shadow-2xl">
                <Users className="w-7 h-7 text-yellow-400" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-black">Governance Generator</h1>
                <p className="text-sm text-black/90 font-medium">Powered by Somnia</p>
              </div>
            </div>

            {/* Main Headline */}
            <div className="max-w-4xl mx-auto mb-8">
              <h2 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
                Make DAO Governance
                <span className="bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent"> Accessible</span>
              </h2>
              <p className="text-xl text-black/90 leading-relaxed max-w-2xl mx-auto">
                Transform complex smart contract proposals into simple forms. No coding required, 
                just point, click, and govern your DAO with confidence.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
              <button
                onClick={onGetStarted}
                className="group bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-yellow-400 px-10 py-4 rounded-3xl font-semibold text-lg transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 flex items-center space-x-2"
              >
                <span>Create Proposal</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="text-black hover:text-black px-8 py-4 rounded-3xl font-semibold text-lg transition-all duration-200 border-2 border-black/30 hover:border-black/50 bg-black/10 backdrop-blur-md hover:bg-black/20 shadow-xl">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-black/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-black mb-4">
              Everything you need for DAO governance
            </h3>
            <p className="text-lg text-black/90 max-w-2xl mx-auto">
              From treasury management to protocol upgrades, create any governance proposal 
              with our intuitive template system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Treasury Transfers',
                description: 'Send tokens from DAO treasury to any address with automatic validation',
                icon: '💰',
                color: 'bg-gradient-to-br from-black to-gray-800 text-yellow-400'
              },
              {
                title: 'Parameter Updates',
                description: 'Modify protocol settings like fees, rates, and limits safely',
                icon: '⚙️',
                color: 'bg-gradient-to-br from-gray-800 to-black text-yellow-400'
              },
              {
                title: 'Role Management',
                description: 'Grant or revoke admin roles and permissions across contracts',
                icon: '👥',
                color: 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black'
              },
              {
                title: 'Contract Upgrades',
                description: 'Upgrade proxy contracts to new implementations with confidence',
                icon: '🔧',
                color: 'bg-gradient-to-br from-gray-700 to-black text-yellow-400'
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-black/10 backdrop-blur-md hover:bg-black/20 border border-black/20 hover:border-black/40 rounded-3xl p-6 transition-all duration-200 hover:shadow-2xl hover:scale-105">
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                  {feature.icon}
                </div>
                <h4 className="font-semibold text-black mb-2">{feature.title}</h4>
                <p className="text-black/80 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-20 bg-black/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-black mb-4">
              Three steps to perfect proposals
            </h3>
            <p className="text-lg text-black/90">
              Our streamlined process makes governance participation effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose Template',
                description: 'Select from pre-built templates for common governance actions',
                icon: '📋'
              },
              {
                step: '02',
                title: 'Fill Parameters',
                description: 'Enter details like addresses, amounts, and settings in simple forms',
                icon: '✏️'
              },
              {
                step: '03',
                title: 'Submit & Vote',
                description: 'Review, simulate, and submit your proposal to the DAO',
                icon: '🗳️'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-black/20 backdrop-blur-md rounded-3xl shadow-2xl flex items-center justify-center mx-auto text-3xl mb-4">
                    {step.icon}
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-black mb-3">{step.title}</h4>
                <p className="text-black/80 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-20 bg-black/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-bold text-black mb-6">
                Why choose our platform?
              </h3>
              <div className="space-y-6">
                {[
                  {
                    title: 'No Technical Knowledge Required',
                    description: 'Create complex proposals using simple, intuitive forms'
                  },
                  {
                    title: 'Error-Free Execution',
                    description: 'Built-in validation prevents common mistakes that cause proposal failures'
                  },
                  {
                    title: 'Somnia Native',
                    description: 'Optimized for Somnia blockchain with native wallet integration'
                  },
                  {
                    title: 'Multi-Action Bundling',
                    description: 'Combine multiple operations into a single proposal for efficiency'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                      <CheckCircle className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-black mb-1">{benefit.title}</h4>
                      <p className="text-black/80">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-black to-gray-800 rounded-3xl p-8 text-yellow-400 shadow-2xl">
                <div className="text-center">
                  <Star className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                  <h4 className="text-2xl font-bold mb-4">Ready to get started?</h4>
                  <p className="text-yellow-400/90 mb-6">
                    Join the future of DAO governance on Somnia
                  </p>
                  <button
                    onClick={onGetStarted}
                    className="bg-yellow-400 text-black hover:bg-yellow-300 px-8 py-3 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Create Your First Proposal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-md text-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="font-bold text-black">Governance Generator</div>
                <div className="text-sm text-black/70">Powered by Somnia</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-black/70 hover:text-black transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-black/70 hover:text-black transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <div className="text-black/70 text-sm">
                Built for Somnia Hackathon 2025
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;