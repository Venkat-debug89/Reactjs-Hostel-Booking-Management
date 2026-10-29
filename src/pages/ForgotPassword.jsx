import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowRight, Building2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import PasswordField from '../components/common/PasswordField.jsx'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const submit = ({ email, userId, password }) => {
    try {
      resetPassword(email, userId.trim(), password)
      toast.success('Password updated. Sign in with your new password.')
      navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return <div className="auth-page">
    <Link to="/" className="brand auth-brand"><span className="brand-mark"><Building2 size={18} /></span>Hostel<span>Hub</span></Link>
    <div className="auth-shell">
      <div className="auth-art">
        <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1100&q=85" alt="Welcoming student accommodation" />
        <div><p className="eyebrow">ACCOUNT RECOVERY</p><h2>Back to your<br /><em>campus home.</em></h2></div>
      </div>
      <div className="auth-form-wrap">
        <p className="eyebrow">RESET YOUR PASSWORD</p>
        <h1>Forgot password?</h1>
        <p className="auth-intro">Verify your saved account details, then choose a new password.</p>
        <form className="form-stack" onSubmit={handleSubmit(submit)}>
          <label>Email address<input type="email" {...register('email', { required: 'Enter your account email' })} placeholder="you@campus.edu" />{errors.email && <small className="field-error">{errors.email.message}</small>}</label>
          <label>Student or admin ID<input {...register('userId', { required: 'Enter your account ID' })} placeholder="e.g. STU-2401" />{errors.userId && <small className="field-error">{errors.userId.message}</small>}</label>
          <PasswordField label="New password" registration={register('password', { required: 'Enter a new password', minLength: { value: 6, message: 'Use at least 6 characters' } })} error={errors.password?.message} placeholder="At least 6 characters" />
          <PasswordField label="Confirm new password" registration={register('confirmPassword', { required: 'Confirm your new password', validate: (value) => value === watch('password') || 'Passwords do not match' })} error={errors.confirmPassword?.message} placeholder="Enter the new password again" />
          <p className="demo-hint">This browser-only demo verifies your email and account ID locally. It does not send a recovery email.</p>
          <button className="button button-primary button-wide">Update password <ArrowRight size={16} /></button>
        </form>
        <p className="auth-switch"><Link to="/login">← Back to sign in</Link></p>
      </div>
    </div>
  </div>
}