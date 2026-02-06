import React, { useState } from 'react';
import { Calendar, Zap, Shield, Users, ArrowRight, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const EventifyHomepage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMagicLink = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      alert(`✨ Magic link sent to ${email}!\n\nCheck your inbox for a secure login link.`);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    alert('🔐 Redirecting to Google OAuth...');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Sample recent events data
  const recentEvents = [
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      date: "March 15, 2024",
      time: "10:00 AM",
      location: "San Francisco, CA",
      attendees: 450,
      price: "Free",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      category: "Technology"
    },
    {
      id: 2,
      title: "Creative Design Workshop",
      date: "March 20, 2024",
      time: "2:00 PM",
      location: "New York, NY",
      attendees: 120,
      price: "$49",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
      category: "Design"
    },
    {
      id: 3,
      title: "Startup Networking Mixer",
      date: "March 25, 2024",
      time: "6:00 PM",
      location: "Austin, TX",
      attendees: 200,
      price: "Free",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
      category: "Business"
    },
    {
      id: 4,
      title: "Music & Arts Festival",
      date: "April 1, 2024",
      time: "12:00 PM",
      location: "Los Angeles, CA",
      attendees: 850,
      price: "$75",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
      category: "Entertainment"
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-800/50 bg-neutral-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100">
                <Calendar className="h-5 w-5 text-neutral-950" strokeWidth={2} />
              </div>
              <span className="text-lg font-semibold tracking-tight">Eventify</span>
            </div>
            
            <div className="hidden items-center space-x-8 md:flex">
              <button
                onClick={() => scrollToSection('events')}
                className="text-sm text-neutral-400 transition-colors hover:text-neutral-100"
              >
                Events
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-sm text-neutral-400 transition-colors hover:text-neutral-100"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('roles')}
                className="text-sm text-neutral-400 transition-colors hover:text-neutral-100"
              >
                Roles
              </button>
              <Button
                onClick={() => scrollToSection('login')}
                size="sm"
                className="bg-neutral-100 text-neutral-950 hover:bg-neutral-200"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/20 to-transparent"></div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Event Management
              <br />
              <span className="text-neutral-500">Made Simple</span>
            </h1>
            
            <p className="mx-auto mb-10 max-w-2xl text-lg text-neutral-400 sm:text-xl">
              Create, manage, and attend events with ease. A refined platform for organizers and attendees.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => scrollToSection('login')}
                className="bg-neutral-100 text-neutral-950 hover:bg-neutral-200 h-12 px-8"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('events')}
                className="border-neutral-700 bg-transparent text-neutral-100 hover:bg-neutral-900 hover:border-neutral-600 h-12 px-8"
              >
                Browse Events
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-neutral-800 pt-12">
              <div>
                <div className="text-3xl font-bold">10K+</div>
                <div className="mt-1 text-sm text-neutral-500">Attendees</div>
              </div>
              <div>
                <div className="text-3xl font-bold">250+</div>
                <div className="mt-1 text-sm text-neutral-500">Events</div>
              </div>
              <div>
                <div className="text-3xl font-bold">95%</div>
                <div className="mt-1 text-sm text-neutral-500">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Events Section */}
      <section id="events" className="py-20 sm:py-24 border-t border-neutral-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Recent Events
              </h2>
              <p className="text-neutral-500">
                Discover what's happening in your community
              </p>
            </div>
            <Button variant="ghost" className="hidden sm:flex text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recentEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-24 border-t border-neutral-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need
            </h2>
            <p className="text-neutral-500">
              Powerful features for seamless event management
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Secure Authentication"
              description="Magic link and OAuth login for hassle-free access."
            />
            <FeatureCard
              icon={<Calendar className="h-6 w-6" />}
              title="Easy Event Creation"
              description="Create and customize events in minutes."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Attendee Management"
              description="Track and engage with your audience effortlessly."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Real-time Updates"
              description="Keep everyone informed with instant notifications."
            />
            <FeatureCard
              icon={<MapPin className="h-6 w-6" />}
              title="Flexible Pricing"
              description="Support both free and paid events with ease."
            />
            <FeatureCard
              icon={<Clock className="h-6 w-6" />}
              title="Analytics Dashboard"
              description="Track performance with detailed insights."
            />
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-20 sm:py-24 border-t border-neutral-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Built for Everyone
            </h2>
            <p className="text-neutral-500">
              Different roles, tailored experiences
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <RoleCard
              title="Attendee"
              description="Discover and join events that matter to you"
              features={[
                'Browse curated events',
                'Join free events instantly',
                'Secure ticket purchasing',
                'Personal dashboard',
                'Event reminders'
              ]}
            />
            <RoleCard
              title="Organizer"
              description="Create and manage memorable experiences"
              features={[
                'Unlimited event creation',
                'Flexible pricing options',
                'Attendee management',
                'Email notifications',
                'Detailed analytics'
              ]}
              highlighted
            />
            <RoleCard
              title="Admin"
              description="Complete platform control and oversight"
              features={[
                'User management',
                'System configuration',
                'Platform analytics',
                'Content moderation',
                'Full administrative access'
              ]}
            />
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section id="login" className="py-20 sm:py-24 border-t border-neutral-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="mx-auto max-w-md border-neutral-800 bg-neutral-900/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Get Started</CardTitle>
              <CardDescription className="text-neutral-400">
                Create your account to begin managing events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 bg-neutral-950 border-neutral-800 focus:border-neutral-700"
                      required
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-neutral-100 text-neutral-950 hover:bg-neutral-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Send Magic Link
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-neutral-900 px-2 text-neutral-500">
                    or
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-neutral-800 bg-transparent hover:bg-neutral-800"
                onClick={handleGoogleLogin}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 20 20" fill="none">
                  <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
                  <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
                  <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
                  <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
                  <Calendar className="h-4 w-4 text-neutral-950" />
                </div>
                <span className="font-semibold">Eventify</span>
              </div>
              <p className="text-sm text-neutral-500">
                Simple event management for everyone
              </p>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><a href="#events" className="hover:text-neutral-300">Events</a></li>
                <li><a href="#features" className="hover:text-neutral-300">Features</a></li>
                <li><a href="#" className="hover:text-neutral-300">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><a href="#" className="hover:text-neutral-300">About</a></li>
                <li><a href="#" className="hover:text-neutral-300">Blog</a></li>
                <li><a href="#" className="hover:text-neutral-300">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><a href="#" className="hover:text-neutral-300">Privacy</a></li>
                <li><a href="#" className="hover:text-neutral-300">Terms</a></li>
                <li><a href="#" className="hover:text-neutral-300">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-neutral-900 pt-8 text-center">
            <p className="text-sm text-neutral-600">
              © 2024 Eventify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Event Card Component
