import { useState } from 'react';

function Results({ members, items, payments, onBack }) {
  // Calculate each member's total share
  const memberShares = {};
  members.forEach(member => { memberShares[member] = 0; });
  items.forEach(item => {
    const share = item.price / item.sharedBy.length;
    item.sharedBy.forEach(member => {
      memberShares[member] += share;
    });
  });

  // Calculate how much each member paid
  const memberPaid = {};
  members.forEach(member => { memberPaid[member] = 0; });
  payments.forEach(p => { memberPaid[p.member] = p.amount; });

  // Calculate net balance for each member
  const netBalances = {};
  members.forEach(member => {
    netBalances[member] = (memberPaid[member] || 0) - (memberShares[member] || 0);
  });

  // Calculate who owes whom
  // Positive net: is owed money; Negative net: owes money
  const creditors = members.filter(m => netBalances[m] > 0).map(m => ({ member: m, amount: netBalances[m] }));
  const debtors = members.filter(m => netBalances[m] < 0).map(m => ({ member: m, amount: -netBalances[m] }));

  let transactions = [];
  let c = 0, d = 0;
  while (c < creditors.length && d < debtors.length) {
    const credit = creditors[c];
    const debt = debtors[d];
    const amount = Math.min(credit.amount, debt.amount);
    transactions.push({ from: debt.member, to: credit.member, amount });
    creditors[c].amount -= amount;
    debtors[d].amount -= amount;
    if (Math.abs(creditors[c].amount) < 0.001) c++;
    if (Math.abs(debtors[d].amount) < 0.001) d++;
  }

  // Modal state
  const [modalMember, setModalMember] = useState(null);

  // Find transactions relevant to a member
  const getMemberTransactions = (member) => {
    const owes = transactions.filter(t => t.from === member);
    const owed = transactions.filter(t => t.to === member);
    return { owes, owed };
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 0 }}>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {members.map(member => (
          <li key={member} style={{ color: netBalances[member] < 0 ? 'red' : netBalances[member] > 0 ? 'green' : 'black', margin: 0, padding: 0, fontSize: '1.1em' }}>
            <a href="#" onClick={e => { e.preventDefault(); setModalMember(member); }} style={{ color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}>
              {member}: {netBalances[member] > 0 ? 'is owed' : netBalances[member] < 0 ? 'owes' : 'settled'} ${Math.abs(netBalances[member]).toFixed(3)}
            </a>
          </li>
        ))}
      </ul>
      {/* Modal popup */}
      {modalMember && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setModalMember(null)}>
          <div style={{ background: '#fff', color: '#000', padding: 16, borderRadius: 8, minWidth: 260, position: 'relative', fontSize: '1em' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setModalMember(null)} style={{ position: 'absolute', top: 4, right: 8, fontSize: 18, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1em' }}>{modalMember}</h4>
            {(() => {
              const { owes, owed } = getMemberTransactions(modalMember);
              if (owes.length === 0 && owed.length === 0) {
                return <div>All settled for {modalMember}!</div>;
              }
              return <>
                {owes.length > 0 && <div>
                  <b>Owes:</b>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>{owes.map((t, i) => <li key={i} style={{ margin: 0, padding: 0 }}>Pay <b>{t.to}</b>: ${t.amount.toFixed(3)}</li>)}</ul>
                </div>}
                {owed.length > 0 && <div>
                  <b>Is owed by:</b>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>{owed.map((t, i) => <li key={i} style={{ margin: 0, padding: 0 }}>Receive from <b>{t.from}</b>: ${t.amount.toFixed(3)}</li>)}</ul>
                </div>}
              </>;
            })()}
          </div>
        </div>
      )}
      <button onClick={onBack} style={{ marginTop: 16 }}>Back</button>
    </div>
  );
}

export default Results;
