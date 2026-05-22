import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Zap,
  Shield,
  BarChart3,
  Users,
  Workflow,
  ArrowUpRight,
  Mail,
  Phone,
  Share2,
  DollarSign,
  Play,
  ArrowRight
} from 'lucide-react';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import img2_girl from '../assets/img2_girl.jpg';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button, Card, Badge } from '../components/ui';
import { PageContainer } from '../components/layouts';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const scaleUp = {
  hidden: { scale: 0.96, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
  }
};

function ShareProject() {
  const shareUrl = "https://github.com/HackSomeThorns-2025/ManipalSuperKings";
  const shareTitle = "Configure your freelance hustle using SoloFlow!";

  return (
    <div className="py-8 text-center">
      <motion.h3 
        variants={itemVariants} 
        className="text-lg font-semibold text-slate-200 mb-2"
      >
        Spread the word
      </motion.h3>
      <motion.p 
        variants={itemVariants} 
        className="text-sm text-slate-400 mb-6 max-w-md mx-auto"
      >
        Share SoloFlow with your fellow freelancers, solopreneurs, and student builders.
      </motion.p>
      
      <motion.div 
        variants={containerVariants} 
        className="flex gap-4 justify-center flex-wrap"
      >
        <motion.div variants={itemVariants} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
          <FacebookShareButton url={shareUrl} quote={shareTitle}>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-blue-600/90 hover:bg-blue-600 text-white rounded-xl text-sm font-medium shadow-md shadow-blue-600/10 transition-all duration-200 cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </div>
          </FacebookShareButton>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
          <TwitterShareButton 
            url={shareUrl} 
            title={shareTitle}
            hashtags={['Freelancing', 'Solopreneur', 'SoloFlow', 'OpenSource']}
          >
            <div className="flex items-center gap-2 px-5 py-2.5 bg-sky-500/90 hover:bg-sky-500 text-white rounded-xl text-sm font-medium shadow-md shadow-sky-500/10 transition-all duration-200 cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </div>
          </TwitterShareButton>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
          <WhatsappShareButton url={shareUrl} title={shareTitle}>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/90 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium shadow-md shadow-emerald-500/10 transition-all duration-200 cursor-pointer">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              WhatsApp
            </div>
          </WhatsappShareButton>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-slate-100 overflow-x-hidden">
      {/* Noise background */}
      <div className="noise-overlay" />

      {/* Decorative Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -80, 40, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] bg-purple-600/10 rounded-full filter blur-[120px] opacity-40"
        />
        <motion.div
          animate={{
            x: [0, -80, 40, 0],
            y: [0, 80, -40, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full filter blur-[140px] opacity-40"
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="pt-20 pb-16 md:pt-28 md:pb-24">
            <PageContainer>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Hero Content */}
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="lg:col-span-7 space-y-6 text-left"
                >
                  <motion.div variants={itemVariants}>
                    <Badge variant="primary" size="sm" icon={Zap}>
                      One App. Your Entire Hustle.
                    </Badge>
                  </motion.div>

                  <motion.h1 
                    variants={itemVariants}
                    className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05]"
                  >
                    Simplify your freelance{' '}
                    <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                      workflow.
                    </span>
                  </motion.h1>

                  <motion.p 
                    variants={itemVariants}
                    className="text-base sm:text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed"
                  >
                    Designed for solo creators, student entrepreneurs, and self-starters.
                    Keep track of tasks, manage client relationships, and automatically generate professional invoices.
                  </motion.p>

                  <motion.div 
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-4 pt-2"
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => navigate('/register')}
                      icon={ArrowRight}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => navigate('/login')}
                    >
                      Sign In
                    </Button>
                  </motion.div>

                  {/* Hero Stats */}
                  <motion.div 
                    variants={itemVariants}
                    className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-900"
                  >
                    {[
                      { label: 'Active Users', value: '1.2K+' },
                      { label: 'Tasks Mapped', value: '45K+' },
                      { label: 'Invoices Sent', value: '$800K+' },
                    ].map((stat, i) => (
                      <div key={i} className="text-left">
                        <div className="text-2xl sm:text-3xl font-extrabold text-violet-400 tracking-tight">{stat.value}</div>
                        <div className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Hero Graphical Showcase */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="lg:col-span-5 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-indigo-500/20 blur-2xl rounded-3xl" />
                  
                  {/* Hero Image frame */}
                  <div className="relative border border-slate-800 rounded-3xl overflow-hidden shadow-2xl bg-slate-950/80 p-3">
                    <img 
                      src={img2_girl} 
                      alt="SoloFlow Showcase" 
                      className="w-full h-80 sm:h-[400px] object-cover rounded-2xl filter brightness-90 contrast-105"
                    />
                    
                    {/* Floating badge */}
                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-slate-950/90 backdrop-blur-xl border border-white/[0.06] rounded-2xl shadow-xl flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-violet-600/10 flex items-center justify-center border border-violet-500/20">
                        <DollarSign className="text-violet-400" size={20} />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-xs text-slate-500 font-medium">Monthly Revenue</p>
                        <p className="text-sm font-bold text-slate-100">$6,450.00</p>
                      </div>
                      <Badge variant="success" size="xs">
                        +14%
                      </Badge>
                    </div>
                  </div>
                </motion.div>

              </div>
            </PageContainer>
          </section>

          {/* Description Section */}
          <section className="py-16 md:py-24 border-t border-slate-950 relative" id="about">
            <PageContainer>
              <div className="max-w-4xl mx-auto text-center space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <Badge variant="info" size="sm">
                    All-in-One Command Center
                  </Badge>
                  <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
                    Bring your projects to life — without the chaos.
                  </h2>
                  <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                    SoloFlow simplifies your work. Built directly on top of developer-first and creator-centric tools, it delivers an intuitive dashboard where you can build task lists, register project clients, measure task billables, and automatically issue high-quality PDF invoices in seconds.
                  </p>
                </motion.div>
              </div>
            </PageContainer>
          </section>

          {/* Features Grid */}
          <section className="py-16 md:py-24 relative" id="features">
            <PageContainer>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: DollarSign,
                    title: "Invoicing",
                    desc: "Generate professional billing records in one click. Custom templates and PDF rendering built in.",
                    color: "group-hover:text-emerald-400"
                  },
                  {
                    icon: Zap,
                    title: "Task Management",
                    desc: "Visual Kanban board tracking active backlog, tasks in progress, and billing updates.",
                    color: "group-hover:text-amber-400"
                  },
                  {
                    icon: Users,
                    title: "Client Profiles",
                    desc: "Maintain detailed directories of clients, associated companies, contracts, and contacts.",
                    color: "group-hover:text-sky-400"
                  },
                  {
                    icon: BarChart3,
                    title: "Productivity Metrics",
                    desc: "Track completed milestones, invoice amounts, and project income over custom timelines.",
                    color: "group-hover:text-violet-400"
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="group"
                  >
                    <Card
                      variant="default"
                      className="h-full p-6 bg-slate-900/40 hover:bg-slate-800/30 border border-slate-900 hover:border-slate-800 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center mb-4 transition-all duration-300 group-hover:border-violet-500/30 group-hover:bg-violet-600/10">
                        <item.icon size={20} className="text-slate-400 transition-colors duration-300 group-hover:text-violet-400" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-violet-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </PageContainer>
          </section>

          {/* Sharing Section */}
          <section className="py-12 border-t border-slate-950">
            <PageContainer>
              <div className="max-w-2xl mx-auto">
                <Card variant="minimal" className="p-6 bg-slate-950/20 border border-slate-900/60 rounded-2xl">
                  <ShareProject />
                </Card>
              </div>
            </PageContainer>
          </section>

          {/* Contact Us Section */}
          <section className="py-16 md:py-24" id="contact">
            <PageContainer>
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-500/20 p-8 sm:p-12 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 filter blur-2xl rounded-full" />
                
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mb-4 tracking-tight">
                  Get in Touch
                </h2>
                <p className="text-slate-400 text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
                  Have questions, feature requests, or need technical support? We'd love to help you configure your workflow.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm sm:text-base font-semibold">
                  <a 
                    href="mailto:soloflow@gmail.com"
                    className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200 hover:text-violet-400 hover:border-violet-500/40 transition-all duration-200"
                  >
                    <Mail size={18} className="text-violet-400" />
                    soloflow@gmail.com
                  </a>
                  <a 
                    href="tel:+919696969696"
                    className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200 hover:text-emerald-400 hover:border-emerald-500/40 transition-all duration-200"
                  >
                    <Phone size={18} className="text-emerald-400" />
                    +91 96969 69696
                  </a>
                </div>
              </motion.div>
            </PageContainer>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default Landing;