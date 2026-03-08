from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str
    role: str
    mobile: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

class MaterialBase(BaseModel):
    id: str
    name: str
    category: str
    materialType: Optional[str] = None
    productionStatus: Optional[str] = None
    minStock: float
    raw: Optional[float] = None
    process: Optional[float] = None
    length: Optional[float] = None
    height: Optional[float] = None
    width: Optional[float] = None
    diameter: Optional[float] = None
    innerDiameter: Optional[float] = None
    outerDiameter: Optional[float] = None
    quantity: Optional[float] = None
    unit: Optional[str] = "pieces"

class MaterialCreate(MaterialBase):
    pass

class MaterialUpdate(BaseModel):
    name: Optional[str] = None
    materialType: Optional[str] = None
    productionStatus: Optional[str] = None
    unit: Optional[str] = None
    minStock: Optional[float] = None
    raw: Optional[float] = None
    process: Optional[float] = None
    length: Optional[float] = None
    height: Optional[float] = None
    width: Optional[float] = None
    diameter: Optional[float] = None
    innerDiameter: Optional[float] = None
    outerDiameter: Optional[float] = None
    quantity: Optional[float] = None

class MaterialResponse(MaterialBase):
    lastModified: datetime
    class Config:
        from_attributes = True

class VendorAccountBase(BaseModel):
    companyName: str
    vendorName: str
    email: str
    mobile: str

class VendorAccountCreate(VendorAccountBase):
    pass

class VendorAccountResponse(VendorAccountBase):
    id: int
    class Config:
        from_attributes = True

class VendorOrderBase(BaseModel):
    material_id: Optional[str] = None
    materialType: str
    quantity: float
    status: str
    vendorName: str
    requestedBy: str

class VendorOrderCreate(VendorOrderBase):
    pass

class VendorOrderResponse(VendorOrderBase):
    id: int
    class Config:
        from_attributes = True

