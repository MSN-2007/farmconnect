import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Store, Stethoscope, Settings,
    LogOut, Plus, Search, Trash2, Edit2, Save, X,
    MapPin, Phone, Upload, CheckCircle, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/auth-context';

const DeveloperDashboard = () => {
    const navigate = useNavigate();
    const { user, logout, isDeveloper } = useAuth();
    const [activeTab, setActiveTab] = useState('shops'); // shops, vets, settings
    const [shops, setShops] = useState([]);
    const [vets, setVets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Initial Load & Auth Check
    useEffect(() => {
        if (!isDeveloper()) {
            navigate('/developer-login');
            return;
        }
        loadData();
    }, [user, navigate, isDeveloper]);

    const loadData = () => {
        const storedShops = localStorage.getItem('farmconnect_shops');
        if (storedShops) setShops(JSON.parse(storedShops));

        const storedVets = localStorage.getItem('farmconnect_vets');
        if (storedVets) setVets(JSON.parse(storedVets));
    };

    const handleLogout = () => {
        logout();
        navigate('/developer-login');
    };

    // Generic Save Function
    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newItem = Object.fromEntries(formData.entries());

        if (editingItem) {
            // Update
            if (activeTab === 'shops') {
                const updated = shops.map(s => s.id === editingItem.id ? { ...newItem, id: editingItem.id } : s);
                setShops(updated);
                localStorage.setItem('farmconnect_shops', JSON.stringify(updated));
            } else {
                const updated = vets.map(v => v.id === editingItem.id ? { ...newItem, id: editingItem.id } : v);
                setVets(updated);
                localStorage.setItem('farmconnect_vets', JSON.stringify(updated));
            }
        } else {
            // Create
            const id = Date.now().toString();
            if (activeTab === 'shops') {
                const updated = [...shops, { ...newItem, id }];
                setShops(updated);
                localStorage.setItem('farmconnect_shops', JSON.stringify(updated));
            } else {
                const updated = [...vets, { ...newItem, id }];
                setVets(updated);
                localStorage.setItem('farmconnect_vets', JSON.stringify(updated));
            }
        }
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleDelete = (id) => {
        if (!window.confirm('Are you sure?')) return;

        if (activeTab === 'shops') {
            const updated = shops.filter(s => s.id !== id);
            setShops(updated);
            localStorage.setItem('farmconnect_shops', JSON.stringify(updated));
        } else {
            const updated = vets.filter(v => v.id !== id);
            setVets(updated);
            localStorage.setItem('farmconnect_vets', JSON.stringify(updated));
        }
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-nature-900 text-white fixed h-full z-10 hidden md:block">
                <div className="p-6">
                    <h1 className="text-2xl font-black tracking-tight">FarmConnect <span className="text-nature-400">Dev</span></h1>
                </div>
                <nav className="mt-6 px-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('shops')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'shops' ? 'bg-nature-800 text-white shadow-lg' : 'text-nature-200 hover:bg-nature-800/50'}`}
                    >
                        <Store className="h-5 w-5" /> Shops CMS
                    </button>
                    <button
                        onClick={() => setActiveTab('vets')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'vets' ? 'bg-nature-800 text-white shadow-lg' : 'text-nature-200 hover:bg-nature-800/50'}`}
                    >
                        <Stethoscope className="h-5 w-5" /> Vets CMS
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-nature-800 text-white shadow-lg' : 'text-nature-200 hover:bg-nature-800/50'}`}
                    >
                        <Settings className="h-5 w-5" /> Settings
                    </button>
                </nav>
                <div className="absolute bottom-6 left-0 w-full px-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-900/20 transition-all font-bold"
                    >
                        <LogOut className="h-5 w-5" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900">{activeTab === 'shops' ? 'Manage Shops' : activeTab === 'vets' ? 'Manage Veterinary Doctors' : 'Settings'}</h2>
                        <p className="text-gray-500 font-medium">CMS Dashboard • {user?.name}</p>
                    </div>
                    {activeTab !== 'settings' && (
                        <button
                            onClick={() => openModal()}
                            className="bg-nature-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-nature-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                            <Plus className="h-5 w-5" /> Add New
                        </button>
                    )}
                </header>

                {/* Content Grid */}
                {activeTab !== 'settings' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {(activeTab === 'shops' ? shops : vets).map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 group hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                        {/* Placeholder or Image */}
                                        <span className="text-xl font-black text-gray-400">{item.name[0]}</span>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openModal(item)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600"><Edit2 className="h-4 w-4" /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                                <div className="space-y-2 text-sm text-gray-500">
                                    <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {item.location}</p>
                                    <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {item.phone}</p>
                                    {activeTab === 'vets' && <p className="font-bold text-nature-700 bg-nature-50 inline-block px-2 py-1 rounded-md">{item.specialty}</p>}
                                </div>
                            </div>
                        ))}
                        {(activeTab === 'shops' ? shops : vets).length === 0 && (
                            <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 font-bold">No items found. Add one to get started.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-8 max-w-2xl">
                        <h3 className="text-xl font-bold mb-4">Admin Settings</h3>
                        <p className="text-gray-500">Currently managing as: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{user?.id}</span></p>
                    </div>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"><X className="h-6 w-6 text-gray-400" /></button>
                        <h2 className="text-2xl font-black text-gray-900 mb-6">
                            {editingItem ? 'Edit' : 'Add New'} {activeTab === 'shops' ? 'Shop' : 'Veterinary Doctor'}
                        </h2>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                                <input name="name" defaultValue={editingItem?.name} required className="w-full px-4 py-3 bg-gray-50 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-nature-500" placeholder={activeTab === 'shops' ? "Agri Store Name" : "Dr. Name"} />
                            </div>

                            {activeTab === 'vets' && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Specialty</label>
                                    <input name="specialty" defaultValue={editingItem?.specialty} required className="w-full px-4 py-3 bg-gray-50 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-nature-500" placeholder="Ex: Cattle Specialist, General" />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Location / Address</label>
                                <input name="location" defaultValue={editingItem?.location} required className="w-full px-4 py-3 bg-gray-50 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-nature-500" placeholder="City, District" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Phone Contact</label>
                                <input name="phone" defaultValue={editingItem?.phone} required className="w-full px-4 py-3 bg-gray-50 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-nature-500" placeholder="+91..." />
                            </div>

                            <button type="submit" className="w-full py-4 bg-nature-900 text-white rounded-xl font-black text-lg hover:bg-nature-800 transition-all flex items-center justify-center gap-2 mt-4">
                                <Save className="h-5 w-5" /> Save {activeTab === 'shops' ? 'Shop' : 'Doctor'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeveloperDashboard;
