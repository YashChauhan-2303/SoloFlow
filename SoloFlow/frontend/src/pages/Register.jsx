import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Mail, Lock, Building2, UserPlus, Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '../components/ui';
import '../App.css';

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    symbol: false,
  });

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    const checks = {
      length: val.length >= 8 && val.length <= 20,
      upper: /[A-Z]/.test(val),
      lower: /[a-z]/.test(val),
      number: /\d/.test(val),
      symbol: /[\W_]/.test(val),
    };
    setPasswordChecks(checks);
    setVerifyPassword(Object.values(checks).every(Boolean));
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [verifyPassword, setVerifyPassword] = useState();
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [formLoaded, setFormLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFormLoaded(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newUser = {
      user_name: name,
      user_email: email,
      user_password: password,
      user_company: company
    };

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      const res = await response.json();
      if (response.status === 201) {
        toast.success(`${res.message}`);
        navigate("/login");
      } else {
        toast.error(`${res.message}`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0a0f] text-slate-100 flex items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="sf-dot-grid" />
      <div className="noise-overlay absolute inset-0 opacity-[0.02] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={formLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md z-10 animate-fade-in"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-xl shadow-violet-500/20 mb-4"
          >
            <span className="text-xl font-bold text-white select-none">S</span>
          </motion.div>
          <h2 className="text-3xl font-bold text-white tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Create your SoloFlow Account
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Join SoloFlow to streamline your freelancing workflow
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-purple-500/5 p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              placeholder="John Doe"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
              icon={User}
              required
            />

            <Input
              label="Email"
              placeholder="name@company.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              icon={Mail}
              required
            />

            <div>
              <Input
                label="Password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setPasswordTouched(true)}
                icon={Lock}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-200 transition-colors p-1"
                    tabIndex={-1}
                    aria-label="Toggle Password"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              {/* Password rule indicators */}
              {passwordTouched && (
                <div className="mt-3 text-sm space-y-1">
                  <p className={passwordChecks.length ? "text-emerald-400" : "text-red-400"}>
                    {passwordChecks.length ? "✔ At least 8 characters" : "✘ At least 8 characters"}
                  </p>
                  <p className={passwordChecks.upper ? "text-emerald-400" : "text-red-400"}>
                    {passwordChecks.upper ? "✔ At least one uppercase letter" : "✘ At least one uppercase letter"}
                  </p>
                  <p className={passwordChecks.lower ? "text-emerald-400" : "text-red-400"}>
                    {passwordChecks.lower ? "✔ At least one lowercase letter" : "✘ At least one lowercase letter"}
                  </p>
                  <p className={passwordChecks.number ? "text-emerald-400" : "text-red-400"}>
                    {passwordChecks.number ? "✔ At least one number" : "✘ At least one number"}
                  </p>
                  <p className={passwordChecks.symbol ? "text-emerald-400" : "text-red-400"}>
                    {passwordChecks.symbol ? "✔ At least one special character" : "✘ At least one special character"}
                  </p>
                </div>
              )}
            </div>

            <Input
              label="Company Name"
              placeholder="Acme Corporation"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              name="company"
              icon={Building2}
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loading}
              icon={UserPlus}
            >
              Sign Up
            </Button>
          </form>

          {/* Redirect link */}
          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-violet-400 hover:text-violet-300 hover:underline transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;