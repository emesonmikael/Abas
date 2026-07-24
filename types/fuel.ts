export type FuelType = 'gasolina' | 'etanol' | 'diesel' | 'gnv' | 'flex';

export type VehicleStatus = 'active' | 'blocked' | 'maintenance';

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
  fuelType: FuelType;
  tankCapacityLiters: number;
  currentOdometerKm: number;
  avgKmPerLiterEstimate: number;
  nfcTagId: string; // Unique NFC Card UID or Token
  department: string;
  assignedDriverId?: string;
  status: VehicleStatus;
  notes?: string;
}

export interface Driver {
  id: string;
  name: string;
  cnh: string;
  cnhCategory: string;
  pin: string; // 4 to 6 digit numeric pin
  phone: string;
  status: 'active' | 'suspended';
  assignedVehiclePlate?: string;
}

export type TransactionStatus = 'approved' | 'rejected' | 'flagged';

export interface FuelTransaction {
  id: string;
  protocolNumber: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleModel: string;
  driverId: string;
  driverName: string;
  timestamp: string; // ISO date
  stationName: string;
  pumpNumber: string;
  attendantName: string;
  fuelType: FuelType;
  liters: number;
  pricePerLiter: number;
  totalValue: number;
  odometerKm: number;
  previousOdometerKm: number;
  kmDriven: number;
  calculatedKmPerLiter: number;
  nfcTagUsed: string;
  authenticatedWithPin: boolean;
  status: TransactionStatus;
  flags?: string[];
  notes?: string;
}

export interface NfcCardPayload {
  type: 'FLEET_FUEL_CARD';
  nfcTagId: string;
  plate: string;
  vehicleModel?: string;
  issuedAt?: string;
}
