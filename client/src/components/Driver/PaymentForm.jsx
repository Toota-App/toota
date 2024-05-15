import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = ({ tripId, driverId, bid, onSubmit , token}) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Send payment request to the API
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post('http://localhost:8000/api/trip/payments/', {
        tripId,
        driverId,
        amount: parseFloat(amount),
      }, config);
      console.log(response);
      onSubmit(response.data); // Pass payment response to parent component
    } catch (error) {
      setError('Payment failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <h3>Thank you for using our services</h3>
        <p>Trip Cost R{bid}</p>
        <label htmlFor="amount" className="form-label">Amount</label>
        <input
          type="number"
          className="form-control"
          id="amount"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Processing...' : 'Pay'}
      </button>
      {error && <div className="text-danger">{error}</div>}
    </form>
  );
};

export default PaymentForm;
