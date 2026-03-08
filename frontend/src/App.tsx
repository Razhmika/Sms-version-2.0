import React, { useState, useEffect } from 'react';
import { User, Material, VendorOrder, VendorAccount, UserRole } from './types';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StockTracking from './components/StockTracking';
import CreateEmployee from './components/CreateEmployee';
import CreateVendor from './components/CreateVendor';
import VendorOrders from './components/VendorOrders';
import { api } from './api';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<'inventory' | 'employees' | 'vendorAccounts' | 'vendorOrders'>('inventory');
    const [activeFilter, setActiveFilter] = useState<string>('raw');

    const [materials, setMaterials] = useState<Material[]>([]);
    const [orders, setOrders] = useState<VendorOrder[]>([]);
    const [vendors, setVendors] = useState<VendorAccount[]>([]);
    const [employees, setEmployees] = useState<User[]>([]);


    // Initial Seed & Fetch
    useEffect(() => {
        const init = async () => {
            try {
                await api.fetchMaterials(); // Test connection
                refreshData();
            } catch (err) {
                console.error("Backend connection failed", err);
            }
        };
        init();
    }, []);

    const refreshData = async () => {
        const [mats, ords, vends, emps] = await Promise.all([
            api.fetchMaterials(),
            api.fetchOrders(),
            api.fetchVendors(),
            api.fetchEmployees()
        ]);
        setMaterials(
            mats.map((m: any) =>
                m.category === 'Plate'
                    ? { ...m, breadth: m.breadth ?? m.height ?? 0 }
                    : m
            )
        );
        setOrders(ords);
        setVendors(vends);
        setEmployees(emps);
    };

    const handleLogin = async (credentials: any) => {
        try {
            const user = await api.login(credentials);
            setCurrentUser(user);
            if (user.role === UserRole.Admin) setActiveTab('employees');
            else setActiveTab('inventory');
        } catch (err) {
            alert("Login failed: " + (err as Error).message);
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setActiveTab('inventory');
    };



    // Action Handlers
    const handleAddMaterial = async (m: any) => {
        await api.createMaterial(m);
        refreshData();
    };

    const handleEditMaterial = async (m: any) => {
        await api.updateMaterial(m.id, m);
        refreshData();
    };

    const handleDeleteMaterials = async (ids: string[]) => {
        await Promise.all(ids.map(id => api.deleteMaterial(id)));
        refreshData();
    };

    const handleCreateEmployee = async (emp: any) => {
        await api.createEmployee(emp);
        refreshData();
    };

    const handleDeleteEmployees = async (ids: number[]) => {
        await Promise.all(ids.map(id => api.deleteEmployee(id)));
        refreshData();
    };

    const handleCreateVendor = async (vend: any) => {
        await api.createVendor(vend);
        refreshData();
    };

    const handleDeleteVendors = async (ids: number[]) => {
        await Promise.all(ids.map(id => api.deleteVendor(id)));
        refreshData();
    };

    const handleCreateOrder = async (order: any) => {
        await api.createOrder(order);
        refreshData();
    };

    const handleUpdateOrderStatus = async (id: number, status: string) => {
        await api.updateOrderStatus(id, status);
        refreshData();
    };

    // Computed
    const lowStockCount = materials.filter(m => {
        if (m.category === 'Standard Item') return m.quantity < m.minStock;
        return (m.raw || 0) < m.minStock || (m.process || 0) < m.minStock;
    }).length;

    if (!currentUser) return <Login onLogin={handleLogin} />;

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
            <Sidebar
                currentUser={currentUser}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                lowStockCount={lowStockCount}
                onLogout={handleLogout}
            />

            <main style={{ flex: 1, overflowY: 'auto', background: '#f8fafc' }}>
                {activeTab === 'inventory' && (
                    <>
                        <section style={{ margin: '1.25rem 1.25rem 0', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, boxShadow: '0 4px 20px rgba(15,23,42,0.05)' }}>
                            <Dashboard
                                materials={materials}
                                activeFilter={activeFilter}
                                setActiveFilter={setActiveFilter}
                            />
                        </section>
                        <StockTracking
                            materials={materials}
                            role={currentUser.role}
                            activeFilter={activeFilter}
                            onAdd={handleAddMaterial}
                            onEdit={handleEditMaterial}
                            onDelete={handleDeleteMaterials}
                        />
                    </>
                )}

                {activeTab === 'employees' && currentUser.role === UserRole.Admin && (
                    <CreateEmployee employees={employees} onCreate={handleCreateEmployee} onDelete={handleDeleteEmployees} />
                )}

                {activeTab === 'vendorAccounts' && currentUser.role === UserRole.Admin && (
                    <CreateVendor vendors={vendors} onCreate={handleCreateVendor} onDelete={handleDeleteVendors} />
                )}

                {activeTab === 'vendorOrders' && (currentUser.role === UserRole.Admin || currentUser.role === UserRole.Manager) && (
                    <VendorOrders
                        orders={orders}
                        vendors={vendors}
                        materials={materials}
                        currentUser={currentUser}
                        onCreateOrder={handleCreateOrder}
                        onUpdateStatus={handleUpdateOrderStatus}
                    />
                )}
            </main>
        </div>
    );
};

export default App;
