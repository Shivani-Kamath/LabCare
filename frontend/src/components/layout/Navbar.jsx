/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

export default function Navbar() {
  return (
    <nav className="lc-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-brand text-white flex items-center justify-center font-bold">LC</div>
          <span className="font-semibold text-ink">LabCare</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-neutral-700">
          <Link to="/student" className="hover:text-ink">Student</Link>
          <Link to="/technician" className="hover:text-ink">Technician</Link>
          <Link to="/labincharge" className="hover:text-ink">Lab Incharge</Link>
          <Link to="/admin" className="hover:text-ink">Admin</Link>
        </div>
        <div className="flex items-center gap-2">
          <Button as={Link} to="/" variant="outline" className="hidden md:inline-flex">Login</Button>
        </div>
      </div>
    </nav>
  );
}


