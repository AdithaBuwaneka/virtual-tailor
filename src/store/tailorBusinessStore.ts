// store/tailorBusinessStore.ts - Tailor Business Management State
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  BusinessMetrics, 
  CustomerProfile, 
  PortfolioProject, 
  InventoryItem, 
  TimeEntry,
  CapacityPlan,
  AutomatedReport
} from '../types/tailorBusiness';
import type { MarketInsight } from '../types/tailorBusiness';
import type { CommunicationRecord, CustomerSegment } from '../types/tailorCRM';

interface TailorBusinessState {
  // Business Analytics
  businessMetrics: BusinessMetrics | null;
  revenueData: unknown[];
  marketInsights: MarketInsight;
  
  // Portfolio Management
  portfolioProjects: PortfolioProject[];
  certifications: unknown[];
  portfolioAnalytics: Record<string, unknown>;
  
  // Customer Relationship Management
  customerProfiles: CustomerProfile[];
  communicationRecords: CommunicationRecord[];
  customerSegments: CustomerSegment[];
  
  // Business Operations
  inventoryItems: InventoryItem[];
  timeEntries: TimeEntry[];
  productivityMetrics: Record<string, unknown>;
  capacityPlan: CapacityPlan | null;
  automatedReports: AutomatedReport[];
  
  // Loading States
  loading: {
    analytics: boolean;
    portfolio: boolean;
    customers: boolean;
    operations: boolean;
  };
  
  // Actions - Business Analytics
  updateBusinessMetrics: (metrics: BusinessMetrics) => void;
  updateGoals: (goals: Record<string, unknown>) => void;
  
  // Actions - Portfolio Management
  createPortfolioProject: (project: Partial<PortfolioProject>) => void;
  updatePortfolioProject: (projectId: string, updates: Partial<PortfolioProject>) => void;
  deletePortfolioProject: (projectId: string) => void;
  publishProject: (projectId: string) => void;
  featureProject: (projectId: string) => void;
  
  // Actions - Customer Management
  addCustomerNote: (customerId: string, note: string) => void;
  updateCustomerProfile: (customerId: string, updates: Partial<CustomerProfile>) => void;
  scheduleFollowUp: (customerId: string, date: Date, note: string) => void;
  createCustomerSegment: (segment: CustomerSegment) => void;
  
  // Actions - Business Operations
  addInventoryItem: (item: Partial<InventoryItem>) => void;
  updateInventoryStock: (itemId: string, quantity: number, reason: string) => void;
  startTimeEntry: (entry: Partial<TimeEntry>) => void;
  endTimeEntry: (entryId: string) => void;
  updateCapacityPlan: (updates: Partial<CapacityPlan>) => void;
  createAutomatedReport: (report: Partial<AutomatedReport>) => void;
  
  // Utility Actions
  setLoading: (section: keyof TailorBusinessState['loading'], loading: boolean) => void;
}

