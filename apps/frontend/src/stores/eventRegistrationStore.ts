import { create } from 'zustand';

export interface RegisteredEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'Registered' | 'Going' | 'Interested';
  registeredAt: string;
}

interface EventRegistrationState {
  registeredEvents: RegisteredEvent[];
  registerForEvent: (event: Omit<RegisteredEvent, 'registeredAt'>) => void;
  unregisterFromEvent: (eventId: string) => void;
  updateEventStatus: (eventId: string, status: RegisteredEvent['status']) => void;
  isRegistered: (eventId: string) => boolean;
}

export const useEventRegistrationStore = create<EventRegistrationState>((set, get) => ({
  registeredEvents: [
    {
      id: "event-1",
      title: "Innovation Summit 2024",
      date: "2024-03-15",
      location: "Harare, Zimbabwe",
      status: "Going",
      registeredAt: new Date().toISOString(),
    },
    {
      id: "event-2",
      title: "Tech Startup Networking",
      date: "2024-02-28",
      location: "Virtual",
      status: "Registered",
      registeredAt: new Date().toISOString(),
    },
  ],

  registerForEvent: (event) => {
    const { registeredEvents } = get();
    
    // Check if already registered
    if (registeredEvents.some(e => e.id === event.id)) {
      return;
    }

    set({
      registeredEvents: [
        ...registeredEvents,
        {
          ...event,
          registeredAt: new Date().toISOString(),
        },
      ],
    });
  },

  unregisterFromEvent: (eventId) => {
    set((state) => ({
      registeredEvents: state.registeredEvents.filter(e => e.id !== eventId),
    }));
  },

  updateEventStatus: (eventId, status) => {
    set((state) => ({
      registeredEvents: state.registeredEvents.map(e =>
        e.id === eventId ? { ...e, status } : e
      ),
    }));
  },

  isRegistered: (eventId) => {
    const { registeredEvents } = get();
    return registeredEvents.some(e => e.id === eventId);
  },
}));

