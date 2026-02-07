import React, { useState } from 'react';

const TestPage = () => {
    const [testResult, setTestResult] = useState('');
    const [formData, setFormData] = useState({ name: '', message: '' });
    const [items, setItems] = useState([]);

    const runTests = () => {
        const results = [];

        // Test 1: React State
        results.push('✅ React state working');

        // Test 2: Event Handlers
        results.push('✅ Event handlers working');

        // Test 3: Component Rendering
        results.push('✅ Component rendering working');

        setTestResult(results.join('\n'));
    };

    const testForm = (e) => {
        e.preventDefault();
        setItems([...items, { ...formData, id: Date.now() }]);
        setFormData({ name: '', message: '' });
    };

    return (
        <div className="max-w-4xl mx-auto py-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">🧪 FarmConnect Functionality Test</h1>

                {/* Test 1: Basic Rendering */}
                <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h2 className="text-xl font-bold text-green-900 mb-2">Test 1: Basic Rendering</h2>
                    <p className="text-green-800">✅ If you can see this, React is rendering correctly!</p>
                </div>

                {/* Test 2: Button Click */}
                <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h2 className="text-xl font-bold text-blue-900 mb-2">Test 2: Button Click</h2>
                    <button
                        onClick={runTests}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Click Me to Test
                    </button>
                    {testResult && (
                        <div className="mt-4 p-3 bg-white rounded border border-blue-300">
                            <pre className="text-sm text-gray-900 whitespace-pre-wrap">{testResult}</pre>
                        </div>
                    )}
                </div>

                {/* Test 3: Form Input */}
                <div className="mb-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h2 className="text-xl font-bold text-purple-900 mb-4">Test 3: Form Input</h2>
                    <form onSubmit={testForm} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter a message"
                                rows="3"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                        >
                            Submit Test
                        </button>
                    </form>

                    {items.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <h3 className="font-semibold text-gray-900">Submitted Items:</h3>
                            {items.map(item => (
                                <div key={item.id} className="p-3 bg-white rounded border border-purple-300">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-gray-600">{item.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Test 4: State Management */}
                <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h2 className="text-xl font-bold text-amber-900 mb-2">Test 4: State Management</h2>
                    <p className="text-amber-800">Items in state: {items.length}</p>
                    <p className="text-sm text-amber-700 mt-2">
                        {items.length === 0 ? '⏳ Submit the form above to test state management' : '✅ State management working!'}
                    </p>
                </div>

                {/* Test Results Summary */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Test Summary</h2>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-green-600">✅</span>
                            <span>React Rendering</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={testResult ? "text-green-600" : "text-gray-400"}>
                                {testResult ? "✅" : "⏳"}
                            </span>
                            <span>Button Click Events</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={items.length > 0 ? "text-green-600" : "text-gray-400"}>
                                {items.length > 0 ? "✅" : "⏳"}
                            </span>
                            <span>Form Submission</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={items.length > 0 ? "text-green-600" : "text-gray-400"}>
                                {items.length > 0 ? "✅" : "⏳"}
                            </span>
                            <span>State Management</span>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                    <h3 className="font-bold text-blue-900 mb-2">📝 Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-1 text-blue-800">
                        <li>Click the "Click Me to Test" button</li>
                        <li>Fill out the form and click "Submit Test"</li>
                        <li>Check if all tests show ✅ green checkmarks</li>
                        <li>If any test fails, take a screenshot and share it</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default TestPage;
