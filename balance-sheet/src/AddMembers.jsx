import { useState } from 'react';
import styles from './AddMembers.module.css';

function AddMembers({ onNext, members, setMembers }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    const name = input.trim();
    if (!name) {
      setError("Name cannot be empty");
      return;
    }
    if (members.includes(name)) {
      setError("Name already added");
      return;
    }
    setMembers([...members, name]);
    setInput("");
    setError("");
  };

  const handleRemove = (name) => {
    setMembers(members.filter((m) => m !== name));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Add Members</h2>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter member name"
        />
        <button className={styles.addButton} onClick={handleAdd}>Add</button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <ul className={styles.memberList}>
        {members.map((name) => (
          <li key={name} className={styles.memberItem}>
            <span className={styles.memberName}>{name}</span>
            <button className={styles.removeButton} onClick={() => handleRemove(name)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button
        className={styles.nextButton}
        onClick={onNext}
        disabled={members.length < 2}
      >
        Next
      </button>
      {members.length < 2 && (
        <div className={styles.hint}>
          Add at least two members to continue
        </div>
      )}
    </div>
  );
}

export default AddMembers;