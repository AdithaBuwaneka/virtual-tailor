// store/orderStore.ts - Order Management State
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderTracking, ProgressUpdate, OrderModificationRequest } from '../types/order';
import { OrderStatus } from '../types/order';
import { mockOrders } from '../data/mockOrderData';

interface OrderState {
  // State
  orders: Order[];
  orderTracking: Record<string, OrderTracking>;
  modificationRequests: OrderModificationRequest[];
  loading: boolean;
  error: string | null;

  // Customer Actions
  createOrder: (orderData: Partial<Order>, onOrderCreated?: (order: Order) => void) => Promise<string>;
  getCustomerOrders: (customerId: string) => Order[];
  getOrderTracking: (orderId: string) => OrderTracking | null;
  requestModification: (request: Partial<OrderModificationRequest>) => void;
  
  // Tailor Actions
  getTailorOrders: (tailorId: string) => Order[];
  acceptOrder: (orderId: string) => void;
  rejectOrder: (orderId: string, reason: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addProgressUpdate: (orderId: string, update: Partial<ProgressUpdate>) => void;
  
  // Shared Actions
  getOrder: (orderId: string) => Order | null;
  
  // Utility Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initializeMockOrders: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      // Initial State
      orders: [],
      orderTracking: {},
      modificationRequests: [],
      loading: false,
      error: null,

      // Customer Actions
      createOrder: async (orderData, onOrderCreated) => {
        set({ loading: true, error: null });
        
        try {
          const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          const newOrder = {
            id: orderId,
            status: OrderStatus.PENDING_ACCEPTANCE,
            createdAt: new Date().toISOString(),
            ...orderData,
          } as Order;
          
          // Add the new order to the store
          set(state => ({
            orders: [...state.orders, newOrder],
            loading: false,
          }));
          
          // Initialize tracking for the order
          const initialTracking: OrderTracking = {
            orderId,
            status: OrderStatus.PENDING_ACCEPTANCE,
            timeline: [
              {
                status: OrderStatus.PENDING_ACCEPTANCE,
                timestamp: new Date().toISOString(),
                message: 'Order submitted and awaiting tailor acceptance',
              }
            ],
            progressUpdates: [],
            deliveryEstimate: null,
          };
          
          set(state => ({
            orderTracking: {
              ...state.orderTracking,
              [orderId]: initialTracking
            }
          }));
          
          // Call the callback if provided (for payment intent creation)
          if (typeof onOrderCreated === 'function') {
            onOrderCreated(newOrder);
          }
          
          return orderId;
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to create order',
          });
          throw error;
        }
      },
      
      getCustomerOrders: (customerId) => {
        return get().orders.filter(order => order.customer?.id === customerId);
      },
      
      getOrderTracking: (orderId) => {
        return get().orderTracking[orderId] || null;
      },
      
      requestModification: (request) => {
        const modRequest = {
          id: `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          status: 'pending',
          ...request,
        } as OrderModificationRequest;
        
        set(state => ({
          modificationRequests: [...state.modificationRequests, modRequest]
        }));
      },
      
      // Tailor Actions
      getTailorOrders: (tailorId) => {
        return get().orders.filter(order => order.tailor?.id === tailorId);
      },
      
      acceptOrder: (orderId) => {
        set(state => ({
          orders: state.orders.map(order => 
            order.id === orderId 
              ? { ...order, status: OrderStatus.ACCEPTED } 
              : order
          )
        }));
        
        // Update tracking
        const order = get().orders.find(o => o.id === orderId);
        const tracking = get().orderTracking[orderId];
        
        if (tracking) {          set((state) => {
            // Create a new timeline array
            let newTimeline = [];
            if (tracking.timeline && Array.isArray(tracking.timeline)) {
              newTimeline = [
                ...tracking.timeline,
                {
                  status: OrderStatus.ACCEPTED,
                  timestamp: new Date().toISOString(),
                  message: 'Order accepted by tailor',
                }
              ];
            } else {
              newTimeline = [{
                status: OrderStatus.ACCEPTED,
                timestamp: new Date().toISOString(),
                message: 'Order accepted by tailor',
              }];
            }
            
            const updatedTracking = {
              ...tracking,
              status: OrderStatus.ACCEPTED,
              timeline: newTimeline,
              deliveryEstimate: order?.timeline ? 
                new Date(Date.now() + order.timeline * 24 * 60 * 60 * 1000) : 
                new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            };
            
            return {
              ...state,
              orderTracking: {
                ...state.orderTracking,
                [orderId]: updatedTracking
              }
            };
          });
        }
      },
      
      rejectOrder: (orderId, reason) => {
        set(state => ({
          orders: state.orders.map(order => 
            order.id === orderId 
              ? { ...order, status: OrderStatus.CANCELLED, cancellationReason: reason } 
              : order
          )
        }));
        
        // Update tracking
        const tracking = get().orderTracking[orderId];
        
        if (tracking) {
          set(state => ({
            orderTracking: {
              ...state.orderTracking,              [orderId]: {
                ...tracking,
                status: OrderStatus.CANCELLED,
                timeline: tracking.timeline && Array.isArray(tracking.timeline) 
                  ? [
                      ...tracking.timeline,
                      {
                        status: OrderStatus.CANCELLED,
                        timestamp: new Date().toISOString(),
                        message: `Order rejected by tailor. Reason: ${reason}`,
                      }
                    ]
                  : [
                      {
                        status: OrderStatus.CANCELLED,
                        timestamp: new Date().toISOString(),
                        message: `Order rejected by tailor. Reason: ${reason}`,
                      }
                    ]
              }
            }
          }));
        }
      },
      
      updateOrderStatus: (orderId, status) => {
        set(state => ({
          orders: state.orders.map(order => 
            order.id === orderId 
              ? { ...order, status } 
              : order
          )
        }));
        
        // Update tracking
        const tracking = get().orderTracking[orderId];
        const statusMessages: Record<OrderStatus, string> = {
          pending_acceptance: 'Order awaiting tailor acceptance',
          accepted: 'Order accepted by tailor',
          materials_sourcing: 'Tailor is sourcing materials',
          in_progress: 'Order is being made',
          quality_review: 'Order is under quality review',
          completed: 'Order has been completed',
          shipped: 'Order has been shipped',
          delivered: 'Order has been delivered',
          cancelled: 'Order has been cancelled',
        };
        
        if (tracking) {
          set(state => ({
            orderTracking: {
              ...state.orderTracking,
              [orderId]: {
                ...tracking,
                status,                timeline: tracking.timeline && Array.isArray(tracking.timeline)
                  ? [
                      ...tracking.timeline,
                      {
                        status,
                        timestamp: new Date().toISOString(),                    message: statusMessages[status] || `Status updated to ${status}`,
                  }
                ] : [
                  {
                    status,
                    timestamp: new Date().toISOString(),
                    message: statusMessages[status] || `Status updated to ${status}`,
                  }
                ]
              }
            }
          }));
        }
      },
      
      addProgressUpdate: (orderId, update) => {
        const progressUpdate = {
          id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          ...update,
        } as ProgressUpdate;
        
        const tracking = get().orderTracking[orderId];
        
        if (tracking) {
          set(state => ({
            orderTracking: {
              ...state.orderTracking,
              [orderId]: {
                ...tracking,
                progressUpdates: [
                  ...tracking.progressUpdates,
                  progressUpdate
                ]
              }
            }
          }));
        }
      },
      
      // Shared Actions
      getOrder: (orderId) => {
        return get().orders.find(order => order.id === orderId) || null;
      },
      
      // Utility Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      // Initialize mock orders if none exist
      initializeMockOrders: () => {
        const currentOrders = get().orders;
        if (currentOrders.length === 0 || currentOrders.length < mockOrders.length) {
          set({ orders: mockOrders });
        }
      },
    }),
    {
      name: 'order-storage',
    }
  )
);