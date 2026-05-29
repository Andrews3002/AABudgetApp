import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import "./App.css";

interface Budget {
    id?: number;
    salary: number;
    savings: number;
    offering: number;
    utilities: number;
    relationship: number;
    relationshipSavings: number;
}

declare global {
    interface Window {
        api: {
            getBudget: () => Promise<Budget>;
            updateBudget: (data: Budget) => Promise<Budget>;
            getSavingAllocation: () => Promise<SavingAllocation>;
            updateSavingAllocation: (
                data: SavingAllocation,
            ) => Promise<SavingAllocation>;
        };
    }
}

interface BudgetForm {
    salary: string;
    savings: string;
    offering: string;
    utilities: string;
    relationship: string;
    relationshipSavings: string;
}

type PageKey = "budget" | "savings";

const categories = [
    { key: "savings", label: "Savings" },
    { key: "offering", label: "Offering" },
    { key: "utilities", label: "Utilities" },
    { key: "relationship", label: "Relationship" },
    { key: "relationshipSavings", label: "Relationship savings" },
];

const savingCategories = [
    { key: "emergency", label: "Emergency" },
    { key: "safe", label: "Safe investments" },
    { key: "risky", label: "Risky investments" },
    { key: "wants", label: "Wants" },
];

interface SavingAllocation {
    id?: number;
    emergency: number;
    safe: number;
    risky: number;
    wants: number;
}

interface SavingAllocationForm {
    emergency: string;
    safe: string;
    risky: string;
    wants: string;
}

