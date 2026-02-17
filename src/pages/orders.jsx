import React, { useState, useEffect } from 'react';
import { Package, Clock, MapPin, Phone, CheckCircle, XCircle, Truck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import { cn } from '../lib/utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const OrdersPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('buying'); // buying or selling

    useEffect(() => {
        fetchOrders();
    }, [activeTab]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'buying' ? '/api/orders' : '/api/orders/seller';
            const res = await fetch(`${API_URL}${endpoint}`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-5 w-5 text-yellow-600" />;
            case 'confirmed':
                return <CheckCircle className="h-5 w-5 text-blue-600" />;
            case 'preparing':
                return <Package className="h-5 w-5 text-indigo-600" />;
            case 'shipped':
                return <Truck className="h-5 w-5 text-purple-600" />;
            case 'delivered':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'cancelled':
                return <XCircle className="h-5 w-5 text-red-600" />;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-600" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'confirmed':
                return 'bg-blue-100 text-blue-700';
            case 'preparing':
                return 'bg-indigo-100 text-indigo-700';
            case 'shipped':
                return 'bg-purple-100 text-purple-700';
            case 'delivered':
                return 'bg-green-100 text-green-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const handleCancelOrder = async (orderId) => {
        const reason = prompt('Please enter cancellation reason:');
        if (!reason) return;

        try {
            const res = await fetch(`${API_URL}/api/orders/${orderId}/cancel`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason })
            });

            if (res.ok) {
                fetchOrders();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to cancel order');
            }
        } catch (error) {
            alert('Failed to cancel order');
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: newStatus,
                    note: `Order ${newStatus}`
                })
            });

            if (res.ok) {
                fetchOrders();
            } else {
                alert('Failed to update order status');
            }
        } catch (error) {
            alert('Failed to update order status');
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-nature-600 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-nature-900 mb-2">My Orders</h1>
                <p className="text-gray-600">Track and manage your orders</p>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('buying')}
                    className={cn(
                        "px-6 py-3 font-medium transition-colors border-b-2",
                        activeTab === 'buying'
                            ? "border-nature-700 text-nature-700"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                    )}
                >
                    Buying
                </button>
                <button
                    onClick={() => setActiveTab('selling')}
                    className={cn(
                        "px-6 py-3 font-medium transition-colors border-b-2",
                        activeTab === 'selling'
                            ? "border-nature-700 text-nature-700"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                    )}
                >
                    Selling
                </button>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-4">
                        {activeTab === 'buying'
                            ? 'Browse listings and place your first order!'
                            : 'Orders from buyers will appear here'}
                    </p>
                    {activeTab === 'buying' && (
                        <a
                            href="/buy-sell"
                            className="inline-block px-6 py-2 bg-nature-700 text-white rounded-lg font-medium hover:bg-nature-800 transition-colors"
                        >
                            Browse Listings
                        </a>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            {/* Order Header */}
                            <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{order.productName}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span>Order #{order._id.slice(-8)}</span>
                                        <span>•</span>
                                        <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className={cn("px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2", getStatusColor(order.status))}>
                                    {getStatusIcon(order.status)}
                                    <span className="capitalize">{order.status}</span>
                                </div>
                            </div>

                            {/* Order Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">
                                        {activeTab === 'buying' ? 'Seller' : 'Buyer'}
                                    </div>
                                    <div className="font-medium text-gray-900">
                                        {activeTab === 'buying' ? order.seller?.name : order.buyer?.name}
                                    </div>
                                    <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                        <Phone className="h-3 w-3" />
                                        {activeTab === 'buying' ? order.seller?.phone : order.buyer?.phone}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">Delivery Address</div>
                                    <div className="font-medium text-gray-900 flex items-start gap-1">
                                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <span>{order.deliveryAddress}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity and Amount */}
                            <div className="flex items-center justify-between py-3 border-y border-gray-100">
                                <div>
                                    <span className="text-gray-600">Quantity:</span>
                                    <span className="ml-2 font-medium">{order.quantity} {order.unit}</span>
                                    <span className="mx-2 text-gray-400">×</span>
                                    <span className="text-gray-600">₹{order.pricePerUnit.toLocaleString()}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-600">Total Amount</div>
                                    <div className="text-xl font-bold text-nature-700">₹{order.totalAmount.toLocaleString()}</div>
                                </div>
                            </div>

                            {/* Payment & Delivery Info */}
                            <div className="mt-4 flex items-center justify-between text-sm">
                                <div className="flex gap-6">
                                    <div>
                                        <span className="text-gray-600">Payment:</span>
                                        <span className="ml-2 font-medium capitalize">{order.paymentMethod}</span>
                                        <span className={cn(
                                            "ml-2 px-2 py-0.5 rounded-full text-xs",
                                            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        )}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Delivery:</span>
                                        <span className="ml-2 font-medium capitalize">{order.deliveryMethod}</span>
                                    </div>
                                </div>
                                {order.expectedDelivery && !order.deliveredAt && (
                                    <div className="text-gray-600">
                                        Expected: {new Date(order.expectedDelivery).toLocaleDateString()}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                                {activeTab === 'buying' && ['pending', 'confirmed'].includes(order.status) && (
                                    <button
                                        onClick={() => handleCancelOrder(order._id)}
                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                                    >
                                        Cancel Order
                                    </button>
                                )}

                                {activeTab === 'selling' && (
                                    <>
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => handleUpdateStatus(order._id, 'confirmed')}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                            >
                                                Confirm Order
                                            </button>
                                        )}
                                        {order.status === 'confirmed' && (
                                            <button
                                                onClick={() => handleUpdateStatus(order._id, 'preparing')}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                            >
                                                Start Preparing
                                            </button>
                                        )}
                                        {order.status === 'preparing' && (
                                            <button
                                                onClick={() => handleUpdateStatus(order._id, 'shipped')}
                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                                            >
                                                Mark as Shipped
                                            </button>
                                        )}
                                        {order.status === 'shipped' && (
                                            <button
                                                onClick={() => handleUpdateStatus(order._id, 'delivered')}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                            >
                                                Mark as Delivered
                                            </button>
                                        )}
                                        {['pending', 'confirmed'].includes(order.status) && (
                                            <button
                                                onClick={() => handleCancelOrder(order._id)}
                                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Status History */}
                            {order.statusHistory && order.statusHistory.length > 0 && (
                                <details className="mt-4 pt-4 border-t border-gray-100">
                                    <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900">
                                        Order Timeline
                                    </summary>
                                    <div className="mt-3 space-y-2">
                                        {order.statusHistory.map((history, idx) => (
                                            <div key={idx} className="flex items-start gap-3 text-sm">
                                                <div className="h-2 w-2 rounded-full bg-nature-600 mt-1.5"></div>
                                                <div className="flex-1">
                                                    <div className="font-medium capitalize">{history.status}</div>
                                                    <div className="text-gray-600 text-xs">
                                                        {new Date(history.timestamp).toLocaleString()}
                                                    </div>
                                                    {history.note && (
                                                        <div className="text-gray-600 text-xs mt-0.5">{history.note}</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
