import { useState } from 'react'
import AddMembers from './AddMembers';
import AddItems from './AddItems';
import EnterPayments from './EnterPayments';
import Results from './Results';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const STEPS = [
  'AddMembers',
  'EnterPayments',
  'AddItems',
  'Results',
];

function App() {
  const [step, setStep] = useState(0);
  const [members, setMembers] = useState([]);
  const [items, setItems] = useState([]);
  const [payments, setPayments] = useState([]);

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));
  // Optionally add goBack if you want navigation backward

  return (
    <div className="App">
      <h1 style={{ color: '#000' }}>Balance Splitter</h1>
      <div>
        {step === 0 && (
          <AddMembers onNext={goNext} members={members} setMembers={setMembers} />
        )}
        {step === 1 && (
          <EnterPayments onNext={goNext} onBack={goBack} payments={payments} setPayments={setPayments} members={members} items={items} />
        )}
        {step === 2 && (
          <AddItems onNext={goNext} onBack={goBack} items={items} setItems={setItems} members={members} payments={payments} setPayments={setPayments} />
        )}
        {step === 3 && (
          <Results members={members} items={items} payments={payments} onBack={goBack} />
        )}
      </div>
    </div>
  );
}

export default App
