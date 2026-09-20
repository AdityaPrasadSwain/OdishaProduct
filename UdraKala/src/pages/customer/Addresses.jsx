import { useState, useEffect } from 'react';
import { MapPin, Plus, Star, MoreVertical } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import AddressForm from '../../components/AddressForm';
import { getUserAddresses, setDefaultAddress } from '../../api/addressApi';
import Swal from 'sweetalert2';

const Addresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const data = await getUserAddresses();
            setAddresses(data);
        } catch (error) {
            console.error("Failed to fetch addresses", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleSetDefault = async (id) => {
        try {
            await setDefaultAddress(id);
            Swal.fire({
                icon: 'success',
                title: 'Default Address Updated',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });
            fetchAddresses();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Could not update default address.',
            });
        }
    };

    const handleAddressAdded = (newAddress) => {
        // Optimistically add or just refetch
        fetchAddresses();
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <MapPin className="w-8 h-8 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary dark:text-text-onDark">Saved Addresses</h1>
                        <p className="text-sm text-text-secondary">Manage your delivery locations.</p>
                    </div>
                </div>
                <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
                    <Plus size={16} /> Add Address
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                        <Card key={i} className="animate-pulse h-40 bg-bg-surface dark:bg-bg-dark border-border" />
                    ))}
                </div>
            ) : addresses.length === 0 ? (
                <Card className="text-center py-16 bg-bg-surface/50 dark:bg-bg-dark/50 backdrop-blur-md">
                    <MapPin className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold text-text-primary dark:text-text-onDark">No Addresses Saved</h3>
                    <p className="text-text-secondary mt-2 mb-6">You haven't added any delivery addresses yet.</p>
                    <Button onClick={() => setIsFormOpen(true)}>Add New Address</Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <Card 
                            key={address.id} 
                            className={`relative bg-bg-surface dark:bg-[#1A1A1A] transition-all hover:shadow-glass dark:hover:shadow-glass-dark hover:-translate-y-1 ${
                                address.isDefault ? 'border-primary ring-1 ring-primary/50' : 'border-border dark:border-white/10'
                            }`}
                        >
                            {address.isDefault && (
                                <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl flex items-center gap-1">
                                    <Star size={12} className="fill-current" /> DEFAULT
                                </div>
                            )}
                            
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <MapPin size={20} />
                                </div>
                                {!address.isDefault && (
                                    <button onClick={() => handleSetDefault(address.id)} className="text-xs text-primary hover:underline font-medium">
                                        Set as Default
                                    </button>
                                )}
                            </div>

                            <div className="space-y-1 text-sm text-text-secondary">
                                <p className="font-semibold text-text-primary dark:text-text-onDark text-base">{address.street}</p>
                                <p>{address.city}, {address.state}</p>
                                <p>{address.zipCode}</p>
                                <p>{address.country}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <AddressForm 
                isOpen={isFormOpen} 
                onClose={() => setIsFormOpen(false)} 
                onAddressAdded={handleAddressAdded} 
            />
        </div>
    );
};

export default Addresses;
