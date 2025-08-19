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

  // Calculate total bill amount
  const totalBill = items.reduce((sum, item) => sum + item.price, 0);

  // Modal state
  const [modalMember, setModalMember] = useState(null);

  // Get member details for modal
  const getMemberDetails = (member) => {
    // Items this member is part of
    const memberItems = items.filter(item => item.sharedBy.includes(member));
    
    return {
      paid: memberPaid[member] || 0,
      share: memberShares[member] || 0,
      items: memberItems
    };
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 0 }}>
      <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8, color: '#000' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2em', color: '#000' }}>Payment Summary</h3>
        <div style={{ color: '#000' }}><strong>Total Bill: ${totalBill.toFixed(2)}</strong></div>
      </div>
      
      {/* Payments Made Section */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '1.1em', color: '#28a745' }}>💳 Payments Made</h4>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {members
            .filter(member => (memberPaid[member] || 0) > 0)
            .map(member => (
              <li key={member} style={{ margin: '6px 0', padding: 0, fontSize: '1em' }}>
                <a href="#" onClick={e => { e.preventDefault(); setModalMember(member); }} style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}>
                  <strong>{member}</strong>
                </a>
                <span style={{ marginLeft: 8, color: '#28a745', fontWeight: 'bold' }}>
                  ${(memberPaid[member] || 0).toFixed(2)}
                </span>
              </li>
            ))}
          {members.filter(member => (memberPaid[member] || 0) > 0).length === 0 && (
            <li style={{ color: '#666', fontStyle: 'italic' }}>No payments recorded</li>
          )}
        </ul>
      </div>

      {/* Member Shares Section */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '1.1em', color: '#dc3545' }}>📊 Member Shares</h4>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {members
            .filter(member => (memberShares[member] || 0) > 0)
            .map(member => (
              <li key={member} style={{ margin: '6px 0', padding: 0, fontSize: '1em' }}>
                <a href="#" onClick={e => { e.preventDefault(); setModalMember(member); }} style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}>
                  <strong>{member}</strong>
                </a>
                <span style={{ marginLeft: 8, color: '#dc3545', fontWeight: 'bold' }}>
                  ${(memberShares[member] || 0).toFixed(2)}
                </span>
              </li>
            ))}
          {members.filter(member => (memberShares[member] || 0) > 0).length === 0 && (
            <li style={{ color: '#666', fontStyle: 'italic' }}>No shares calculated</li>
          )}
        </ul>
      </div>
      {/* Modal popup */}
      {modalMember && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setModalMember(null)}>
          <div style={{ background: '#fff', color: '#000', padding: 16, borderRadius: 8, minWidth: 300, maxWidth: 400, position: 'relative', fontSize: '1em' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setModalMember(null)} style={{ position: 'absolute', top: 4, right: 8, fontSize: 18, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '1.2em' }}>{modalMember} - Details</h4>
            {(() => {
              const details = getMemberDetails(modalMember);
              return <>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ marginBottom: 6 }}>
                    <strong>Amount Paid:</strong> <span style={{ color: '#28a745' }}>${details.paid.toFixed(2)}</span>
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <strong>Total Share:</strong> <span style={{ color: '#dc3545' }}>${details.share.toFixed(2)}</span>
                  </div>
                  <div>
                    <strong>Net:</strong> <span style={{ color: details.paid - details.share >= 0 ? '#28a745' : '#dc3545' }}>
                      ${(details.paid - details.share).toFixed(2)} 
                      {details.paid - details.share > 0 ? ' (overpaid)' : details.paid - details.share < 0 ? ' (underpaid)' : ' (settled)'}
                    </span>
                  </div>
                </div>
                
                {details.items.length > 0 && (
                  <div>
                    <strong>Items shared:</strong>
                    <ul style={{ margin: '6px 0 0 0', paddingLeft: 18, fontSize: '0.9em' }}>
                      {details.items.map((item, i) => (
                        <li key={i} style={{ margin: '2px 0', padding: 0 }}>
                          {item.name}: ${item.price.toFixed(2)} 
                          <span style={{ color: '#666' }}>
                            (${(item.price / item.sharedBy.length).toFixed(2)} share)
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
