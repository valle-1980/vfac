export type Role = "client" | "employee" | "admin" | "provider" | "it";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  label: string;
  description: string;
};

export type Residence = {
  id: string;
  ownerId: string;
  name: string;
  type: string;
  standard: string;
  plan: string;
  mappingMode: string;
  addressLabel: string;
  areaM2: number;
  roomsCount: number;
  inventoryCount: number;
};

export type Room = {
  id: string;
  residenceId: string;
  name: string;
  category: string;
  items: number;
};

export type InventoryItem = {
  id: string;
  roomId: string;
  name: string;
  category: string;
  status: string;
  nextService: string;
  notes: string;
};

export type ServiceRequest = {
  id: string;
  residenceId: string;
  createdBy: string;
  title: string;
  category: string;
  room: string;
  status: string;
  priority: string;
  origin: string;
  description: string;
  providerVisibleToClient: boolean;
  estimatedCredits: number;
};

export type Provider = {
  id: string;
  firstName: string;
  company: string;
  document: string;
  categories: string[];
  rating: number;
  status: string;
};

export type Quote = {
  id: string;
  serviceRequestId: string;
  providerId: string;
  status: string;
  laborCredits: number;
  materialCredits: number;
  travelCredits: number;
  totalCredits: number;
  withMaterial: boolean;
  eta: string;
};

export type CreditWallet = {
  id: string;
  residenceId: string;
  cycle: string;
  monthlyCredits: number;
  usedCredits: number;
  availableCredits: number;
  expiresAt: string;
};

export type CreditMatrixItem = {
  id: string;
  category: string;
  service: string;
  complexity: string;
  laborCredits: number;
  materialCredits: number;
  travelCredits: number;
  totalWithMaterial: number;
  totalWithoutMaterial: number;
  firstVisitEligible: boolean;
};

export type Audit = {
  id: string;
  serviceRequestId: string;
  type: string;
  status: string;
  reason: string;
  scheduledFor: string;
};
