import { SafetyReport } from '../types/safety';
import { INITIAL_REPORTS } from '../data/mockData';

const STORAGE_KEY = 'safetybuddy_community_reports';

export class ReportService {
  private static reports: SafetyReport[] = [];

  public static initialize(): SafetyReport[] {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          this.reports = JSON.parse(stored);
          return this.reports;
        }
      } catch (e) {
        console.warn('Could not read stored reports, falling back to initial data', e);
      }
    }
    this.reports = [...INITIAL_REPORTS];
    return this.reports;
  }

  public static getReports(): SafetyReport[] {
    if (this.reports.length === 0) {
      return this.initialize();
    }
    return this.reports;
  }

  public static addReport(newReport: {
    areaName: string;
    category: SafetyReport['category'];
    severity: SafetyReport['severity'];
    description: string;
    approxLat?: number;
    approxLng?: number;
    hasEvidence?: boolean;
  }): SafetyReport {
    // Add jitter to approximate coordinates to protect exact user location
    const jitterLat = (Math.random() - 0.5) * 0.002;
    const jitterLng = (Math.random() - 0.5) * 0.002;

    const report: SafetyReport = {
      id: `rep-${Date.now().toString(36)}`,
      areaName: newReport.areaName || 'Local Sector',
      category: newReport.category,
      severity: newReport.severity,
      description: newReport.description,
      reportedAt: 'Just now',
      timestamp: Date.now(),
      upvotes: 1,
      status: 'approved',
      approxLat: (newReport.approxLat || 37.7760) + jitterLat,
      approxLng: (newReport.approxLng || -122.4180) + jitterLng,
      hasEvidence: !!newReport.hasEvidence,
    };

    this.reports = [report, ...this.reports];
    this.persist();
    return report;
  }

  public static upvoteReport(id: string): void {
    this.reports = this.reports.map((r) =>
      r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r
    );
    this.persist();
  }

  public static updateStatus(id: string, status: SafetyReport['status']): void {
    this.reports = this.reports.map((r) =>
      r.id === id ? { ...r, status } : r
    );
    this.persist();
  }

  private static persist(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.reports));
      } catch (e) {
        console.warn('Failed to persist reports', e);
      }
    }
  }
}