const EventCard = ({ event }) => (
  <Card className="group overflow-hidden border-neutral-800 bg-neutral-900/50 transition-all hover:border-neutral-700">
    <div className="aspect-[16/10] overflow-hidden bg-neutral-800">
      <img 
        src={event.image} 
        alt={event.title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <CardContent className="p-5">
      <div className="mb-3 flex items-center justify-between">
        <Badge variant="secondary" className="bg-neutral-800 text-neutral-300 hover:bg-neutral-800">
          {event.category}
        </Badge>
        <span className="text-sm font-medium text-neutral-400">{event.price}</span>
      </div>
      <h3 className="mb-2 font-semibold line-clamp-2">{event.title}</h3>
      <div className="space-y-1 text-sm text-neutral-500">
        <div className="flex items-center">
          <Calendar className="mr-2 h-3.5 w-3.5" />
          {event.date}
        </div>
        <div className="flex items-center">
          <Clock className="mr-2 h-3.5 w-3.5" />
          {event.time}
        </div>
        <div className="flex items-center">
          <MapPin className="mr-2 h-3.5 w-3.5" />
          {event.location}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-neutral-800 pt-4">
        <span className="text-xs text-neutral-500">{event.attendees} attending</span>
        <Button size="sm" variant="ghost" className="h-8 text-xs hover:bg-neutral-800">
          Learn More
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <div className="group">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 transition-colors group-hover:border-neutral-700">
      {icon}
    </div>
    <h3 className="mb-2 font-semibold">{title}</h3>
    <p className="text-sm leading-relaxed text-neutral-500">{description}</p>
  </div>
);

// Role Card Component
const RoleCard = ({ title, description, features, highlighted }) => (
  <Card className={`border-neutral-800 ${highlighted ? 'bg-neutral-900' : 'bg-neutral-900/50'} transition-all hover:border-neutral-700`}>
    {highlighted && (
      <div className="border-b border-neutral-800 bg-neutral-800/50 px-6 py-2 text-center">
        <span className="text-xs font-medium text-neutral-400">Most Popular</span>
      </div>
    )}
    <CardHeader>
      <CardTitle className="text-xl">{title}</CardTitle>
      <CardDescription className="text-neutral-500">{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2.5">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-sm">
            <span className="mr-2 mt-0.5 text-neutral-500">•</span>
            <span className="text-neutral-400">{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default EventifyHomepage;