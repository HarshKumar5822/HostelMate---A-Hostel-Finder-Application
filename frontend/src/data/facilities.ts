import type { Facility } from '../types';
import {
  Wifi, Snowflake, BatteryCharging, Shirt, WashingMachine, ParkingCircle,
  Camera, ShieldCheck, BookOpen, Dumbbell, Sofa, Sparkles,
  DoorOpen, Droplets, Refrigerator, Tv, GlassWater, ArrowUpDown, Fingerprint,
} from 'lucide-react';

export const FACILITY_META: Record<Facility, { label: string; icon: typeof Wifi }> = {
  wifi: { label: 'Wi-Fi', icon: Wifi },
  ac: { label: 'AC', icon: Snowflake },
  powerBackup: { label: 'Power Backup', icon: BatteryCharging },
  laundry: { label: 'Laundry', icon: Shirt },
  washingMachine: { label: 'Washing Machine', icon: WashingMachine },
  parking: { label: 'Parking', icon: ParkingCircle },
  cctv: { label: 'CCTV', icon: Camera },
  security: { label: 'Security', icon: ShieldCheck },
  studyRoom: { label: 'Study Room', icon: BookOpen },
  gym: { label: 'Gym', icon: Dumbbell },
  commonArea: { label: 'Common Area', icon: Sofa },
  housekeeping: { label: 'Housekeeping', icon: Sparkles },
  attachedBathroom: { label: 'Attached Bathroom', icon: DoorOpen },
  hotWater: { label: 'Hot Water', icon: Droplets },
  refrigerator: { label: 'Refrigerator', icon: Refrigerator },
  tv: { label: 'TV', icon: Tv },
  roWater: { label: 'RO Water', icon: GlassWater },
  lift: { label: 'Lift', icon: ArrowUpDown },
  biometric: { label: 'Biometric Entry', icon: Fingerprint },
};

export const FACILITY_LIST = Object.keys(FACILITY_META) as Facility[];
