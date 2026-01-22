export interface DashboardSummary {
  overdueCount: number;
  upcomingCount: number;
  totalContacts: number;
  contactsByCategory: Map<string, number>;
}
