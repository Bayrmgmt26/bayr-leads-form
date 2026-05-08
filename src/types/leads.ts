import { Timestamp } from "firebase/firestore";

export type LeadStatus = "NEW" | "CONTACTED" | "SCHEDULED";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  zip: string;
  service: string;
  details?: string;
  status: LeadStatus;
  createdAt?: Timestamp;
};
