import React from 'react';
import { Material } from '../types';

interface DashboardProps {
    materials: Material[];
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
}

const STAT_STYLES = [
    { gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', shadow: 'rgba(59,130,246,0.35)', iconBg: 'rgba(59,130,246,0.12)', icon: '🏗️', badge: 'Raw' },
    { gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', shadow: 'rgba(245,158,11,0.35)', iconBg: 'rgba(245,158,11,0.12)', icon: '⚙️', badge: 'WIP' },
    { gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)', shadow: 'rgba(99,102,241,0.35)', iconBg: 'rgba(99,102,241,0.12)', icon: '📦', badge: 'STD' },
];

const Dashboard: React.FC<DashboardProps> = ({ materials, activeFilter, setActiveFilter }) => {
    const totalRaw = materials.reduce((acc, m) => acc + (m.id.startsWith('RM-') ? (m as any).raw || 0 : 0), 0);
    const totalProcess = materials.reduce((acc, m) => acc + (m.id.startsWith('PR-') ? (m as any).process || 0 : 0), 0);
    const totalStandard = materials.reduce((acc, m) => acc + ((m.id.startsWith('SI-') || m.category === 'Standard Item') ? (m as any).quantity || 0 : 0), 0);
    const totalItems = materials.length;
    const lowStockItems = materials.filter(m => {
        if (m.id.startsWith('SI-') || m.category === 'Standard Item') return (m as any).quantity < m.minStock;
        if (m.id.startsWith('PR-')) return ((m as any).process || 0) < m.minStock;
        return ((m as any).raw || 0) < m.minStock;
    }).length;

    const stats = [
        { id: 'raw', label: 'Raw Materials', sublabel: 'Unprocessed stock', value: totalRaw, unit: 'pieces', style: STAT_STYLES[0] },
        { id: 'products', label: 'Work In Progress', sublabel: 'Active production', value: totalProcess, unit: 'pieces', style: STAT_STYLES[1] },
        { id: 'standard', label: 'Standard Parts', sublabel: 'Component inventory', value: totalStandard, unit: 'pieces', style: STAT_STYLES[2] },
    ];

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div style={{ padding: '2rem', fontFamily: "'Inter', sans-serif", background: 'transparent' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
                            Inventory Command
                        </h1>
                        {lowStockItems > 0 && (
                            <span style={{
                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                                padding: '3px 10px', borderRadius: 20,
                                animation: 'pulse 2s ease-in-out infinite',
                                whiteSpace: 'nowrap',
                            }}>
                                {lowStockItems} ALERT{lowStockItems > 1 ? 'S' : ''}
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div style={{
                            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
                            padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: 8,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            whiteSpace: 'nowrap',
                        }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.6)' }} />
                            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>{totalItems} SKUs</span>
                        </div>
                    </div>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0, fontWeight: 500 }}>{dateStr}</p>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', width: '100%' }}>
                {stats.map(stat => {
                    const isActive = activeFilter === stat.id;
                    return (
                        <button
                            key={stat.id}
                            onClick={() => setActiveFilter(stat.id)}
                            style={{
                                background: isActive ? stat.style.gradient : '#fff',
                                border: isActive ? 'none' : '1px solid #e2e8f0',
                                borderRadius: 18, padding: '1.5rem',
                                textAlign: 'left', cursor: 'pointer',
                                boxShadow: isActive ? `0 12px 32px ${stat.style.shadow}` : '0 1px 4px rgba(0,0,0,0.04)',
                                transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                                transition: 'all 0.25s',
                                outline: 'none',
                            }}
                            onMouseOver={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; } }}
                            onMouseOut={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; } }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: isActive ? 'rgba(255,255,255,0.2)' : stat.style.iconBg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.25rem',
                                }}>
                                    {stat.style.icon}
                                </div>
                                <span style={{
                                    fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.08em',
                                    background: isActive ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                                    color: isActive ? '#fff' : '#64748b',
                                    padding: '3px 8px', borderRadius: 6,
                                }}>{stat.style.badge}</span>
                            </div>
                            <div style={{ fontSize: '2.25rem', fontWeight: 900, color: isActive ? '#fff' : '#0f172a', lineHeight: 1, letterSpacing: '-1px', marginBottom: 4 }}>
                                {stat.value.toLocaleString()}
                                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: isActive ? 'rgba(255,255,255,0.7)' : '#94a3b8', marginLeft: 4 }}>{stat.unit}</span>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: isActive ? 'rgba(255,255,255,0.9)' : '#1e293b' }}>{stat.label}</div>
                            <div style={{ fontSize: '0.75rem', color: isActive ? 'rgba(255,255,255,0.6)' : '#94a3b8', marginTop: 2 }}>{stat.sublabel}</div>
                        </button>
                    );
                })}
            </div>

            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}`}</style>
        </div>
    );
};

export default Dashboard;