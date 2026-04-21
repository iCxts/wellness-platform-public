//enums
export type UserRole = "member" | "instructor" | "admin";

export type BookingStatus = | "confirmed" | "standby" | "cancelled" | "no_show" | "attended";

export type SessionType = | "group_class" | "personal_training" | "medical_consult" | "open_facility";

//auth
export type RegisterInput = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
};

export type LoginInput = {
    email: string;
    password: string;
};

export type AuthUser = {
    id: string;
    email: string;
    role: UserRole;
};

export type LoginResponse = {
    token: string;
    user: AuthUser;
};

//sessions
export type CreateSessionInput = {
    title: string;
    type: SessionType;
    trainerId?: string;
    zoneId: string;
    startsAt: string;
    endsAt: string;
    capacity: number;
};

export type SessionResponse = {
    id: string;
    title: string;
    type: SessionType;
    trainerId?: string | null;
    zoneId: string;
    startsAt: string;
    endsAt: string;
    capacity: number;
    spotsLeft: number;
};

//bookings
export type CreateBookingInput = {
    sessionId: string;
};

export type BookingResponse = {
    id: string;
    sessionId: string;
    userId: string;
    status: BookingStatus;
    standbyPosition: number | null;
    createdAt: string;
};

//booking for instructor
export type BookingWithUserResponse = {
    id: string;
    sessionId: string;
    userId: string;
    status: BookingStatus;
    standbyPosition: number | null;
    createdAt: string;
    user: {
        id: string,
        firstName: string,
        lastName: string,
        email: string
    };
};

//zones
export type CreateZoneInput = {
    name: string;
    description?: string;
    capacity: number;
};

export type ZoneResponse = {
    id: string;
    name: string;
    description: string | null;
    capacity: number;
    isActive: boolean;
};

//notifications
export type NotificationType = 
    | "standby_promoted"
    | "no_show_tagged"
    | "absence_warning"
    | "feedback_request"
    | "reminder";

export type NotificationResponse = {
    id: string,
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    isRead: boolean,
    createdAt: string
};

//zone visits
export type ZoneVisitResponse = {
    id: string,
    userId: string,
    zoneId: string,
    enteredAt: string,
    exitedAt: string | null,
    createdAt: string
};

//progress
export type ProgressResponse = {
    totalSessions: number,
    totalDays: number,
    currentStreak: number
};

