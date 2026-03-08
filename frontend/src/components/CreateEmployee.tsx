import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface CreateEmployeeProps {
    employees: User[];
    onCreate: (user: User) => void;
    onDelete: (ids: number[]) => void;
}

const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: '#f8fafc', border: '1px solid #e2e8f0',
    borderRadius: 10, padding: '0.75rem 1rem',
    fontSize: '0.875rem', color: '#0f172a', outline: 'none',
    transition: 'all 0.2s', fontFamily: "'Inter',sans-serif",
};
const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.75rem', fontWeight: 600,
    color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em',
};

const roleColors: Record<string, { bg: string; text: string; border: string }> = {
    Admin: { bg: 'rgba(99,102,241,0.1)', text: '#4f46e5', border: 'rgba(99,102,241,0.25)' },
    Manager: { bg: 'rgba(245,158,11,0.1)', text: '#d97706', border: 'rgba(245,158,11,0.25)' },
    StockManager: { bg: 'rgba(34,197,94,0.1)', text: '#16a34a', border: 'rgba(34,197,94,0.25)' },
    Designer: { bg: 'rgba(59,130,246,0.1)', text: '#2563eb', border: 'rgba(59,130,246,0.25)' },
};

const CreateEmployee: React.FC<CreateEmployeeProps> = ({ employees, onCreate, onDelete }) => {
    const [form, setForm] = useState<Partial<User>>({ role: UserRole.StockManager });
    const [success, setSuccess] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.username || !form.email || !form.password) return;
        const digits = (form.mobile || '').replace(/\D/g, '');
        if (form.mobile && digits.length !== 10) {
            setPhoneError('Phone number must be exactly 10 digits.');
            return;
        }
        setPhoneError('');
        onCreate(form as User);
        setForm({ role: UserRole.StockManager, username: '', email: '', password: '', mobile: '' });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <div style={{ padding: '2rem', fontFamily: "'Inter',sans-serif", background: '#f8fafc', minHeight: '100%' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
                    User Control Center
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '4px 0 0', fontWeight: 500 }}>
                    Create and manage internal system access accounts
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
                        <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.875rem' }}>Account Created Successfully</div>
                        <div style={{ color: '#16a34a', fontSize: '0.8rem' }}>The new user can now log in with their credentials.</div>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                {/* Form */}
                <div style={{ background: '#fff', borderRadius: 20, padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                        </div>
                        <div>
                            <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', margin: 0 }}>Register New Employee</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>Fill in all required fields</p>
                        </div>
                    </div>

                    <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { label: 'Username *', key: 'username', type: 'text', placeholder: 'john.doe' },
                            { label: 'Email Address *', key: 'email', type: 'email', placeholder: 'john@company.com' },
                            { label: 'Temporary Password *', key: 'password', type: 'password', placeholder: '••••••••' },
                        ].map(field => (
                            <div key={field.key}>
                                <label style={labelStyle}>{field.label}</label>
                                <input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={(form as any)[field.key] || ''}
                                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                    required={field.label.includes('*')}
                                    style={{ ...inputStyle, background: '#fff' }}
                                    onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; e.target.style.background = '#fff'; }}
                                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        ))}

                        {/* Mobile with validation */}
                        <div>
                            <label style={labelStyle}>Mobile Number</label>
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
                                    ...inputStyle, background: '#fff',
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

                        <div>
                            <label style={labelStyle}>Access Role</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                {[
                                    { value: UserRole.StockManager, label: 'Stock Manager', icon: '📦' },
                                    { value: UserRole.Manager, label: 'Manager', icon: '📊' },
                                    { value: UserRole.Designer, label: 'Designer', icon: '🎨' },
                                ].map(opt => (
                                    <button
                                        key={opt.value} type="button"
                                        onClick={() => setForm({ ...form, role: opt.value })}
                                        style={{
                                            padding: '0.625rem 0.75rem', borderRadius: 10, border: '1.5px solid',
                                            borderColor: form.role === opt.value ? '#6366f1' : '#e2e8f0',
                                            background: form.role === opt.value ? 'rgba(99,102,241,0.06)' : '#fff',
                                            color: form.role === opt.value ? '#4f46e5' : '#64748b',
                                            fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s',
                                            display: 'flex', alignItems: 'center', gap: 6,
                                        }}
                                    >
                                        <span>{opt.icon}</span> {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={{
                                marginTop: 8, padding: '0.875rem',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                border: 'none', borderRadius: 12, color: '#fff',
                                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                                boxShadow: '0 6px 20px rgba(99,102,241,0.35)',
                                transition: 'all 0.2s',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            }}
                            onMouseOver={e => (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'}
                            onMouseOut={e => (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                            Create Account
                        </button>
                    </form>
                </div>

                {/* Employee List */}
                <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>Active Employees</div>
                            <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 8, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700 }}>{employees.length} total</span>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {isDeleting ? (
                                <>
                                    <button onClick={() => { setIsDeleting(false); setSelectedIds([]); }} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>Cancel</button>
                                    <button onClick={() => { if (selectedIds.length > 0 && confirm(`Delete ${selectedIds.length} employees?`)) { onDelete(selectedIds); setIsDeleting(false); setSelectedIds([]); } }} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: selectedIds.length > 0 ? '#ef4444' : '#fca5a5', color: '#fff', fontWeight: 700, fontSize: '0.75rem', cursor: selectedIds.length > 0 ? 'pointer' : 'not-allowed' }}>Confirm Delete ({selectedIds.length})</button>
                                </>
                            ) : (
                                <button onClick={() => setIsDeleting(true)} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>🗑 Delete</button>
                            )}
                        </div>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                                {isDeleting && <th style={{ padding: '0.75rem 1.25rem', width: 40 }}></th>}
                                {['Employee', 'Role', 'Contact', 'Status'].map((h, i) => (
                                    <th key={i} style={{ padding: '0.75rem 1.25rem', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length === 0 ? (
                                <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>👥</div>
                                    <div style={{ fontWeight: 600 }}>No employees yet</div>
                                </td></tr>
                            ) : employees.map((emp, i) => {
                                const rc = roleColors[emp.role] || roleColors.Designer;
                                return (
                                    <tr key={i} style={{ borderBottom: i < employees.length - 1 ? '1px solid #f8fafc' : 'none', transition: 'background 0.15s' }}
                                        onMouseOver={e => (e.currentTarget as HTMLTableRowElement).style.background = '#f8fafc'}
                                        onMouseOut={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                                    >
                                        {isDeleting && (
                                            <td style={{ padding: '1rem 1.25rem' }}>
                                                {emp.role !== UserRole.Admin && (
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(Number(emp.id))}
                                                        onChange={(e) => {
                                                            const id = Number(emp.id);
                                                            if (e.target.checked) setSelectedIds([...selectedIds, id]);
                                                            else setSelectedIds(selectedIds.filter(v => v !== id));
                                                        }}
                                                        style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                                                    />
                                                )}
                                            </td>
                                        )}
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{
                                                    width: 36, height: 36, borderRadius: 10,
                                                    background: rc.bg, color: rc.text,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 800, fontSize: '0.875rem', border: `1px solid ${rc.border}`, flexShrink: 0,
                                                }}>
                                                    {emp.username[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.875rem' }}>{emp.username}</div>
                                                    <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>ID #{emp.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <span style={{ background: rc.bg, color: rc.text, border: `1px solid ${rc.border}`, padding: '4px 10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700 }}>
                                                {emp.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ fontSize: '0.8125rem', color: '#475569' }}>{emp.email}</div>
                                            {emp.mobile && <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{emp.mobile}</div>}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', fontWeight: 600, color: '#16a34a' }}>
                                                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 0 3px rgba(34,197,94,0.15)' }} />
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
    );
};

export default CreateEmployee;
