/* eslint-disable react/prop-types */
export default function Button({ variant = 'primary', className = '', ...props }) {
  const map = {
    primary: 'lc-btn-primary',
    ghost: 'lc-btn-ghost',
    outline: 'lc-btn bg-white text-brand border border-brand hover:bg-brand/5',
    subtle: 'lc-btn bg-neutral-100 text-ink hover:bg-neutral-200'
  };
  const base = map[variant] || map.primary;
  return <button className={`${base} ${className}`} {...props} />;
}


