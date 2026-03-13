const API_BASE_URL = 'http://localhost:8000';

export const api = {
    async login(credentials: any) {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        if (!res.ok) throw new Error('Invalid credentials');
        return res.json();
    },
    async fetchMaterials() {
        const res = await fetch(`${API_BASE_URL}/materials`);
        return res.json();
    },
    async createMaterial(data: any) {
        const res = await fetch(`${API_BASE_URL}/materials`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },
    async updateMaterial(id: string, data: any) {
        const res = await fetch(`${API_BASE_URL}/materials/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },
    async deleteMaterial(id: string) {
        const res = await fetch(`${API_BASE_URL}/materials/${id}`, {
            method: 'DELETE',
        });
        return res.json();
    },
    async fetchVendors() {
        const res = await fetch(`${API_BASE_URL}/vendors`);
        return res.json();
    },
    async createVendor(data: any) {
        const res = await fetch(`${API_BASE_URL}/vendors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },
    async sendVendorOtp(email: string, companyName: string) {
        const res = await fetch(`${API_BASE_URL}/vendors/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, company_name: companyName }),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
    async verifyVendorOtp(email: string, otp: string) {
        const res = await fetch(`${API_BASE_URL}/vendors/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
        });
        if (!res.ok) throw new Error('Invalid or expired OTP');
        return res.json();
    },
    async fetchOrders() {
        const res = await fetch(`${API_BASE_URL}/orders`);
        return res.json();
    },
    async createOrder(data: any) {
        const res = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },
    async updateOrderStatus(id: number, status: string) {
        const res = await fetch(`${API_BASE_URL}/orders/${id}/status?status=${status}`, {
            method: 'PATCH',
        });
        return res.json();
    },
    async fetchEmployees() {
        const res = await fetch(`${API_BASE_URL}/employees`);
        return res.json();
    },
    async createEmployee(data: any) {
        const res = await fetch(`${API_BASE_URL}/employees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    },
    async deleteEmployee(id: number) {
        const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
            method: 'DELETE',
        });
        return res.json();
    },
    async deleteVendor(id: number) {
        const res = await fetch(`${API_BASE_URL}/vendors/${id}`, {
            method: 'DELETE',
        });
        return res.json();
    },
    async analyzeStock() {
        const res = await fetch(`${API_BASE_URL}/ai/analyze`);
        return res.json();
    }
};
