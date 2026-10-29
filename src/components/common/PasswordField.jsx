import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordField({ label, registration, error, placeholder }) {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => setVisible((value) => !value)

  return <label>{label}<span className="relative block">
    <input className="pr-10" type={visible ? 'text' : 'password'} {...registration} placeholder={placeholder} />
    <button type="button" onClick={toggleVisibility} aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} aria-pressed={visible} className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded text-[#718077] hover:bg-[#f1f5f1] hover:text-campus">
      {visible ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  </span>{error && <small className="field-error">{error}</small>}</label>
}
