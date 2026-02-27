  import { useState } from 'react';
  import axios from 'axios';
  import { Link } from 'react-router-dom';
  import Card from '../components/ui/Card';
  import Button from '../components/ui/Button';
  import LogoutButton from '../components/ui/LogoutButton';

  const Register = () => {
    const [form, setForm] = useState({
      full_name: '',
      email: '',
      phone: '',
      role: 'student',
      password: '',
    });

    const handleChange = (e) =>
      setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.post('http://localhost:5000/api/users/register', form);
        alert('Registration successful!');
      } catch (err) {
        alert('Registration failed.');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-canvas to-neutral-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <div className="text-center mb-8 relative">
            <LogoutButton className="absolute top-0 right-0" />
            <h1 className="text-3xl font-bold text-ink">Join LabCare</h1>
            <p className="text-neutral-600 mt-2">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="lc-label">Full Name</label>
              <input
                type="text"
                name="full_name"
                className="lc-input"
                placeholder="Enter your full name"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="lc-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="lc-input"
                placeholder="Enter your email"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="lc-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="lc-input"
                placeholder="Enter your phone number"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="lc-label">Role</label>
              <select
                name="role"
                onChange={handleChange}
                className="lc-input"
              >
                <option value="student">Student</option>
                <option value="technician">Technician</option>
                <option value="lab_incharge">Lab Incharge</option>
              </select>
            </div>

            <div>
              <label className="lc-label">Password</label>
              <input
                type="password"
                name="password"
                className="lc-input"
                placeholder="Create a password"
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700"
            >
              Create Account
            </Button>

            <div className="text-center">
              <p className="text-sm text-neutral-600">
                Already have an account?{' '}
                <Link to="/" className="text-brand-600 hover:text-brand-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    );
  };

  export default Register;
