import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button, Input } from "../components/ui";
import { getApiUrl } from "../utils/api";

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    const loginUser = {
      useremail: email,
      password: password,
    };

    try {
      const response = await fetch(getApiUrl('login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginUser)
      });

      const res = await response.json();

      if (!response.ok) {
        toast.error(res.message);
        return;
      } else {
        toast.success(res.message);
        localStorage.setItem("token", res.token);
        localStorage.setItem("user_id", res.user._id);
        navigate(`/${res.user._id}/dashboard`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordHandler = (e) => {
    setPassword(e.target.value);
    if (
      e.target.value.length < 8 ||
      e.target.value.length > 20 ||
      e.target.value.includes(" ") ||
      !/[A-Z]/.test(e.target.value) || // at least one uppercase
      !/[a-z]/.test(e.target.value) || // at least one lowercase
      !/\d/.test(e.target.value) || // at least one digit
      !/[\W_]/.test(e.target.value)
    ) {
      setVerifyPassword(false);
    } else {
      setVerifyPassword(true);
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
        className="w-full max-w-md z-10"
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
            Welcome back
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Enter your credentials to access your workspace
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-purple-500/5 p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email address"
              placeholder="name@company.com"
              type="email"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <div>
              <Input
                label="Password"
                placeholder="••••••••"
                type={show ? "text" : "password"}
                value={password}
                onChange={passwordHandler}
                onFocus={() => setPasswordTouched(true)}
                name="password"
                icon={Lock}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="text-slate-400 hover:text-slate-200 transition-colors p-1"
                    tabIndex={-1}
                    aria-label="Toggle Password"
                  >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              {/* Password rules box when not matched */}
              {!verifyPassword && passwordTouched && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-4 py-2.5 mt-3 text-xs leading-relaxed"
                >
                  Password must be 8-20 characters long and include:
                  <ul className="list-disc list-inside mt-1 space-y-0.5 opacity-90">
                    <li>At least one uppercase letter (A-Z)</li>
                    <li>At least one lowercase letter (a-z)</li>
                    <li>At least one digit (0-9)</li>
                    <li>At least one special character (e.g. !@#$)</li>
                    <li>No spaces</li>
                  </ul>
                </motion.div>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={loading}
              icon={ArrowRight}
            >
              Log In
            </Button>
          </form>

          {/* Redirect link */}
          <div className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-violet-400 hover:text-violet-300 hover:underline transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;