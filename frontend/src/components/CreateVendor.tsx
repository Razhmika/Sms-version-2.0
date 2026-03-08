import React, { useState } from 'react';
import { VendorAccount } from '../types';
import { api } from '../api';

interface CreateVendorProps {
    vendors: VendorAccount[];
    onCreate: (vendor: any) => void;
    onDelete: (ids: number[]) => void;
}

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

const VENDOR_COLORS = [
    { bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)', shadow: 'rgba(99,102,241,0.35)' },
    { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', shadow: 'rgba(59,130,246,0.35)' },
    { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', shadow: 'rgba(245,158,11,0.35)' },
    { bg: 'linear-gradient(135deg, #10b981, #059669)', shadow: 'rgba(16,185,129,0.35)' },
    { bg: 'linear-gradient(135deg, #ec4899, #db2777)', shadow: 'rgba(236,72,153,0.35)' },
];

const CreateVendor: React.FC<CreateVendorProps> = ({ vendors, onCreate, onDelete }) => {
    const [form, setForm] = useState<Partial<VendorAccount>>({});
    const [success, setSuccess] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // OTP State
    const [otpSent, setOtpSent] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [otpError, setOtpError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.companyName || !form.email) return;

        const digits = (form.mobile || '').replace(/\D/g, '');
        if (form.mobile && digits.length !== 10) {
            setPhoneError('Phone number must be exactly 10 digits.');
            return;
        }
        setPhoneError('');
        setLoading(true);

        try {
            if (!otpSent) {
                // Step 1: Send OTP
                await api.sendVendorOtp(form.email);
                setOtpSent(true);
                setOtpError('');
            } else {
                // Step 2: Verify OTP and Create
                await api.verifyVendorOtp(form.email, otpInput);
                onCreate(form);
                setForm({ companyName: '', vendorName: '', email: '', mobile: '' });
                setOtpSent(false);
                setOtpInput('');
                setOtpError('');
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err: any) {
            setOtpError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', fontFamily: "'Inter',sans-serif", background: '#f8fafc', minHeight: '100%' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
                    Vendor Management Center
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '4px 0 0', fontWeight: 500 }}>
                    Onboard and manage industrial suppliers
                </p>
            </div>

            {/* Success Toast */}
            {success && (
                <div style={{
                    background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                    borderRadius: 12, padding: '1rem 1.25rem',
                    display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem',
                    animation: 'slideDown 0.3s ease',
                }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontSize: '1rem', flexShrink: 0 }}>✓</div>
                    <div>
                        <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.875rem' }}>Vendor Registered Successfully</div>
                        <div style={{ color: '#16a34a', fontSize: '0.8rem' }}>The vendor is now available for purchase orders.</div>
                    </div>
                </div>
            )}

            {/* Form */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" /><path d="m3 9 2.45-4.91A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.79 1.09L21 9" /><path d="M12 3v6" /></svg>
                    </div>
                    <div>
                        <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', margin: 0 }}>Register New Vendor</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>Complete the supplier profile</p>
                    </div>
                </div>
                <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {[
                        { label: 'Company Name *', key: 'companyName', type: 'text', placeholder: 'Acme Industrial Co.', span: false },
                        { label: 'Contact Person', key: 'vendorName', type: 'text', placeholder: 'John Smith', span: false },
                        { label: 'Email Address *', key: 'email', type: 'email', placeholder: 'vendor@company.com', span: false },
                    ].map(field => (
                        <div key={field.key} style={{ gridColumn: field.span ? '1 / -1' : undefined }}>
                            <label style={labelStyle}>{field.label}</label>
                            <input
                                type={field.type}
                                placeholder={field.placeholder}
                                value={(form as any)[field.key] || ''}
                                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                required={field.label.includes('*')}
                                disabled={otpSent && field.key === 'email'}
                                style={{
                                    ...inputStyle,
                                    background: (otpSent && field.key === 'email') ? '#f8fafc' : '#fff',
                                    color: (otpSent && field.key === 'email') ? '#94a3b8' : '#0f172a'
                                }}
                                onFocus={e => { if (!(otpSent && field.key === 'email')) { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; } }}
                                onBlur={e => { if (!(otpSent && field.key === 'email')) { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; } }}
                            />
                        </div>
                    ))}

                    {/* Mobile with validation */}
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Phone / Mobile</label>
                        <input
                            type="tel"
                            placeholder="10-digit number"
                            maxLength={10}
                            value={form.mobile || ''}
                            onChange={e => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setForm({ ...form, mobile: val });
                                if (phoneError) setPhoneError('');
                            }}
                            style={{
                                ...inputStyle,
                                borderColor: phoneError ? '#ef4444' : '#e2e8f0',
                                boxShadow: phoneError ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none',
                            }}
                            onFocus={e => { if (!phoneError) { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; } }}
                            onBlur={e => { if (!phoneError) { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; } }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                            {phoneError
                                ? <span style={{ color: '#ef4444', fontSize: '0.72rem', fontWeight: 600 }}>⚠ {phoneError}</span>
                                : <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Digits only, exactly 10</span>
                            }
                            <span style={{ fontSize: '0.72rem', color: (form.mobile?.length || 0) === 10 ? '#16a34a' : '#94a3b8', fontWeight: 600 }}>
                                {form.mobile?.length || 0}/10
                            </span>
                        </div>
                    </div>

                    {/* OTP Input Field */}
                    {otpSent && (
                        <div style={{ gridColumn: '1 / -1', background: 'rgba(99,102,241,0.05)', padding: '1.25rem', borderRadius: 12, border: '1px solid rgba(99,102,241,0.2)' }}>
                            <label style={{ ...labelStyle, color: '#4f46e5' }}>Enter verification code sent to {form.email}</label>
                            <input
                                type="text"
                                placeholder="6-digit OTP"
                                maxLength={6}
                                value={otpInput}
                                onChange={e => { setOtpInput(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                                required
                                style={{
                                    ...inputStyle,
                                    borderColor: otpError ? '#ef4444' : '#6366f1',
                                    boxShadow: otpError ? '0 0 0 3px rgba(239,68,68,0.1)' : '0 0 0 3px rgba(99,102,241,0.1)',
                                    fontSize: '1.25rem',
                                    letterSpacing: '0.2em',
                                    textAlign: 'center',
                                    fontWeight: 700
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                {otpError ? (
                                    <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 600 }}>⚠ {otpError}</span>
                                ) : (
                                    <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Code expires in 5 minutes</span>
                                )}
                                <button type="button" onClick={() => setOtpSent(false)} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Change Email</button>
                            </div>
                        </div>
                    )}

                    <div style={{ gridColumn: '1 / -1' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '0.875rem',
                                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                border: 'none', borderRadius: 12, color: '#fff',
                                fontWeight: 700, fontSize: '0.9rem', cursor: loading ? 'wait' : 'pointer',
                                boxShadow: loading ? 'none' : '0 6px 20px rgba(99,102,241,0.35)',
                                transition: 'all 0.2s',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                opacity: loading ? 0.7 : 1
                            }}
                            onMouseOver={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
                            onMouseOut={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)' }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                {otpSent ? (
                                    <>
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </>
                                ) : (
                                    <>
                                        <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                                        <path d="m3 9 2.45-4.91A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.79 1.09L21 9" />
                                        <path d="M12 3v6" />
                                    </>
                                )}
                            </svg>
                            {loading ? 'Processing...' : (otpSent ? 'Verify & Complete Registration' : 'Send Verification OTP')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Vendor Cards */}
            {vendors.length > 0 && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                            Registered Vendors
                            <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 8, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700 }}>{vendors.length}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {isDeleting ? (
                                <>
                                    <button onClick={() => { setIsDeleting(false); setSelectedIds([]); }} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>Cancel</button>
                                    <button onClick={() => { if (selectedIds.length > 0 && confirm(`Delete ${selectedIds.length} vendors?`)) { onDelete(selectedIds); setIsDeleting(false); setSelectedIds([]); } }} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: selectedIds.length > 0 ? '#ef4444' : '#fca5a5', color: '#fff', fontWeight: 700, fontSize: '0.75rem', cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed' }}>Confirm Delete ({selectedIds.length})</button>
                                </>
                            ) : (
                                <button onClick={() => setIsDeleting(true)} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>🗑 Delete</button>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                        {vendors.map((v, i) => {
                            const colorStyle = VENDOR_COLORS[i % VENDOR_COLORS.length];
                            return (
                                <div
                                    key={v.id || i}
                                    style={{
                                        position: 'relative',
                                        background: '#fff', borderRadius: 18, padding: '1.5rem',
                                        boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: selectedIds.includes(Number(v.id)) ? '2px solid #ef4444' : '1px solid #f1f5f9',
                                        transition: 'all 0.2s', cursor: isDeleting ? 'pointer' : 'default',
                                    }}
                                    onClick={() => {
                                        if (isDeleting) {
                                            const id = Number(v.id);
                                            if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(x => x !== id));
                                            else setSelectedIds([...selectedIds, id]);
                                        }
                                    }}
                                    onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${colorStyle.shadow}`; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                                    onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.125rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            {isDeleting && (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(Number(v.id))}
                                                    readOnly
                                                    style={{ transform: 'scale(1.2)' }}
                                                />
                                            )}
                                            <div style={{
                                                width: 48, height: 48, borderRadius: 14,
                                                background: colorStyle.bg,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#fff', fontWeight: 800, fontSize: '1.25rem',
                                                boxShadow: `0 4px 12px ${colorStyle.shadow}`,
                                            }}>
                                                {v.companyName[0].toUpperCase()}
                                            </div>
                                        </div>
                                        <span style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.2)', fontSize: '0.65rem', fontWeight: 800, padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            ✓ Verified
                                        </span>
                                    </div>
                                    <h4 style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', margin: '0 0 2px' }}>{v.companyName}</h4>
                                    <p style={{ color: '#64748b', fontSize: '0.8125rem', margin: '0 0 1rem' }}>{v.vendorName || 'No contact person'}</p>
                                    <div style={{ paddingTop: '0.875rem', borderTop: '1px solid #f8fafc', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#64748b' }}>
                                            <span style={{ width: 20, textAlign: 'center' }}>📧</span>
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.email}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#64748b' }}>
                                            <span style={{ width: 20, textAlign: 'center' }}>📞</span>
                                            <span>{v.mobile || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
            <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
    );
};

export default CreateVendor;
