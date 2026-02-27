/* eslint-disable react/prop-types */
export default function Card({ className = '', children }) {
  return <div className={`lc-card p-6 ${className}`}>{children}</div>;
}


