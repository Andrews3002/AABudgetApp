import { useEffect, useState } from 'react'
import './App.css'

interface Budget {
    id?: number;
    salary: number;
    savings: number;
    offering: number;
    utilities: number;
    relationship: number;
    relationshipSavings: number;
}

function App() {
  const [budget, setBudget] = useState<Budget | null>(null);

  useEffect(() => {
    loadBudget();
  }, []);

  async function loadBudget() {
    try{
      const data = await window.api.getBudget();
      setBudget(data);
    }
    catch (e) {
      console.error("Failed to load budget", e);
    }
  }

  return (
    <>
      {budget && <p>Salary: {budget.salary}</p>}
    </>
  )
}

export default App
