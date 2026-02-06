import React, { useState } from 'react';
import { Plus, TrendingDown, TrendingUp, DollarSign, X } from 'lucide-react';
import { cn } from '../lib/utils';

const ExpensesPage = () => {
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [expenses, setExpenses] = useState([
        {
            id: 1,
            category: 'Seeds',
            description: 'Wheat seeds',
            amount: 5000,
            date: '2025-10-15',
            type: 'expense'
        },
        {
            id: 2,
            category: 'Fertilizer',
            description: 'NPK fertilizer',
            amount: 8000,
            date: '2025-10-20',
            type: 'expense'
        },
        {
            id: 3,
            category: 'Labor',
            description: 'Harvest labor',
            amount: 12000,
            date: '2025-11-01',
            type: 'expense'
        }
    ]);

    const [revenue, setRevenue] = useState([
        {
            id: 1,
            category: 'Wheat Sale',
            description: '50 quintals',
            amount: 45000,
            date: '2025-11-15',
            type: 'revenue'
        }
    ]);

    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const categories = [
        'Seeds',
        'Fertilizer',
        'Pesticides',
        'Labor',
        'Equipment',
        'Irrigation',
        'Transportation',
        'Other'
    ];

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalRevenue = revenue.reduce((sum, rev) => sum + rev.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddExpense = (e) => {
        e.preventDefault();

        if (!formData.category || !formData.amount || !formData.description || !formData.date) {
            alert('Please fill in all fields');
            return;
        }

        const newExpense = {
            id: Date.now(),
            category: formData.category,
            description: formData.description,
            amount: parseFloat(formData.amount),
            date: formData.date,
            type: 'expense'
        };

        setExpenses(prev => [newExpense, ...prev]);
        setFormData({
            category: '',
            amount: '',
            description: '',
            date: new Date().toISOString().split('T')[0]
        });
        setShowAddExpenseModal(false);
    };

    return (
        <div className="max-w-7xl mx-auto py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-nature-900">Profit & Expense Tracker</h1>
                    <span className="text-2xl">💰</span>
                </div>
                <button
                    onClick={() => setShowAddExpenseModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-nature-700 text-white rounded-lg font-medium hover:bg-nature-800 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Expense
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Expenses */}
                <div className="bg-red-50 rounded-xl shadow-sm border border-red-100 p-6">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <p className="text-sm text-red-600 font-medium mb-1">Total Expenses</p>
                            <p className="text-3xl font-bold text-red-700">₹{totalExpenses.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-red-100 rounded-lg">
                            <TrendingDown className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-green-50 rounded-xl shadow-sm border border-green-100 p-6">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <p className="text-sm text-green-600 font-medium mb-1">Total Revenue</p>
                            <p className="text-3xl font-bold text-green-700">₹{totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Net Profit */}
                <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <p className="text-sm text-gray-600 font-medium mb-1">Net Profit</p>
                            <p className={cn(
                                "text-3xl font-bold",
                                netProfit >= 0 ? "text-green-700" : "text-red-700"
                            )}>
                                ₹{netProfit.toLocaleString()}
                            </p>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-lg">
                            <DollarSign className="h-6 w-6 text-gray-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Expenses */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Expenses</h2>
                <div className="space-y-3">
                    {expenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                            <div>
                                <p className="font-semibold text-gray-900">{expense.category}</p>
                                <p className="text-sm text-gray-600">{expense.description}</p>
                                <p className="text-xs text-gray-500 mt-1">{expense.date}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-red-600">-₹{expense.amount.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                    {expenses.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <p>No expenses recorded yet</p>
                            <p className="text-sm mt-1">Click "Add Expense" to get started</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Revenue */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue</h2>
                <div className="space-y-3">
                    {revenue.map((rev) => (
                        <div key={rev.id} className="flex items-center justify-between py-3 bg-green-50 rounded-lg px-4">
                            <div>
                                <p className="font-semibold text-gray-900">{rev.category}</p>
                                <p className="text-sm text-gray-600">{rev.description}</p>
                                <p className="text-xs text-gray-500 mt-1">{rev.date}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-green-600">+₹{rev.amount.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                    {revenue.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            <p>No revenue recorded yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Expense Modal */}
            {showAddExpenseModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Add New Expense</h2>
                            <button
                                onClick={() => setShowAddExpenseModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleAddExpense} className="space-y-4">
                            {/* Category */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-white border-2 border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                                >
                                    <option value="">Select category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Amount (₹)</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    placeholder="Enter amount"
                                    step="0.01"
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="What was this expense for?"
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full py-3 bg-nature-700 text-white rounded-lg font-bold hover:bg-nature-800 transition-colors"
                            >
                                Save Expense
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpensesPage;
