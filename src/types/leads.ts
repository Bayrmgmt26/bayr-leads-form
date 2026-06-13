export type LeadStatus = "new" | "contacted" | "scheduled" | "won" | "lost";

export type Lead = {
  id: string;
  name?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  zip?: string;
  service?: string;
  location?: string;
  notes?: string;
  details?: string;
  source?: string;
  sourceUrl?: string;
  priority?: string;
  status?: LeadStatus;
  createdAt?: any;
};