export const useTailorBusinessStore = create<TailorBusinessState>()(
  persist(
    (set, get) => ({
      // Initial State
      businessMetrics: null,
      revenueData: [],
      marketInsights: {} as MarketInsight,
      portfolioProjects: [],
      certifications: [],
      portfolioAnalytics: {},
      customerProfiles: [],
      communicationRecords: [],
      customerSegments: [],
      inventoryItems: [],
      timeEntries: [],
      productivityMetrics: {},
      capacityPlan: null,
      automatedReports: [],
      loading: {
        analytics: false,
        portfolio: false,
        customers: false,
        operations: false
      },

      // Business Analytics Actions
      updateBusinessMetrics: (metrics) => {
        set({ businessMetrics: metrics });
      },

      updateGoals: (goals) => {
        console.log('Goals updated:', goals);
      },

      // Portfolio Management Actions
      createPortfolioProject: (projectData) => {
        const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const newProject: PortfolioProject = {
          id: projectId,
          title: projectData.title || 'Untitled Project',
          description: projectData.description || '',
          garmentType: projectData.garmentType || 'Custom',
          style: projectData.style || 'Modern',
          techniques: projectData.techniques || [],
          materials: projectData.materials || [],
          timeToComplete: projectData.timeToComplete || 0,
          difficulty: projectData.difficulty || 'intermediate',
          price: projectData.price || 0,
          currency: projectData.currency || 'USD',
          status: projectData.status || 'draft',
          createdAt: new Date(),
          updatedAt: new Date(),
          images: [],
          processSteps: [],
          views: 0,
          likes: 0,
          inquiries: 0,
          orders: 0,
          rating: 0,
          reviews: [],
          tags: [],
          customizations: []
        };

        set(state => ({
          portfolioProjects: [...state.portfolioProjects, newProject]
        }));
      },

      updatePortfolioProject: (projectId, updates) => {
        set(state => ({
          portfolioProjects: state.portfolioProjects.map(project =>
            project.id === projectId 
              ? { ...project, ...updates, updatedAt: new Date() }
              : project
          )
        }));
      },

      deletePortfolioProject: (projectId) => {
        set(state => ({
          portfolioProjects: state.portfolioProjects.filter(project => project.id !== projectId)
        }));
      },

      publishProject: (projectId) => {
        set(state => ({
          portfolioProjects: state.portfolioProjects.map(project =>
            project.id === projectId 
              ? { ...project, status: 'published', updatedAt: new Date() }
              : project
          )
        }));
      },

      featureProject: (projectId) => {
        set(state => ({
          portfolioProjects: state.portfolioProjects.map(project =>
            project.id === projectId 
              ? { ...project, status: 'featured', updatedAt: new Date() }
              : project
          )
        }));
      },

      // Customer Management Actions
      addCustomerNote: (customerId, note) => {
        const customer = get().customerProfiles.find(c => c.id === customerId);
        if (!customer) return;

        const newNote = {
          id: `note_${Date.now()}`,
          type: 'general' as const,
          content: note,
          isPrivate: false,
          createdAt: new Date(),
          createdBy: 'current-tailor-id'
        };

        set(state => ({
          customerProfiles: state.customerProfiles.map(profile =>
            profile.id === customerId
              ? { ...profile, notes: [...profile.notes, newNote], updatedAt: new Date() }
              : profile
          )
        }));
      },

      updateCustomerProfile: (customerId, updates) => {
        set(state => ({
          customerProfiles: state.customerProfiles.map(profile =>
            profile.id === customerId 
              ? { ...profile, ...updates, updatedAt: new Date() }
              : profile
          )
        }));
      },

      scheduleFollowUp: (customerId, date, note) => {
        console.log('Follow-up scheduled:', { customerId, date, note });
      },

      createCustomerSegment: (segment) => {
        set(state => ({
          customerSegments: [...state.customerSegments, segment as CustomerSegment]
        }));
      },

      // Business Operations Actions
      addInventoryItem: (itemData) => {
        const itemId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const newItem: InventoryItem = {
          id: itemId,
          name: itemData.name || 'New Item',
          category: itemData.category || 'fabric',
          subcategory: itemData.subcategory || 'Cotton',
          description: itemData.description || '',
          currentStock: itemData.currentStock || 0,
          unit: itemData.unit || 'yards',
          minimumStock: itemData.minimumStock || 10,
          reorderPoint: itemData.reorderPoint || 20,
          reorderQuantity: itemData.reorderQuantity || 50,
          maxStock: itemData.maxStock || 100,
          costPerUnit: itemData.costPerUnit || 0,
          currency: itemData.currency || 'USD',
          supplier: itemData.supplier || '',
          lastPurchasePrice: itemData.lastPurchasePrice || 0,
          location: itemData.location || 'Storage Room A',
          images: [],
          usageHistory: [],
          reservedQuantity: 0,
          availableQuantity: itemData.currentStock || 0,
          status: itemData.status || 'active',
          notes: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        set(state => ({
          inventoryItems: [...state.inventoryItems, newItem]
        }));
      },

      updateInventoryStock: (itemId, quantity, reason) => {
        set(state => ({
          inventoryItems: state.inventoryItems.map(item =>
            item.id === itemId 
              ? { 
                  ...item, 
                  currentStock: Math.max(0, item.currentStock + quantity),
                  availableQuantity: Math.max(0, item.availableQuantity + quantity),
                  updatedAt: new Date(),
                  usageHistory: [
                    ...item.usageHistory,
                    {
                      id: `usage_${Date.now()}`,
                      quantityUsed: -quantity,
                      purpose: reason,
                      usedAt: new Date(),
                      usedBy: 'current-tailor-id'
                    }
                  ]
                }
              : item
          )
        }));
      },

      startTimeEntry: (entryData) => {
        const entryId = `time_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const newEntry: TimeEntry = {
          id: entryId,
          tailorId: 'current-tailor-id',
          projectId: entryData.projectId,
          orderId: entryData.orderId,
          taskType: entryData.taskType || 'sewing',
          taskDescription: entryData.taskDescription || 'Work in progress',
          startTime: new Date(),
          totalMinutes: 0,
          breakMinutes: 0,
          productiveMinutes: 0,
          hourlyRate: entryData.hourlyRate || 50,
          billableMinutes: 0,
          totalCost: 0,
          isBillable: entryData.isBillable || true,
          difficultyLevel: entryData.difficultyLevel || 3,
          qualityRating: entryData.qualityRating || 5,
          efficiency: 1,
          status: 'active',
          notes: '',
          attachments: [],
          createdAt: new Date()
        };

        set(state => ({
          timeEntries: [...state.timeEntries, newEntry]
        }));
      },

      endTimeEntry: (entryId) => {
        const now = new Date();
        
        set(state => ({
          timeEntries: state.timeEntries.map(entry =>
            entry.id === entryId && entry.status === 'active'
              ? (() => {
                  const totalMinutes = Math.floor((now.getTime() - entry.startTime.getTime()) / (1000 * 60));
                  const billableMinutes = totalMinutes - entry.breakMinutes;
                  const totalCost = (billableMinutes / 60) * entry.hourlyRate;
                  
                  return {
                    ...entry,
                    endTime: now,
                    totalMinutes,
                    productiveMinutes: billableMinutes,
                    billableMinutes,
                    totalCost,
                    status: 'completed' as const
                  };
                })()
              : entry
          )
        }));
      },

      updateCapacityPlan: (updates) => {
        set(state => ({
          capacityPlan: state.capacityPlan 
            ? { ...state.capacityPlan, ...updates }
            : null
        }));
      },

      createAutomatedReport: (reportData) => {
        const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const newReport: AutomatedReport = {
          id: reportId,
          name: reportData.name || 'New Report',
          description: reportData.description || 'Automated business report',
          reportType: reportData.reportType || 'financial',
          frequency: reportData.frequency || 'weekly',
          time: reportData.time || '09:00',
          recipients: reportData.recipients || ['tailor@example.com'],
          includeCharts: reportData.includeCharts || true,
          format: reportData.format || 'pdf',
          dateRange: reportData.dateRange || 'last_30_days',
          metrics: reportData.metrics || ['revenue', 'orders', 'productivity'],
          filters: reportData.filters || {},
          isActive: reportData.isActive || true,
          nextSendDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
          createdAt: new Date()
        };

        set(state => ({
          automatedReports: [...state.automatedReports, newReport]
        }));
      },

      // Utility Actions
      setLoading: (section, loading) => {
        set(state => ({
          loading: { ...state.loading, [section]: loading }
        }));
      }
    }),
    {
      name: 'tailor-business-store',
      partialize: (state) => ({
        portfolioProjects: state.portfolioProjects,
        customerProfiles: state.customerProfiles,
        inventoryItems: state.inventoryItems,
        timeEntries: state.timeEntries,
        automatedReports: state.automatedReports
      })
    }
  )
);