import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Shield, Lock, CreditCard, CheckCircle2, AlertCircle, ArrowRight, User, Mail, Phone, MessageSquare, Info } from 'lucide-react';
import { getFeaturedTournament, createRegistrationOrder, verifyPaymentAndConfirm } from '../services/api';
import { MockRazorpayModal } from '../components/MockRazorpayModal';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    chessUsername: '',
    confirmedAccountOwnership: false,
    confirmedTerms: false,
  });

  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Payment State
  const [orderPayload, setOrderPayload] = useState(null);
  const [showMockModal, setShowMockModal] = useState(false);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const res = await getFeaturedTournament();
        if (res.data.success) {
          setTournament(res.data.data);
        }
      } catch (err) {
        setServerError('Unable to fetch current tournament details.');
      } finally {
        setLoading(false);
      }
    };
    fetchTournament();
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 8) {
      errs.phone = 'Please enter a valid contact number';
    }

    if (!formData.chessUsername.trim()) {
      errs.chessUsername = 'Chess.com username is required';
    } else if (!/^[a-zA-Z0-9_-]{3,30}$/.test(formData.chessUsername.trim())) {
      errs.chessUsername = 'Enter a valid Chess.com username (3-30 letters/numbers)';
    }

    if (!formData.confirmedAccountOwnership) {
      errs.confirmedAccountOwnership = 'You must confirm that this Chess.com account is yours';
    }

    if (!formData.confirmedTerms) {
      errs.confirmedTerms = 'You must accept the Tournament Rules and Fair Play policy';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!tournament) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      const payload = {
        tournamentId: tournament._id,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        whatsappNumber: sameAsPhone ? formData.phone.trim() : formData.whatsappNumber.trim() || formData.phone.trim(),
        chessUsername: formData.chessUsername.trim(),
        confirmedAccountOwnership: formData.confirmedAccountOwnership,
        confirmedTerms: formData.confirmedTerms,
      };

      // 1. Create Pending Registration & Order on Backend
      const res = await createRegistrationOrder(payload);

      if (!res.data.success) {
        setServerError(res.data.message || 'Failed to create order');
        setIsSubmitting(false);
        return;
      }

      const orderData = res.data.data;
      setOrderPayload(orderData);

      // Check if Razorpay script is loaded and we have live keys
      if (
        window.Razorpay &&
        orderData.keyId &&
        !orderData.isDemoMode &&
        !orderData.keyId.includes('DemoKey')
      ) {
        // Open Real Razorpay Checkout
        const options = {
          key: orderData.keyId,
          amount: orderData.amountInPaise,
          currency: orderData.currency,
          name: 'Checkmate Arena',
          description: `Registration for ${tournament.title}`,
          order_id: orderData.orderId,
          handler: async function (response) {
            await handlePaymentVerification(response);
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#eab308',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          setServerError(`Payment failed: ${response.error.description}`);
          setIsSubmitting(false);
        });
        rzp.open();
      } else {
        // Open Seamless Mock Sandbox Gateway Modal
        setShowMockModal(true);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setServerError(
        err.response?.data?.message || 'Registration failed. Please check your details or try again.'
      );
      setIsSubmitting(false);
    }
  };

  const handlePaymentVerification = async (paymentResponse) => {
    setIsSubmitting(true);
    try {
      const verifyRes = await verifyPaymentAndConfirm(paymentResponse);
      if (verifyRes.data.success) {
        // Store success state and navigate to success page
        sessionStorage.setItem('ca_success_registration', JSON.stringify(verifyRes.data.data));
        navigate('/success');
      } else {
        setServerError(verifyRes.data.message || 'Payment signature verification failed.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setServerError(
        err.response?.data?.message || 'Payment verification failed on backend. Please contact support.'
      );
    } finally {
      setIsSubmitting(false);
      setShowMockModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center text-slate-400">
        <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading registration portal...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 relative chess-pattern-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
            Player Application
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Register for Tournament
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Provide your exact Chess.com details and complete the entry fee. We will generate your unique Registration ID immediately upon payment confirmation.
          </p>
        </div>

        {/* Tournament Summary Card */}
        {tournament && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">Selected Event</span>
              <h3 className="font-display font-bold text-white text-base">{tournament.title}</h3>
              <p className="text-xs text-slate-400">{tournament.date} • {tournament.timeControl}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Total Entry Fee</span>
              <span className="font-display font-black text-2xl text-amber-400">₹{tournament.entryFee}</span>
            </div>
          </div>
        )}

        {/* Server Error Alert */}
        {serverError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-200">Registration Notice</p>
              <p>{serverError}</p>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          
          <div className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Full Name (as per identity / bank account for prizes) *</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g. Viswanathan Anand"
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${
                  errors.fullName ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
                } text-sm text-white placeholder-slate-600 focus:outline-none transition-colors`}
              />
              {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Email Address (for tournament pass & pass receipt) *</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g. player@example.com"
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${
                  errors.email ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
                } text-sm text-white placeholder-slate-600 focus:outline-none transition-colors`}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Phone Number (with country code, e.g. +91) *</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g. +91 9876543210"
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${
                  errors.phone ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
                } text-sm text-white placeholder-slate-600 focus:outline-none transition-colors`}
              />
              {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
            </div>

            {/* WhatsApp Number checkbox & field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={sameAsPhone}
                  onChange={(e) => setSameAsPhone(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 w-4 h-4"
                />
                <span>WhatsApp number is the same as phone number</span>
              </label>

              {!sameAsPhone && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp Number (for manual arbiter verification)</span>
                  </label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Chess.com Username */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Chess.com Username (Exact Handle) *</span>
                </span>
                <span className="text-[10px] text-amber-400/90 font-mono">NO PASSWORDS REQUIRED</span>
              </label>
              <input
                type="text"
                name="chessUsername"
                value={formData.chessUsername}
                onChange={handleInputChange}
                placeholder="e.g. MagnusCarlsen or Hikaru"
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border ${
                  errors.chessUsername ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
                } text-sm text-white font-mono placeholder-slate-600 focus:outline-none transition-colors`}
              />
              {errors.chessUsername && <p className="text-xs text-red-400 mt-1">{errors.chessUsername}</p>}
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <Info className="w-3 h-3 text-slate-400" />
                <span>You must join the private club with this exact username. Never share passwords.</span>
              </p>
            </div>

          </div>

          {/* Confirmations / Checkboxes */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div>
              <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  name="confirmedAccountOwnership"
                  checked={formData.confirmedAccountOwnership}
                  onChange={handleInputChange}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 w-4 h-4 mt-0.5"
                />
                <span>
                  I confirm that the Chess.com username entered above belongs to me and I will play all games from this account.
                </span>
              </label>
              {errors.confirmedAccountOwnership && (
                <p className="text-[11px] text-red-400 ml-7 mt-1">{errors.confirmedAccountOwnership}</p>
              )}
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  name="confirmedTerms"
                  checked={formData.confirmedTerms}
                  onChange={handleInputChange}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 w-4 h-4 mt-0.5"
                />
                <span>
                  I have read and agree to the{' '}
                  <Link to="/rules" target="_blank" className="text-amber-400 underline hover:text-amber-300">
                    Tournament Rules
                  </Link>
                  ,{' '}
                  <Link to="/rules#refunds" target="_blank" className="text-amber-400 underline hover:text-amber-300">
                    Refund Policy
                  </Link>{' '}
                  and{' '}
                  <Link to="/rules#fair-play" target="_blank" className="text-amber-400 underline hover:text-amber-300">
                    Fair Play Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.confirmedTerms && (
                <p className="text-[11px] text-red-400 ml-7 mt-1">{errors.confirmedTerms}</p>
              )}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl font-bold text-base text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Processing Registration...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Pay Entry Fee (₹{tournament?.entryFee || 199}) & Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Razorpay Checkout • Unique Registration ID Generated on Payment</span>
          </div>

        </form>

      </div>

      {/* Mock Razorpay Sandbox Modal */}
      <MockRazorpayModal
        isOpen={showMockModal}
        onClose={() => setShowMockModal(false)}
        orderData={orderPayload}
        onPaymentSuccess={handlePaymentVerification}
      />

    </div>
  );
};
