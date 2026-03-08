import React from 'react';
import { ICONS } from '../constants';
import { User, UserRole } from '../types';

interface SidebarProps {
    currentUser: User;
    activeTab: string;
    setActiveTab: (tab: any) => void;
    lowStockCount: number;
    onLogout: () => void;
}

const roleColors: Record<string, string> = {
    Admin: '#818cf8',
    Manager: '#f59e0b',
    StockManager: '#34d399',
    Designer: '#60a5fa',
};

const Sidebar: React.FC<SidebarProps> = ({ currentUser, activeTab, setActiveTab, lowStockCount, onLogout }) => {
    const isAdmin = currentUser.role === UserRole.Admin;
    const isManager = currentUser.role === UserRole.Manager || isAdmin;

    const navItems = [
        { id: 'inventory', label: 'Inventory', icon: ICONS.Inventory, show: true },
        { id: 'employees', label: 'User Control', icon: ICONS.Users, show: isAdmin },
        { id: 'vendorAccounts', label: 'Vendor Management', icon: ICONS.Vendors, show: isAdmin },
        { id: 'vendorOrders', label: 'Vendor Orders', icon: ICONS.Orders, show: isManager },
    ];

    return (
        <div style={{
            width: 258, minWidth: 258,
            background: 'linear-gradient(180deg, #0f0c29 0%, #1a1a2e 60%, #16213e 100%)',
            height: '100vh', display: 'flex', flexDirection: 'column',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            fontFamily: "'Inter', sans-serif",
            position: 'relative', zIndex: 10,
        }}>
            {/* Brand Header */}
            <div style={{
                padding: '1.5rem 1.25rem',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(99,102,241,0.08)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
                        flexShrink: 0,
                    }}>
                        <ICONS.Inventory style={{ color: 'white', width: 20, height: 20 }} />
                    </div>
                    <div>
                        <div style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.3px' }}>SMS Pro</div>
                        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Industrial ERP</div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0.5rem 0.75rem 0.75rem' }}>
                    Navigation
                </div>
                {navItems.filter(i => i.show).map(item => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                                padding: '0.75rem 1rem',
                                borderRadius: 12, border: 'none', cursor: 'pointer',
                                background: isActive
                                    ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))'
                                    : 'transparent',
                                color: isActive ? '#a5b4fc' : 'rgba(255,255,255,0.45)',
                                transition: 'all 0.2s',
                                position: 'relative',
                                outline: 'none',
                                textAlign: 'left',
                                boxShadow: isActive ? 'inset 0 0 0 1px rgba(99,102,241,0.3)' : 'none',
                            }}
                            onMouseOver={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'; }}
                            onMouseOut={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)'; } }}
                        >
                            {isActive && (
                                <div style={{
                                    position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                                    width: 3, height: 20, borderRadius: '0 4px 4px 0',
                                    background: 'linear-gradient(#6366f1, #8b5cf6)',
                                }} />
                            )}
                            <item.icon style={{ width: 18, height: 18, flexShrink: 0, color: isActive ? '#818cf8' : undefined }} />
                            <span style={{ fontWeight: isActive ? 600 : 500, fontSize: '0.875rem', flex: 1 }}>{item.label}</span>
                            {item.id === 'inventory' && lowStockCount > 0 && (
                                <span style={{
                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                    color: '#fff', fontSize: '0.65rem', fontWeight: 800,
                                    padding: '2px 7px', borderRadius: 20,
                                    boxShadow: '0 2px 8px rgba(239,68,68,0.5)',
                                    animation: 'pulse 2s ease-in-out infinite',
                                }}>{lowStockCount}</span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* User Card */}
            <div style={{
                padding: '1rem 0.75rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
                <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14, padding: '0.875rem 1rem',
                    marginBottom: 8,
                    display: 'flex', alignItems: 'center', gap: 10,
                }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: `linear-gradient(135deg, ${roleColors[currentUser.role] || '#6366f1'}, rgba(99,102,241,0.5))`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 800, fontSize: '1rem',
                        boxShadow: `0 4px 12px ${roleColors[currentUser.role] || '#6366f1'}40`,
                    }}>
                        {currentUser.username[0].toUpperCase()}
                    </div>
                    <div style={{ overflow: 'hidden', flex: 1 }}>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {currentUser.username}
                        </div>
                        <div style={{
                            color: roleColors[currentUser.role] || '#818cf8',
                            fontSize: '0.7rem', fontWeight: 600,
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                        }}>
                            {currentUser.role}
                        </div>
                    </div>
                </div>

                <button
                    onClick={onLogout}
                    style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        padding: '0.625rem', borderRadius: 10, border: '1px solid rgba(239,68,68,0.2)',
                        background: 'rgba(239,68,68,0.08)', color: 'rgba(239,68,68,0.7)',
                        fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.15)'; (e.currentTarget as HTMLButtonElement).style.color = '#fca5a5'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.4)'; }}
                    onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(239,68,68,0.7)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.2)'; }}
                >
                    <ICONS.Logout style={{ width: 15, height: 15 }} />
                    Sign Out
                </button>
            </div>

            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}`}</style>
        </div>
    );
};

export default Sidebar;
