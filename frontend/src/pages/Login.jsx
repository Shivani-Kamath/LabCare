// pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import frontbackground from "../assets/frontbackground.jpg";
import alvasLogo from "../assets/alvas_logo.jpg";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [fpEmail, setFpEmail] = useState("");
  const [fpNew, setFpNew] = useState("");
  const [fpConfirm, setFpConfirm] = useState("");
  const [fpLoading, setFpLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      const user = res.data.user;
      const role = user.role;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", role);
      alert("Login Successful ✅");

      if (role === "student") navigate("/student");
      else if (role === "technician") navigate("/technician");
      else if (role === "lab_incharge") navigate("/labincharge");
    } catch (err) {
      alert("Login Failed ❌");
    }
  };

  const handleAdmin = async () => {
    const pwd = prompt('Enter admin password');
    if (!pwd) return;
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { password: pwd });
      if (res.status === 200) {
        localStorage.setItem('role', 'admin');
        navigate('/admin');
      }
    } catch (e) {
      alert('Invalid admin password');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${frontbackground})` }}
    >
      <Card className="w-full max-w-lg bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl p-8">
        <div className="text-center mb-8 relative">
          <Button variant="ghost" onClick={handleAdmin} className="absolute top-0 right-0 text-xs text-brand-600 hover:text-brand-700">Admin</Button>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
            <img src={alvasLogo} alt="Alvas Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-3xl font-bold text-ink">
            Welcome Back
          </h2>
          <p className="text-neutral-700 mt-2">Sign in to your LabCare account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-neutral-200 p-4 rounded-xl focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-200 placeholder-neutral-400 bg-white/80"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-neutral-200 p-4 rounded-xl focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-200 placeholder-neutral-400 bg-white/80"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-brand border-neutral-300 rounded focus:ring-brand" />
              <span className="ml-2 text-neutral-700">Remember me</span>
            </label>
            <button type="button" onClick={() => setShowForgot(true)} className="text-brand-600 hover:text-brand-700 font-semibold hover:underline transition-colors duration-200">
              Forgot password?
            </button>
          </div>

          <Button type="submit" className="w-full py-3">Sign In</Button>

          {/* Register removed as per requirements */}

          <div className="text-center">
            <p className="text-xs text-neutral-600">
              By signing in, you agree to our{' '}
              <a href="#" className="text-brand-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-brand-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </form>
      </Card>

      {showForgot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-md w-full max-w-md rounded-xl shadow-xl p-6 border border-white/40">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Reset Password</h3>
              <button onClick={() => { setShowForgot(false); setFpEmail(""); setFpNew(""); setFpConfirm(""); }} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email (username)"
                value={fpEmail}
                onChange={(e) => setFpEmail(e.target.value)}
                className="w-full border-2 border-neutral-200 p-3 rounded-lg focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <input
                type="password"
                placeholder="New password"
                value={fpNew}
                onChange={(e) => setFpNew(e.target.value)}
                className="w-full border-2 border-neutral-200 p-3 rounded-lg focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={fpConfirm}
                onChange={(e) => setFpConfirm(e.target.value)}
                className="w-full border-2 border-neutral-200 p-3 rounded-lg focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
              <button
                disabled={fpLoading}
                onClick={async () => {
                  if (!fpEmail || !fpNew || !fpConfirm) { alert('Please fill all fields'); return; }
                  if (fpNew !== fpConfirm) { alert('Passwords do not match'); return; }
                  try {
                    setFpLoading(true);
                    const res = await axios.post('http://localhost:5000/api/users/forgot-password', { email: fpEmail, newPassword: fpNew });
                    if (res.status === 200) {
                      alert('Password updated. Please sign in with your new password.');
                      setShowForgot(false);
                      setFpEmail(""); setFpNew(""); setFpConfirm("");
                    }
                  } catch (e) {
                    alert(e.response?.data?.error || 'Failed to reset password');
                  } finally {
                    setFpLoading(false);
                  }
                }}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg disabled:opacity-60"
              >
                {fpLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;