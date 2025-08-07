import { useState, useEffect } from 'react';
import styles from './EnterPayments.module.css';

function EnterPayments({ onNext, payments, setPayments, members, items, onBack }) {
  // Calculate total bill
  const totalBill = items.reduce((sum, item) => sum + item.price, 0);
  // Initialize local state for payment inputs
  const [localPayments, setLocalPayments] = useState(() => {
    // If payments already exist, use them; otherwise, initialize to 0 for each member
    if (payments && payments.length === members.length) return payments;
    return members.map((member) => ({ member, amount: 0 }));
  });
  const [error, setError] = useState("");

  useEffect(() => {
    // Sync localPayments with members if members change
    setLocalPayments(members.map((member) => {
      const found = payments.find((p) => p.member === member);
      return found ? found : { member, amount: 0 };
    }));
  }, [members, payments]);

  const handleChange = (idx, value) => {
    const amount = parseFloat(value) || 0;
    setLocalPayments((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, amount } : p))
    );
  };

  const handleNext = () => {
    const totalPaid = localPayments.reduce((sum, p) => sum + p.amount, 0);
    if (totalPaid < totalBill) {
      setError(`Total paid ($${totalPaid.toFixed(2)}) is less than the bill ($${totalBill.toFixed(2)})`);
      return;
    }
    setPayments(localPayments);
    setError("");
    onNext();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Enter Payments</h2>
      <div>Total bill: <b>${totalBill.toFixed(2)}</b></div>
      <ul className={styles.memberList}>
        {members.map((member, idx) => (
          <li key={member} className={styles.memberItem}>
            <span className={styles.memberName}>{member} paid:</span>
            <input
              className={styles.paymentInput}
              type="number"
              min="0"
              value={localPayments[idx]?.amount || ''}
              onChange={e => handleChange(idx, e.target.value)}
              onWheel={e => e.target.blur()}
            />
          </li>
        ))}
      </ul>
      {error && <div className={styles.error}>{error}</div>}
      <button onClick={onBack} style={{ marginRight: 8 }}>Back</button>
      <button onClick={handleNext}>Next</button>
    </div>
  );
}

export default EnterPayments;
