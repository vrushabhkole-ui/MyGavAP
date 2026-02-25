
export type Language = 'en' | 'hi' | 'mr';
export type UserRole = 'user' | 'admin';

export enum ServiceType {
  GRAMPANCHAYAT = 'grampanchayat',
  ELECTRICITY = 'electricity',
  GAS = 'gas',
  CHAVDI = 'chavdi',
  HEALTH = 'health',
  MARKET = 'market',
  SAHAYAK = 'sahayak',
  BUSINESS = 'business'
}

export type BillType = 'Water' | 'Electricity' | 'Home Tax' | 'Gas' | 'GS Bill' | 'Business License' | 'Mandi Fee' | 'Other Service';

export interface LocalBusiness {
  id: string;
  name: string;
  category: string;
  contact: string;
  hours: string;
  description: string;
  ownerName: string;
  village: string;
  subDistrict: string;
  status: 'Pending' | 'Approved';
  proof?: FileMetadata;
}

export interface StoredAccount extends UserProfile {
  password?: string;
  avatarColor: string;
}

export interface Bill {
  id: string;
  userId: string;
  village: string;
  subDistrict: string;
  type: BillType;
  amount: number;
  dueDate: string;
  issuedAt: string;
  status: 'Unpaid' | 'Paid';
  description?: string;
}

export interface Transaction {
  id: string;
  billId: string;
  userId: string;
  userName: string;
  village: string;
  subDistrict: string;
  type: BillType;
  amount: number;
  recipient: string;
  vpa: string;
  timestamp: string;
  status: 'Success' | 'Failed';
  referenceId: string;
}

export interface VillageNotice {
  id: string;
  village: string;
  subDistrict: string;
  title: string;
  content: string;
  category: 'General' | 'Water' | 'Electricity' | 'Meeting' | 'Business';
  date: string;
}

export interface LocalizedString {
  en: string;
  hi: string;
  mr: string;
}

export interface ServiceInfo {
  id: ServiceType;
  title: LocalizedString;
  icon: string;
  color: string;
  description: LocalizedString;
  details: LocalizedString[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  address?: string;
  pincode?: string;
  state: string;
  district: string;
  subDistrict: string;
  village: string;
  role: UserRole;
  department?: ServiceType;
  joinedAt?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'info' | 'success';
}

export type RequestStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Cancelled';

export interface CertificateData {
  village: string;
  type: string;
  fullName: string;
  date: string;
  certificateNo: string;
  issuedAt: string;
}

export interface SatbaraData {
  district: string;
  taluka: string;
  village: string;
  gatNumber: string;
  fullName: string;
}

export interface ServiceRequest {
  id: string;
  userId: string;
  userName: string;
  village: string;
  subDistrict: string;
  serviceId: ServiceType;
  serviceTitle: string;
  description: string;
  status: RequestStatus;
  createdAt: string;
  source: 'user' | 'admin';
  adminReport?: string;
  adminDocument?: FileMetadata;
  userDocument?: FileMetadata;
  certificateData?: CertificateData;
}

export interface FileMetadata {
  name: string;
  url: string;
  type: string;
}
