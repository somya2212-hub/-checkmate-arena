import React, { useState } from 'react';
import { Shield, Lock, CreditCard, Smartphone, CheckCircle, ArrowRight, X } from 'lucide-react';

export const MockRazorpayModal = ({ isOpen, onClose, orderData, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [upiId, setUpiId] = useState('player@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !orderData) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const mockPaymentId = `pay_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const mockSignature = `mock_sig_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

      setIsProcessing(false);
      onPaymentSuccess({
        razorpay_order_id: orderData.orderId,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: mockSignature,
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0f172a] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        
        {/* Gateway Header */}
        <div className="bg-[#0c2340] px-6 py-4 border-b border-blue-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow">
              R
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-sm tracking-wide">Razorpay</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-semibold">
                  TEST / SANDBOX
                </span>
              </div>
              <p className="text-[11px] text-blue-200/80">Checkmate Arena Tournament Registration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount bar */}
        <div className="bg-[#131d33] px-6 py-3 flex items-center justify-between border-b border-slate-800">
          <span className="text-xs text-slate-300">Amount to Pay</span>
          <span className="font-display font-bold text-xl text-amber-400">
            ₹{orderData.amount}
          </span>
        </div>

        {/* Payment Methods */}
        <div className="p-6 space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Select Payment Method
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedMethod('upi')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                selectedMethod === 'upi'
                  ? 'border-blue-500 bg-blue-500/10 text-white'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Smartphone className={`w-5 h-5 ${selectedMethod === 'upi' ? 'text-blue-400' : ''}`} />
              <span className="text-xs font-semibold">UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all ${
                selectedMethod === 'card'
                  ? 'border-blue-500 bg-blue-500/10 text-white'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
              }`}
            >
              <CreditCard className={`w-5 h-5 ${selectedMethod === 'card' ? 'text-blue-400' : ''}`} />
              <span className="text-xs font-semibold">Debit / Credit</span>
            </button>
          </div>

          {selectedMethod === 'upi' && (
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <label className="text-xs text-slate-300 font-medium">Virtual Payment Address (VPA)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@okhdfcbank"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-2 pt-1 text-[11px] text-slate-400">
                <span className="bg-slate-800 px-2 py-0.5 rounded cursor-pointer" onClick={() => setUpiId('player@gpay')}>@gpay</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded cursor-pointer" onClick={() => setUpiId('player@paytm')}>@paytm</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded cursor-pointer" onClick={() => setUpiId('player@ybl')}>@ybl</span>
              </div>
            </div>
          )}

          {selectedMethod === 'card' && (
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs text-slate-300">Test Card (Pre-filled):</div>
              <div className="font-mono text-xs text-slate-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                •••• •••• •••• 4111 | Exp: 12/28 | CVV: 123
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>256-bit SSL encrypted & secure Razorpay sandbox simulation</span>
          </div>

          {/* Action Button */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleSimulatePayment}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authorizing Payment...</span>
              </>
            ) : (
              <>
                <span>Complete Payment (₹{orderData.amount})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