function App() {
    const [page, setPage] = useState<PageKey>("budget");
    const [budget, setBudget] = useState<Budget | null>(null);
    const [form, setForm] = useState<BudgetForm>({
        salary: "",
        savings: "",
        offering: "",
        utilities: "",
        relationship: "",
        relationshipSavings: "",
    });
    const [savingAllocation, setSavingAllocation] =
        useState<SavingAllocation | null>(null);
    const [savingForm, setSavingForm] = useState<SavingAllocationForm>({
        emergency: "",
        safe: "",
        risky: "",
        wants: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [savingError, setSavingError] = useState<string | null>(null);
    const [savingMessage, setSavingMessage] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [savingAllocationSaving, setSavingAllocationSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [budgetData, savingAllocationData] = await Promise.all([
                window.api.getBudget(),
                window.api.getSavingAllocation(),
            ]);

            setBudget(budgetData);
            setForm({
                salary: String(budgetData.salary),
                savings: String(budgetData.savings),
                offering: String(budgetData.offering),
                utilities: String(budgetData.utilities),
                relationship: String(budgetData.relationship),
                relationshipSavings: String(budgetData.relationshipSavings),
            });

            if (savingAllocationData) {
                setSavingAllocation(savingAllocationData);
                setSavingForm({
                    emergency: String(savingAllocationData.emergency),
                    safe: String(savingAllocationData.safe),
                    risky: String(savingAllocationData.risky),
                    wants: String(savingAllocationData.wants),
                });
            }
        } catch (e) {
            console.error("Failed to load data", e);
            setError("Unable to load budget and savings allocation data.");
        }
    }

    const totalPercent = useMemo(() => {
        const values = [
            form.savings,
            form.offering,
            form.utilities,
            form.relationship,
            form.relationshipSavings,
        ];
        return values.reduce((sum, value) => sum + (Number(value) || 0), 0);
    }, [form]);

    const totalValid = Math.abs(totalPercent - 100) < 0.01;

    function handleFieldChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
        setError(null);
        setMessage(null);
    }

    function handlePageChange(newPage: PageKey) {
        setPage(newPage);
        setError(null);
        setMessage(null);
        setSavingError(null);
        setSavingMessage(null);
    }

    function handleSavingAllocationFieldChange(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        const { name, value } = event.target;
        setSavingForm((previous) => ({
            ...previous,
            [name]: value,
        }));
        setSavingError(null);
        setSavingMessage(null);
    }

    const savingsAmount = useMemo(() => {
        const salaryValue = Number(form.salary) || 0;
        const savingsPercent = Number(form.savings) || 0;
        return salaryValue * (savingsPercent / 100);
    }, [form.salary, form.savings]);

    const savingTotalPercent = useMemo(() => {
        const values = [
            savingForm.emergency,
            savingForm.safe,
            savingForm.risky,
            savingForm.wants,
        ];
        return values.reduce((sum, value) => sum + (Number(value) || 0), 0);
    }, [savingForm]);

    const savingTotalValid = Math.abs(savingTotalPercent - 100) < 0.01;

    async function handleSave() {
        if (!totalValid) {
            setError(
                "The category percentages must add up to exactly 100%. Please correct them before saving.",
            );
            setMessage(null);
            return;
        }

        if (!budget) {
            setError("Budget data is not available yet.");
            return;
        }

        setSaving(true);
        setError(null);
        setMessage(null);

        try {
            const nextBudget: Budget = {
                ...budget,
                salary: Number(form.salary) || 0,
                savings: Number(form.savings) || 0,
                offering: Number(form.offering) || 0,
                utilities: Number(form.utilities) || 0,
                relationship: Number(form.relationship) || 0,
                relationshipSavings: Number(form.relationshipSavings) || 0,
            };

            const updated = await window.api.updateBudget(nextBudget);
            setBudget(updated);
            setForm({
                salary: String(updated.salary),
                savings: String(updated.savings),
                offering: String(updated.offering),
                utilities: String(updated.utilities),
                relationship: String(updated.relationship),
                relationshipSavings: String(updated.relationshipSavings),
            });
            setMessage("Budget saved successfully!");
        } catch (saveError) {
            console.error("Failed to save budget", saveError);
            setError("Unable to save your budget. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    async function handleSavingAllocationSave() {
        if (!savingTotalValid) {
            setSavingError(
                "The savings allocation percentages must add up to exactly 100%. Please correct them and try again.",
            );
            setSavingMessage(null);
            return;
        }

        if (!savingAllocation) {
            setSavingError("Savings allocation data is not available yet.");
            return;
        }

        setSavingAllocationSaving(true);
        setSavingError(null);
        setSavingMessage(null);

        try {
            const nextAllocation: SavingAllocation = {
                ...savingAllocation,
                emergency: Number(savingForm.emergency) || 0,
                safe: Number(savingForm.safe) || 0,
                risky: Number(savingForm.risky) || 0,
                wants: Number(savingForm.wants) || 0,
            };

            const updated =
                await window.api.updateSavingAllocation(nextAllocation);
            setSavingAllocation(updated);
            setSavingForm({
                emergency: String(updated.emergency),
                safe: String(updated.safe),
                risky: String(updated.risky),
                wants: String(updated.wants),
            });
            setSavingMessage("Savings allocation saved successfully!");
        } catch (saveError) {
            console.error("Failed to save savings allocation", saveError);
            setSavingError(
                "Unable to save savings allocation. Please try again.",
            );
        } finally {
            setSavingAllocationSaving(false);
        }
    }

    const previewSalary = Number(form.salary) || 0;
    const previewCategories = categories.map((category) => {
        const key = category.key as keyof BudgetForm;
        const percent = Number(form[key]) || 0;
        return {
            label: category.label,
            percent,
            amount: previewSalary * (percent / 100),
        };
    });

    return (
        <div className="app-shell">
            <section className="hero-panel">
                <div className="hero-copy">
                    <span className="eyebrow">AA Budget App v1.0</span>
                    <h1>Plan your salary and savings allocations</h1>
                    <p>
                        Manage your budget, then allocate your calculated
                        savings to the right goals.
                    </p>
                    <div className="page-switcher">
                        <button
                            type="button"
                            className={
                                page === "budget"
                                    ? "page-button active"
                                    : "page-button"
                            }
                            onClick={() => handlePageChange("budget")}
                        >
                            Budget
                        </button>
                        <button
                            type="button"
                            className={
                                page === "savings"
                                    ? "page-button active"
                                    : "page-button"
                            }
                            onClick={() => handlePageChange("savings")}
                        >
                            Savings allocations
                        </button>
                    </div>
                </div>

                <div className="hero-stats">
                    <div className="stat-card">
                        <span>Current salary</span>
                        <strong>
                            ${budget ? budget.salary.toLocaleString() : "—"}
                        </strong>
                    </div>
                    <div className="stat-card">
                        <span>Calculated savings</span>
                        <strong>${savingsAmount.toFixed(2)}</strong>
                    </div>
                </div>
            </section>

            <main className="budget-layout">
                <section className="budget-form card">
                    <div className="section-header">
                        <div>
                            <h2>
                                {page === "budget"
                                    ? "Budget settings"
                                    : "Savings allocation"}
                            </h2>
                            <p>
                                {page === "budget"
                                    ? "Update salary and category allocations independently, then save when the total is exactly 100%."
                                    : "Allocate your saved amount to emergency, investments, and wants based on calculated savings."}
                            </p>
                        </div>
                        <div
                            className={`total-pill ${page === "budget" ? (totalValid ? "valid" : "invalid") : savingTotalValid ? "valid" : "invalid"}`}
                        >
                            {page === "budget"
                                ? `${totalPercent.toFixed(1)}% allocated`
                                : `${savingTotalPercent.toFixed(1)}% allocated`}
                        </div>
                    </div>

                    {page === "budget" ? (
                        <>
                            <div className="form-row">
                                <label htmlFor="salary">Salary</label>
                                <input
                                    id="salary"
                                    name="salary"
                                    type="number"
                                    min="0"
                                    step="100"
                                    value={form.salary}
                                    onChange={handleFieldChange}
                                    placeholder="Enter salary"
                                />
                            </div>

                            <div className="category-grid">
                                {categories.map((category) => {
                                    const name =
                                        category.key as keyof BudgetForm;
                                    return (
                                        <div
                                            className="form-row"
                                            key={category.key}
                                        >
                                            <label htmlFor={category.key}>
                                                {category.label}
                                            </label>
                                            <div className="percentage-input">
                                                <input
                                                    id={category.key}
                                                    name={category.key}
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.5"
                                                    value={form[name]}
                                                    onChange={handleFieldChange}
                                                    placeholder="0"
                                                />
                                                <span>%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="budget-meter">
                                <div className="meter-track">
                                    <div
                                        className="meter-fill"
                                        style={{
                                            width: `${Math.min(Math.max(totalPercent, 0), 100)}%`,
                                        }}
                                    />
                                </div>
                                <div className="meter-meta">
                                    <span>
                                        {totalValid
                                            ? "Ready to save."
                                            : "Adjust until 100% total."}
                                    </span>
                                    <span
                                        className={
                                            totalValid
                                                ? "meter-ok"
                                                : "meter-warning"
                                        }
                                    >
                                        {totalValid
                                            ? "Perfect!"
                                            : totalPercent < 100
                                              ? `Need ${(100 - totalPercent).toFixed(1)}% more`
                                              : `Remove ${(totalPercent - 100).toFixed(1)}%`}
                                    </span>
                                </div>
                            </div>

                            {error && (
                                <div className="status-banner error-banner">
                                    {error}
                                </div>
                            )}
                            {message && (
                                <div className="status-banner success-banner">
                                    {message}
                                </div>
                            )}

                            <button
                                className="save-button"
                                disabled={saving}
                                onClick={handleSave}
                            >
                                {saving ? "Saving…" : "Save budget"}
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="form-row">
                                <label>Savings amount</label>
                                <div className="savings-amount-box">
                                    ${savingsAmount.toFixed(2)}
                                </div>
                            </div>

                            <div className="category-grid">
                                {savingCategories.map((category) => {
                                    const name =
                                        category.key as keyof SavingAllocationForm;
                                    return (
                                        <div
                                            className="form-row"
                                            key={category.key}
                                        >
                                            <label htmlFor={category.key}>
                                                {category.label}
                                            </label>
                                            <div className="percentage-input">
                                                <input
                                                    id={category.key}
                                                    name={category.key}
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.5"
                                                    value={savingForm[name]}
                                                    onChange={
                                                        handleSavingAllocationFieldChange
                                                    }
                                                    placeholder="0"
                                                />
                                                <span>%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="budget-meter">
                                <div className="meter-track">
                                    <div
                                        className="meter-fill"
                                        style={{
                                            width: `${Math.min(Math.max(savingTotalPercent, 0), 100)}%`,
                                        }}
                                    />
                                </div>
                                <div className="meter-meta">
                                    <span>
                                        {savingTotalValid
                                            ? "Ready to save."
                                            : "Adjust until 100% total."}
                                    </span>
                                    <span
                                        className={
                                            savingTotalValid
                                                ? "meter-ok"
                                                : "meter-warning"
                                        }
                                    >
                                        {savingTotalValid
                                            ? "Perfect!"
                                            : savingTotalPercent < 100
                                              ? `Need ${(100 - savingTotalPercent).toFixed(1)}% more`
                                              : `Remove ${(savingTotalPercent - 100).toFixed(1)}%`}
                                    </span>
                                </div>
                            </div>

                            {savingError && (
                                <div className="status-banner error-banner">
                                    {savingError}
                                </div>
                            )}
                            {savingMessage && (
                                <div className="status-banner success-banner">
                                    {savingMessage}
                                </div>
                            )}

                            <button
                                className="save-button"
                                disabled={savingAllocationSaving}
                                onClick={handleSavingAllocationSave}
                            >
                                {savingAllocationSaving
                                    ? "Saving…"
                                    : "Save savings allocation"}
                            </button>
                        </>
                    )}
                </section>

                <aside className="budget-preview card">
                    <div className="preview-header">
                        <h2>Preview</h2>
                        <span>
                            {page === "budget"
                                ? "Salary & allocations"
                                : "Savings allocations"}
                        </span>
                    </div>

                    {page === "budget" ? (
                        <>
                            <div className="preview-row">
                                <span className="preview-row-title">
                                    Salary
                                </span>
                                <strong>
                                    ${previewSalary.toLocaleString()}
                                </strong>
                            </div>

                            {previewCategories.map((item) => (
                                <div className="preview-row" key={item.label}>
                                    <span className="preview-row-title">
                                        {item.label}
                                    </span>
                                    <strong>${item.amount.toFixed(2)}</strong>
                                </div>
                            ))}

                            <div className="preview-footer">
                                <span>Allocation status</span>
                                <strong>
                                    {totalValid
                                        ? "Balanced"
                                        : "Needs adjustment"}
                                </strong>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="preview-row">
                                <span className="preview-row-title">
                                    Savings amount
                                </span>
                                <strong>${savingsAmount.toFixed(2)}</strong>
                            </div>
                            {savingCategories.map((item) => {
                                const percent =
                                    Number(
                                        savingForm[
                                            item.key as keyof SavingAllocationForm
                                        ],
                                    ) || 0;
                                return (
                                    <div className="preview-row" key={item.key}>
                                        <span className="preview-row-title">
                                            {item.label}
                                        </span>
                                        <strong>
                                            $
                                            {(
                                                savingsAmount *
                                                (percent / 100)
                                            ).toFixed(2)}
                                        </strong>
                                    </div>
                                );
                            })}
                            <div className="preview-footer">
                                <span>Allocation status</span>
                                <strong>
                                    {savingTotalValid
                                        ? "Balanced"
                                        : "Needs adjustment"}
                                </strong>
                            </div>
                        </>
                    )}
                </aside>
            </main>
        </div>
    );
}

export default App;
