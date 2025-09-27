import React, { useState } from 'react';
import { useAuth } from '../auth';
import GoogleIcon from './icons/GoogleIcon';
import AppleIcon from './icons/AppleIcon';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    let success = false;
    try {
      if (isSignUp) {
        if (!firstName || !email || !password) {
          setError('Please fill in all fields.');
          setIsLoading(false);
          return;
        }
        success = await signup(`${firstName} ${lastName}`, email, password);
        if (!success) setError('An account with this email already exists.');
      } else {
        success = await login(email, password);
        if (!success) setError('Invalid email or password.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4" style={{backgroundImage: "url('https://picsum.photos/seed/loginbg/1920/1080')"}}>
      <div className="w-full max-w-md rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 shadow-2xl p-8 text-white animate-fade-in">
        <div className="flex justify-end">
            {/* The close button from the image seems decorative for a login screen, so it's omitted for now. */}
        </div>

        <div className="bg-gray-800/50 p-1 rounded-full flex items-center mb-6">
          <button onClick={() => setIsSignUp(true)} className={`w-1/2 rounded-full py-2 text-sm font-semibold transition ${isSignUp ? 'bg-gray-600/70' : 'hover:bg-gray-700/50'}`}>Sign up</button>
          <button onClick={() => setIsSignUp(false)} className={`w-1/2 rounded-full py-2 text-sm font-semibold transition ${!isSignUp ? 'bg-gray-600/70' : 'hover:bg-gray-700/50'}`}>Sign in</button>
        </div>

        <h1 className="text-3xl font-bold mb-6">{isSignUp ? 'Create an account' : 'Sign in to your account'}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="flex space-x-4">
              <input type="text" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-1/2 bg-gray-700/50 border border-gray-600 rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition" />
              <input type="text" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} className="w-1/2 bg-gray-700/50 border border-gray-600 rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition" />
            </div>
          )}
          <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition" />
          
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={isLoading} className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition disabled:bg-gray-400">
            {isLoading ? 'Loading...' : (isSignUp ? 'Create an account' : 'Sign in')}
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="w-full border-gray-600" />
          <span className="px-4 text-gray-400 text-sm whitespace-nowrap">OR SIGN IN WITH</span>
          <hr className="w-full border-gray-600" />
        </div>

        <div className="flex space-x-4">
          <button className="w-1/2 bg-gray-700/50 border border-gray-600 rounded-lg p-3 flex items-center justify-center hover:bg-gray-700/80 transition"><GoogleIcon className="w-6 h-6" /></button>
          <button className="w-1/2 bg-gray-700/50 border border-gray-600 rounded-lg p-3 flex items-center justify-center hover:bg-gray-700/80 transition"><AppleIcon className="w-6 h-6" /></button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-8">By creating an account, you agree to our Terms & Service</p>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default Login;
