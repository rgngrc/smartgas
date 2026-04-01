import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function Dashboard({ auth, entries = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        station_name: '',
        fuel_type: 'Unleaded',
        price_per_liter: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/fuel', {
            onSuccess: () => reset(),
        });
    }

    function handleDelete(id) {
        if (confirm('Delete this entry?')) {
            router.delete(`/fuel/${id}`);
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 style={{ fontWeight: '600', fontSize: '18px' }}>⛽ SmartGas Fuel Tracker</h2>}
        >
            <Head title="Dashboard" />

            <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 16px' }}>

                {/* ── FORM ── */}
                <div style={{
                    background: '#f9f9f9', padding: 24, borderRadius: 12,
                    marginBottom: 32, border: '1px solid #e0e0e0'
                }}>
                    <h2 style={{ marginTop: 0, marginBottom: 16 }}>Add New Entry</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>

                            {/* Station Name */}
                            <div style={{ flex: 1, minWidth: 180 }}>
                                <label>Station Name</label>
                                <input
                                    type="text"
                                    value={data.station_name}
                                    onChange={e => setData('station_name', e.target.value)}
                                    placeholder="e.g. Shell EDSA"
                                    style={inputStyle}
                                />
                                {errors.station_name && (
                                    <span style={errStyle}>{errors.station_name}</span>
                                )}
                            </div>

                            {/* Fuel Type */}
                            <div style={{ flex: 1, minWidth: 140 }}>
                                <label>Fuel Type</label>
                                <select
                                    value={data.fuel_type}
                                    onChange={e => setData('fuel_type', e.target.value)}
                                    style={inputStyle}
                                >
                                    <option>Unleaded</option>
                                    <option>Diesel</option>
                                    <option>Premium</option>
                                </select>
                            </div>

                            {/* Price */}
                            <div style={{ flex: 1, minWidth: 140 }}>
                                <label>Price per Liter (₱)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.price_per_liter}
                                    onChange={e => setData('price_per_liter', e.target.value)}
                                    placeholder="e.g. 65.50"
                                    style={inputStyle}
                                />
                                {errors.price_per_liter && (
                                    <span style={errStyle}>{errors.price_per_liter}</span>
                                )}
                            </div>
                        </div>

                        <button type="submit" disabled={processing} style={btnStyle}>
                            {processing ? 'Saving...' : '+ Log Entry'}
                        </button>
                    </form>
                </div>

                {/* ── TABLE ── */}
                <h2 style={{ marginBottom: 16 }}>Price History</h2>

                {entries.length === 0 ? (
                    <p style={{ color: '#999' }}>No entries yet. Add one above!</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#222', color: '#fff', textAlign: 'left' }}>
                                <th style={thStyle}>Station</th>
                                <th style={thStyle}>Fuel Type</th>
                                <th style={thStyle}>Price/Liter</th>
                                <th style={thStyle}>Date</th>
                                <th style={thStyle}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((entry, i) => {
                                const price = parseFloat(entry.price_per_liter);
                                // Conditional styling: red if > 90, green if <= 90
                                const priceColor = price > 90 ? '#c0392b' : '#27ae60';

                                return (
                                    <tr key={entry.id}
                                        style={{ background: i % 2 === 0 ? '#fff' : '#f5f5f5' }}>
                                        <td style={tdStyle}>{entry.station_name}</td>
                                        <td style={tdStyle}>{entry.fuel_type}</td>
                                        <td style={{ ...tdStyle, color: priceColor, fontWeight: 700 }}>
                                            ₱{price.toFixed(2)}
                                        </td>
                                        <td style={tdStyle}>
                                            {new Date(entry.created_at).toLocaleDateString('en-PH')}
                                        </td>
                                        <td style={tdStyle}>
                                            <button
                                                onClick={() => handleDelete(entry.id)}
                                                style={deleteBtnStyle}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

// ── Styles ──
const inputStyle = {
    display: 'block', width: '100%', padding: '8px 10px',
    marginTop: 4, borderRadius: 6, border: '1px solid #ccc',
    fontSize: 14, boxSizing: 'border-box',
};
const btnStyle = {
    marginTop: 16, padding: '10px 24px', background: '#2c3e50',
    color: '#fff', border: 'none', borderRadius: 8,
    cursor: 'pointer', fontSize: 15,
};
const deleteBtnStyle = {
    padding: '5px 12px', background: '#e74c3c', color: '#fff',
    border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13,
};
const thStyle = { padding: '10px 14px', fontSize: 13 };
const tdStyle = { padding: '10px 14px', fontSize: 14, borderBottom: '1px solid #eee' };
const errStyle = { color: 'red', fontSize: 12, marginTop: 4, display: 'block' };