from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from backend.database import Base
import datetime
import enum

class UserRole(str, enum.Enum):
    ADMIN = "Admin"
    STOCK_MANAGER = "Stock Manager"
    MANAGER = "Manager"
    DESIGNER = "Designer"

class OrderStatus(str, enum.Enum):
    REQUESTED = "Requested"
    APPROVED = "Approved"
    BOOKED = "Booked"
    DELIVERED = "Delivered"
    REJECTED = "Rejected"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(String)  # Store role as string for simplicity
    password = Column(String)
    mobile = Column(String, nullable=True)

class Material(Base):
    __tablename__ = "materials"
    id = Column(String, primary_key=True, index=True)  # Custom ID like M-101
    name = Column(String, index=True)
    category = Column(String)  # 'Plate', 'Pipe', 'Standard Item'
    materialType = Column(String, nullable=True)  # e.g. Stainless Steel, Iron, Aluminium
    productionStatus = Column(String, nullable=True)  # In Process / Done (for production items)
    lastModified = Column(DateTime, default=datetime.datetime.utcnow)
    minStock = Column(Float)
    
    # Plate & Pipe specific
    raw = Column(Float, nullable=True)
    process = Column(Float, nullable=True)
    
    # Dimensions (shared/specific)
    length = Column(Float, nullable=True)     # Plate, Pipe
    height = Column(Float, nullable=True)     # Plate
    width = Column(Float, nullable=True)      # Plate, Standard Item
    diameter = Column(Float, nullable=True)   # Pipe
    innerDiameter = Column(Float, nullable=True) # Standard Item
    outerDiameter = Column(Float, nullable=True) # Standard Item
    
    # Standard Item specific
    quantity = Column(Float, nullable=True)
    unit = Column(String, default="pieces")

class VendorAccount(Base):
    __tablename__ = "vendors"
    id = Column(Integer, primary_key=True, index=True)
    companyName = Column(String, unique=True)
    vendorName = Column(String)
    email = Column(String)
    mobile = Column(String)

class VendorOrder(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    material_id = Column(String, nullable=True) # Link to material
    materialType = Column(String)
    quantity = Column(Float)
    status = Column(String, default="Requested")
    vendorName = Column(String)
    requestedBy = Column(String)
