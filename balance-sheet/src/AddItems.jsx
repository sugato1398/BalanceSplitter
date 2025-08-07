import { useState } from 'react';
import styles from './AddItems.module.css';

function AddItems({ onNext, onBack, items, setItems, members, payments }) {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState("");

  const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalItems = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const amountLeft = (totalPayments - totalItems).toFixed(3);

  const handleAddItem = () => {
    const name = itemName.trim();
    const price = parseFloat(itemPrice);
    if (!name) {
      setError("Item name cannot be empty");
      return;
    }
    if (isNaN(price) || price <= 0) {
      setError("Enter a valid price");
      return;
    }
    if (selectedMembers.length === 0) {
      setError("Select at least one member for this item");
      return;
    }
    setItems([
      ...items,
      { name, price, sharedBy: selectedMembers }
    ]);
    setItemName("");
    setItemPrice("");
    setSelectedMembers([]);
    setError("");
  };

  const handleRemoveItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const toggleMember = (member) => {
    setSelectedMembers((prev) =>
      prev.includes(member)
        ? prev.filter((m) => m !== member)
        : [...prev, member]
    );
  };

  const handleAddTax = () => {
    if (amountLeft === '0.000') return;
    // Prevent duplicate tax item
    if (items.some(item => item.name === 'tax')) return;
    setItems([
      ...items,
      { name: 'tax', price: parseFloat(amountLeft), sharedBy: members }
    ]);
  };

  const canProceed = items.length > 0 && Math.abs(totalPayments - totalItems) < 0.001;

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Add Items</h2>
      <div>Total payments: <b>${totalPayments.toFixed(3)}</b></div>
      <div>Total item costs: <b>${totalItems.toFixed(3)}</b></div>
      <div>
        <span style={{ color: '#000' }}>Amount left to be paid:</span> <b style={{ color: amountLeft !== '0.000' ? 'red' : 'green' }}>
          ${amountLeft}
        </b>
        <span> </span>
        <a href="#" style={{ marginLeft: 8, fontSize: 14 }} onClick={e => { e.preventDefault(); handleAddTax(); }}>
          add to tax
        </a>
      </div>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          value={itemName}
          onChange={e => setItemName(e.target.value)}
          placeholder="Item name"
        />
        <input
          className={styles.input}
          type="number"
          value={itemPrice}
          onChange={e => setItemPrice(e.target.value)}
          placeholder="Price"
          min="0"
          step="0.001"
          onWheel={e => e.target.blur()}
        />
        <div>
          <span>Shared by:</span>
          <ul
            className={styles.memberCheckboxContainer}
            style={members.length > 5 ? { maxHeight: '120px', overflowY: 'auto' } : {}}
          >
            {members.map((member) => (
              <li key={member} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member)}
                    onChange={() => toggleMember(member)}
                  />
                  <span className={styles.itemName}>{member}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={handleAddItem}>Add Item</button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <ul className={styles.itemList}>
        {items.map((item, idx) => (
          <li key={idx} className={styles.itemEntry}>
            <span className={styles.itemName}>{item.name}</span> - <span style={{ color: '#000' }}>${item.price.toFixed(3)}</span>
            <button className={styles.removeButton} onClick={() => handleRemoveItem(idx)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button
        className={styles.nextButton}
        onClick={onBack}
        style={{ marginRight: 8 }}
      >
        Back
      </button>
      <button
        className={styles.nextButton}
        onClick={() => {
          if (!canProceed) {
            setError('Total payments and item costs must match to proceed.');
            return;
          }
          setError('');
          onNext();
        }}
        disabled={!canProceed}
      >
        Next
      </button>
      {!canProceed && (
        <div className={styles.hint}>
          Add at least one item and ensure total payments match total item costs to continue
        </div>
      )}
    </div>
  );
}

export default AddItems;
