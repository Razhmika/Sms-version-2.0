import React, { useState } from 'react';
import { VendorOrder, VendorAccount, User, UserRole, OrderStatus, Material } from '../types';
import { ICONS } from '../constants';
import emailjs from '@emailjs/browser';

interface VendorOrdersProps {
    orders: VendorOrder[];
    vendors: VendorAccount[];
    materials: Material[];
    currentUser: User;
    onCreateOrder: (order: any) => void;
    onUpdateStatus: (id: number, status: string) => void;
}

const statusConfig: Record<string, { bg: string; text: string; border: string; icon: string }> = {
    Requested: { bg: 'rgba(245,158,11,0.1)', text: '#d97706', border: 'rgba(245,158,11,0.25)', icon: '⏳' },
    Approved: { bg: 'rgba(59,130,246,0.1)', text: '#2563eb', border: 'rgba(59,130,246,0.25)', icon: '✓' },
    Booked: { bg: 'rgba(99,102,241,0.1)', text: '#4f46e5', border: 'rgba(99,102,241,0.25)', icon: '📋' },
    Delivered: { bg: 'rgba(34,197,94,0.1)', text: '#16a34a', border: 'rgba(34,197,94,0.25)', icon: '✅' },
    Rejected: { bg: 'rgba(239,68,68,0.1)', text: '#dc2626', border: 'rgba(239,68,68,0.25)', icon: '✕' },
};

const VENDOR_COLORS = [
    'linear-gradient(135deg, #6366f1, #8b5cf6)',
    'linear-gradient(135deg, #3b82f6, #2563eb)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #ec4899, #db2777)',
];

const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: '#fff', border: '1px solid #e2e8f0',
    borderRadius: 10, padding: '0.75rem 1rem',
    fontSize: '0.875rem', color: '#0f172a', outline: 'none',
    transition: 'all 0.2s', fontFamily: "'Inter',sans-serif",
};
const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.75rem', fontWeight: 600,
    color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em',
};

