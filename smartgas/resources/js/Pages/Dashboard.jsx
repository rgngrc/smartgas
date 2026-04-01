import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
// Note: Siguraduhin na nag `npm install lucide-react --legacy-peer-deps` ka
import { Fuel, MapPin, BadgeDollarSign, Trash2, History, PlusCircle } from 'lucide-react';

export default function Dashboard({ auth, entries = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        station_name: '',
        fuel_type: 'Unleaded',
        price_per_liter: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('fuel.store'), {
            onSuccess: () => reset(),
        });
    };

    const deleteEntry = (id) => {
        if (confirm('Permanently delete this fuel record?')) {
            router.delete(route('fuel.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-black text-2xl text-indigo-900 tracking-tight">SmartGas Tracker</h2>}
        >
            <Head title="Fuel Dashboard" />

            <div className="py-10 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* 1. INPUT FORM CARD - Startup Grade Design */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl">
                        <div className="p-6 border-b border-gray-50 bg-gradient-to-r from-indigo-50/30 to-transparent">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                                    <PlusCircle className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Record New Price</h3>
                            </div>
                        </div>
                        
                        <form onSubmit={submit} className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                                    <MapPin className="w-3 h-3" /> Station Name
                                </label>
                                <input
                                    type="text"
                                    value={data.station_name}
                                    onChange={e => setData('station_name', e.target.value)}
                                    className="w-full bg-gray-50 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all py-3"
                                    placeholder="e.g. Shell North"
                                    required
                                />
                                {errors.station_name && <p className="text-red-500 text-xs mt-1">{errors.station_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                                    <Fuel className="w-3 h-3" /> Fuel Type
                                </label>
                                <select
                                    value={data.fuel_type}
                                    onChange={e => setData('fuel_type', e.target.value)}
                                    className="w-full bg-gray-50 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all py-3"
                                >
                                    <option value="Diesel">Diesel</option>
                                    <option value="Unleaded">Unleaded</option>
                                    <option value="Premium">Premium</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                                    <BadgeDollarSign className="w-3 h-3" /> Price (PHP)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.price_per_liter}
                                    onChange={e => setData('price_per_liter', e.target.value)}
                                    className="w-full bg-gray-50 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all py-3"
                                    placeholder="0.00"
                                    required
                                />
                                {errors.price_per_liter && <p className="text-red-500 text-xs mt-1">{errors.price_per_liter}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="h-[52px] w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {processing ? 'Saving...' : 'Add Log'}
                            </button>
                        </form>
                    </div>

                    {/* 2. DATA TABLE - Modern Minimalist */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                            <div className="flex items-center gap-2">
                                <History className="w-5 h-5 text-indigo-600" />
                                <h3 className="text-lg font-bold text-gray-800">Fuel Price History</h3>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Gas Station</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Fuel Category</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Price/Liter</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Recorded At</th>
                                        <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {entries.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-20 text-center text-gray-400 italic">No price logs available. Create your first entry above.</td>
                                        </tr>
                                    ) : (
                                        entries.map((entry) => (
                                            <tr key={entry.id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                                                <td className="px-8 py-5 font-bold text-gray-800">{entry.station_name}</td>
                                                <td className="px-8 py-5">
                                                    <span className="px-4 py-1.5 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase text-indigo-600 shadow-sm">
                                                        {entry.fuel_type}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    {/* MANDATORY LOGIC: Red if > 90, Green if lower */}
                                                    <span className={`text-xl font-black ${entry.price_per_liter > 90 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                        ₱{Number(entry.price_per_liter).toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-sm text-gray-400 font-medium">
                                                    {new Date(entry.created_at).toLocaleDateString('en-PH', { month: 'short', day: '2-digit', year: 'numeric' })}
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button 
                                                        onClick={() => deleteEntry(entry.id)}
                                                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}