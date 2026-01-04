import { useState, useEffect } from 'react';
import api from '../../../api/api';
import { UserPlus, User, Phone, Mail, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminAgentManager = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: ''
    });

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            const res = await api.get('/admin/agents');
            setAgents(res.data);
        } catch (err) {
            console.error("Failed to fetch agents", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/agents', formData);
            Swal.fire('Success', 'Delivery Agent Registered Successfully!', 'success');
            setShowForm(false);
            setFormData({ fullName: '', email: '', password: '', phoneNumber: '' });
            fetchAgents();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Failed to register agent', 'error');
        }
    };

    const handleDelete = async (id) => {
        // Soft delete endpoint re-used or new specific one. Using generic delete for now if compatible.
        // Assuming deleteSeller logic might apply or we need a specific deleteAgent endpoint. 
        // AdminController.deleteSeller uses userRepository, so it might work if ID is passed, 
        // but naming is specific. For now, let's strictly stick to what's verified. 
        // Actually, verified AdminController has deleteSeller. Let's assume we might need a deleteAgent later.
        // For now, I'll just verify if I can adding delete capability later or use the same endpoint if logical.
        // The user verified `deleteSeller` endpoint at `/admin/sellers/{id}`. 
        // I won't implement delete button actively to avoid "Seller not found" error if logic restricts role.
        // Just View List and Create for now.
    };

    if (loading) return <div className="p-6">Loading Agents...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Delivery Agents</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                >
                    <UserPlus size={20} />
                    {showForm ? 'Close Form' : 'Register New Agent'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Register New Agent</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text" name="fullName" required
                                value={formData.fullName} onChange={handleInputChange}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email" name="email" required
                                value={formData.email} onChange={handleInputChange}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="text" name="phoneNumber" required
                                value={formData.phoneNumber} onChange={handleInputChange}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password" name="password" required
                                value={formData.password} onChange={handleInputChange}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                            <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700">
                                Create Account
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map(agent => (
                    <div key={agent.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                            <User size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">{agent.fullName}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Mail size={14} /> {agent.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Phone size={14} /> {agent.phoneNumber}
                            </div>
                            <div className="mt-3 flex gap-2">
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {agents.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                    No delivery agents found. Create one to get started.
                </div>
            )}
        </div>
    );
};

export default AdminAgentManager;