const VendorOrders: React.FC<VendorOrdersProps> = ({ orders, vendors, materials, currentUser, onCreateOrder, onUpdateStatus }) => {
    const [selectedVendor, setSelectedVendor] = useState<VendorAccount | null>(null);
    const [selectedMaterialId, setSelectedMaterialId] = useState('');
    const [materialType, setMaterialType] = useState('');
    const [qty, setQty] = useState('');
    const [orderSuccess, setOrderSuccess] = useState(false);

    const isAdmin = currentUser.role === UserRole.Admin;
    const isManager = currentUser.role === UserRole.Manager;

    const handleOrder = (e: React.FormEvent) => {
        e.preventDefault();
        const quantity = Number(qty);
        if (!selectedVendor || !materialType || !qty || quantity <= 0) return;
        const status = isAdmin ? OrderStatus.Booked : OrderStatus.Requested;
        onCreateOrder({
            material_id: selectedMaterialId || null,
            materialType,
            quantity: Number(qty),
            status,
            vendorName: selectedVendor.companyName,
            requestedBy: currentUser.username,
        });

        // Use EmailJS to send order details to vendor
        try {
            emailjs.send(
                'service_yo9pavf', // Service ID for sending order details
                'template_fhpgflo', // Template ID provided by user
                {
                    to_email: selectedVendor.email,
                    vendor_name: selectedVendor.vendorName || selectedVendor.companyName,
                    material_type: materialType,
                    quantity: quantity,
                    status: status,
                    requested_by: currentUser.username
                },
                'IxFEYc5WO3Ok8sAzA'
            ).then(() => {
                console.log('Order email queued via EmailJS');
            }).catch(emailErr => {
                console.error("Failed to send order email via EmailJS:", emailErr);
            });
        } catch (err) {
            console.error("Error initiating emailJS:", err);
        }

        setMaterialType(''); setQty(''); setSelectedMaterialId('');
        setOrderSuccess(true);
        setTimeout(() => setOrderSuccess(false), 3000);
    };

    const vendorOrderCount = (name: string) => orders.filter(o => o.vendorName === name).length;

    return (
        <div style={{ padding: '2rem', fontFamily: "'Inter',sans-serif", background: '#f8fafc', minHeight: '100%' }}>
            {!selectedVendor ? (
                <>
                    {/* Header */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
                            Procurement Management
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '4px 0 0', fontWeight: 500 }}>
                            Track purchase orders and manage supplier deliveries
                        </p>
                    </div>

                    {/* Vendor Selection */}
                    <div style={{ marginBottom: '1.75rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>Select a Vendor to Place Order</span>
                            <div style={{ height: 1, flex: 1, background: '#e2e8f0', marginLeft: 4 }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                            {vendors.map((v, i) => (
                                <button
                                    key={v.id}
                                    onClick={() => setSelectedVendor(v)}
                                    style={{
                                        background: '#fff', border: '1px solid #e2e8f0',
                                        borderRadius: 16, padding: '1.25rem', textAlign: 'left', cursor: 'pointer',
                                        transition: 'all 0.2s', outline: 'none',
                                    }}
                                    onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(99,102,241,0.15)'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#a5b4fc'; }}
                                    onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0'; }}
                                >
                                    <div style={{ width: 40, height: 40, borderRadius: 12, background: VENDOR_COLORS[i % VENDOR_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, marginBottom: '0.75rem', fontSize: '1.125rem' }}>
                                        {v.companyName[0].toUpperCase()}
                                    </div>
                                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.companyName}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{vendorOrderCount(v.companyName)} orders</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Global Order Table */}
                    <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>Global Order Registry</div>
                            <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 8, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700 }}>{orders.length} orders</span>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                    {['Order ID', 'Status', 'Material / Spec', 'Vendor', 'Qty', 'Actions'].map((h, i) => (
                                        <th key={i} style={{ padding: '0.75rem 1.25rem', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length === 0 ? (
                                    <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: 8 }}>📋</div>
                                        <div style={{ fontWeight: 600 }}>No orders yet</div>
                                        <div style={{ fontSize: '0.8rem', marginTop: 4 }}>Select a vendor above to place your first order</div>
                                    </td></tr>
                                ) : orders.map((order, idx) => {
                                    const sc = statusConfig[order.status] || statusConfig.Requested;
                                    return (
                                        <tr key={order.id} style={{ borderBottom: idx < orders.length - 1 ? '1px solid #f8fafc' : 'none', transition: 'background 0.15s' }}
                                            onMouseOver={e => (e.currentTarget as HTMLTableRowElement).style.background = '#f8fafc'}
                                            onMouseOut={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                                        >
                                            <td style={{ padding: '1rem 1.25rem', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 700, color: '#6366f1' }}>
                                                #ORD-{String(order.id).padStart(4, '0')}
                                            </td>
                                            <td style={{ padding: '1rem 1.25rem' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, padding: '4px 10px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700 }}>
                                                    <span>{sc.icon}</span> {order.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem 1.25rem' }}>
                                                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>{order.materialType}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>by {order.requestedBy}</div>
                                            </td>
                                            <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>{order.vendorName}</td>
                                            <td style={{ padding: '1rem 1.25rem' }}>
                                                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>{order.quantity}</span>
                                                <span style={{ color: '#94a3b8', fontSize: '0.75rem', marginLeft: 4 }}>units</span>
                                            </td>
                                            <td style={{ padding: '1rem 1.25rem' }}>
                                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                    {isAdmin && order.status === OrderStatus.Requested && (
                                                        <>
                                                            <button onClick={() => onUpdateStatus(order.id, OrderStatus.Approved)} style={{ padding: '4px 10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 7, fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                                                                Approve
                                                            </button>
                                                            <button onClick={() => onUpdateStatus(order.id, OrderStatus.Rejected)} style={{ padding: '4px 10px', background: 'rgba(239,68,68,0.1)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 7, fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    {isManager && order.status === OrderStatus.Approved && (
                                                        <button onClick={() => onUpdateStatus(order.id, OrderStatus.Booked)} style={{ padding: '4px 10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', border: 'none', borderRadius: 7, fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>
                                                            Book Order
                                                        </button>
                                                    )}
                                                    {(isAdmin || isManager) && order.status === OrderStatus.Booked && (
                                                        <button onClick={() => onUpdateStatus(order.id, OrderStatus.Delivered)} style={{ padding: '4px 10px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: 'none', borderRadius: 7, fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                                                            ⏳ Pending
                                                        </button>
                                                    )}
                                                    {![OrderStatus.Requested, OrderStatus.Approved, OrderStatus.Booked].includes(order.status) && (
                                                        <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontStyle: 'italic' }}>No actions</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <>
                    {/* Vendor Order View */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
                        <button
                            onClick={() => setSelectedVendor(null)}
                            style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.2s', fontSize: '1rem' }}
                            onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc'; }}
                            onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; }}
                        >←</button>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
                                Order from {selectedVendor.companyName}
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.8125rem', margin: 0 }}>Contact: {selectedVendor.vendorName || 'N/A'} · {selectedVendor.email}</p>
                        </div>
                    </div>

                    {/* Success Toast */}
                    {orderSuccess && (
                        <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem', animation: 'slideDown 0.3s ease' }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', flexShrink: 0 }}>✓</div>
                            <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.875rem' }}>
                                Order {isAdmin ? 'Booked' : 'Submitted for Approval'} Successfully!
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                        {/* Order Form */}
                        <div style={{ background: '#fff', borderRadius: 20, padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                            <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem', margin: '0 0 1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                                New Purchase Order
                            </h3>
                            <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Link to Inventory Item (Optional)</label>
                                    <select
                                        value={selectedMaterialId}
                                        onChange={e => {
                                            const mId = e.target.value;
                                            setSelectedMaterialId(mId);
                                            const m = materials.find(mat => mat.id === mId);
                                            if (m) setMaterialType(m.name);
                                        }}
                                        style={{ ...inputStyle }}
                                        onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                                        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                    >
                                        <option value="">— Generic Purchase —</option>
                                        {materials.map(m => (
                                            <option key={m.id} value={m.id}>{m.id} · {m.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Material Specification *</label>
                                    <input
                                        value={materialType}
                                        onChange={e => setMaterialType(e.target.value)}
                                        placeholder="e.g. Cold Rolled Steel S355"
                                        required
                                        style={inputStyle}
                                        onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                                        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Required Quantity *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={qty}
                                        onChange={e => setQty(e.target.value)}
                                        placeholder="Total units / kg"
                                        required
                                        style={{ ...inputStyle, borderColor: Number(qty) < 0 ? '#ef4444' : '#e2e8f0' }}
                                        onFocus={e => { e.target.style.borderColor = Number(qty) < 0 ? '#ef4444' : '#6366f1'; e.target.style.boxShadow = Number(qty) < 0 ? '0 0 0 3px rgba(239,68,68,0.1)' : '0 0 0 3px rgba(99,102,241,0.1)'; }}
                                        onBlur={e => { e.target.style.borderColor = Number(qty) < 0 ? '#ef4444' : '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                    />
                                    {Number(qty) < 0 && (
                                        <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: 4, fontWeight: 600 }}>⚠ Please enter a valid positive quantity. Negative values are not allowed.</div>
                                    )}
                                </div>

                                {/* Summary */}
                                <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 12, padding: '1rem' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Order Summary</div>
                                    {[
                                        { label: 'Supplier', value: selectedVendor.companyName },
                                        { label: 'Originator', value: currentUser.username },
                                        { label: 'Initial Status', value: isAdmin ? '🔵 Auto-Booked' : '🟡 Pending Approval', highlight: true },
                                    ].map(row => (
                                        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.8125rem' }}>
                                            <span style={{ color: '#94a3b8' }}>{row.label}</span>
                                            <span style={{ fontWeight: 700, color: row.highlight ? '#d97706' : '#0f172a' }}>{row.value}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    style={{
                                        padding: '0.875rem', background: 'linear-gradient(135deg, #0f0c29, #1a1a2e)',
                                        border: 'none', borderRadius: 12, color: '#fff',
                                        fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
                                        boxShadow: '0 6px 20px rgba(15,12,41,0.3)',
                                        transition: 'all 0.2s', letterSpacing: '0.05em',
                                    }}
                                    onMouseOver={e => (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'}
                                    onMouseOut={e => (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'}
                                >
                                    🛒 Place Order
                                </button>
                            </form>
                        </div>

                        {/* Order History */}
                        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>Supplier Order History</div>
                                <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 8, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700 }}>
                                    {orders.filter(o => o.vendorName === selectedVendor.companyName).length} orders
                                </span>
                            </div>
                            <div style={{ maxHeight: 440, overflowY: 'auto' }}>
                                {orders.filter(o => o.vendorName === selectedVendor.companyName).length === 0 ? (
                                    <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: 8 }}>📂</div>
                                        <div style={{ fontWeight: 600 }}>No order history</div>
                                        <div style={{ fontSize: '0.8rem', marginTop: 4 }}>Use the form to place your first order</div>
                                    </div>
                                ) : orders.filter(o => o.vendorName === selectedVendor.companyName).map((order, idx, arr) => {
                                    const sc = statusConfig[order.status] || statusConfig.Requested;
                                    return (
                                        <div key={order.id} style={{ padding: '1.125rem 1.5rem', borderBottom: idx < arr.length - 1 ? '1px solid #f8fafc' : 'none', display: 'flex', alignItems: 'center', gap: 14, transition: 'background 0.15s' }}
                                            onMouseOver={e => (e.currentTarget as HTMLDivElement).style.background = '#f8fafc'}
                                            onMouseOut={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                                        >
                                            <div style={{ width: 36, height: 36, borderRadius: 10, background: sc.bg, border: `1px solid ${sc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                                                {sc.icon}
                                            </div>
                                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.materialType}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 1 }}>
                                                    {order.quantity} units · {order.requestedBy}
                                                </div>
                                            </div>
                                            <span style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, padding: '3px 10px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                                {order.status}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}
            <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
    );
};

export default VendorOrders;
