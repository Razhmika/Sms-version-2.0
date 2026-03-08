export enum UserRole {
  Admin = 'Admin',
  StockManager = 'Stock Manager',
  Manager = 'Manager',
  Designer = 'Designer',
}

export interface User {
  id?: number;
  username: string;
  email: string;
  role: UserRole;
  password?: string;
  mobile?: string;
}

export type MaterialCategory = 'Plate' | 'Pipe' | 'Standard Item';

export interface BaseMaterial {
  id: string;
  name: string;
  category: MaterialCategory;
  materialType?: string;
  productionStatus?: 'In Process' | 'Done' | string;
  unit?: string;
  lastModified: string;
  minStock: number;
}

export interface PlateMaterial extends BaseMaterial {
  category: 'Plate';
  raw: number;
  process: number;
  length: number;
  breadth: number;
  height?: number;
  width: number;
}

export interface PipeMaterial extends BaseMaterial {
  category: 'Pipe';
  raw: number;
  process: number;
  diameter: number;
  length: number;
}

export interface StandardItemMaterial extends BaseMaterial {
  category: 'Standard Item';
  quantity: number;
  innerDiameter: number;
  outerDiameter: number;
  width: number;
}

export type Material = PlateMaterial | PipeMaterial | StandardItemMaterial;

export enum OrderStatus {
  Requested = 'Requested',
  Approved = 'Approved',
  Booked = 'Booked',
  Delivered = 'Delivered',
  Rejected = 'Rejected',
}

export interface VendorOrder {
  id: number;
  material_id?: string;
  materialType: string;
  quantity: number;
  status: OrderStatus;
  vendorName: string;
  requestedBy: string;
}

export interface VendorAccount {
  id: number;
  companyName: string;
  vendorName: string;
  email: string;
  mobile: string;
}
