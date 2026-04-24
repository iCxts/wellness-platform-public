//enums
export type UserRole = "member" | "instructor" | "admin";

export type BookingStatus = | "confirmed" | "standby" | "cancelled" | "no_show" | "attended" | "pending_confirmation";

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
export type SessionLevel = "beginner" | "pre_intermediate" | "intermediate" | "advanced";

export type SessionFocus =
    | "neck_shoulders"
    | "hips_opener"
    | "breathing_flow"
    | "lower_back_care"
    | "core_strength"
    | "posture_reset"
    | "stress_release"
    | "brain_refresh";

export type CreateSessionInput = {
    title: string;
    type: SessionType;
    level?: SessionLevel;
    focus?: SessionFocus[];
    description?: string;
    roomName?: string;
    placeDescription?: string;
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
    level: SessionLevel | null;
    focus: SessionFocus[] | null;
    description: string | null;
    imageUrl: string | null;
    roomName: string | null;
    placeDescription: string | null;
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

export type NotificationMetadata = {
    sessionId?: string;
    bookingId?: string;
};

export type NotificationResponse = {
    id: string,
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    isRead: boolean,
    metadata: NotificationMetadata | null,
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

//users
export type UserProfileResponse = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    role: UserRole;
    avatarUrl: string | null;
    parqCleared: boolean;
    fitnessInterests: string[] | null;
    createdAt: string;
};

export type UpdateProfileInput = {
    firstName?: string;
    lastName?: string;
    phone?: string;
};

export type QrTokenResponse = {
    token: string;
    expiresAt: string;
};

export type CheckInResponse = {
    checkInTime: string;
    className: string;
    memberName: string;
};

export type LatestCheckInResponse = {
    id: string;
    sessionId: string;
    className: string;
    checkInTime: string;
};

//bookings enriched
export type BookingWithSessionResponse = {
    bookingId: string;
    sessionId: string;
    title: string;
    type: SessionType;
    imageUrl: string | null;
    startsAt: string;
    endsAt: string;
    status: BookingStatus;
    standbyPosition: number | null;
    createdAt: string;
};

//booking detail
export type BookingDetailResponse = {
    bookingId: string;
    status: BookingStatus;
    standbyPosition: number | null;
    createdAt: string;
    session: {
        id: string;
        title: string;
        type: SessionType;
        level: SessionLevel | null;
        focus: SessionFocus[] | null;
        description: string | null;
        imageUrl: string | null;
        roomName: string | null;
        startsAt: string;
        endsAt: string;
        capacity: number;
        spotsLeft: number;
        zoneName: string;
    };
    instructor: {
        id: string;
        firstName: string;
        lastName: string;
        avatarUrl: string | null;
    } | null;
};

//dashboard
export type DashboardUpcomingClass = {
    bookingId: string;
    sessionId: string;
    title: string;
    imageUrl: string | null;
    startsAt: string;
    endsAt: string;
    startsInMs: number;
};

export type DashboardScheduleItem = {
    id: string;
    title: string;
    type: SessionType;
    imageUrl: string | null;
    startsAt: string;
    endsAt: string;
    spotsLeft: number;
    bookingStatus: BookingStatus | null;
    bookingId: string | null;
};

export type DashboardMyBooking = {
    bookingId: string;
    sessionId: string;
    title: string;
    imageUrl: string | null;
    startsAt: string;
    endsAt: string;
    status: BookingStatus;
    standbyPosition: number | null;
};

export type DashboardResponse = {
    profile: {
        firstName: string;
        avatarUrl: string | null;
    };
    upcomingClass: DashboardUpcomingClass | null;
    progress: {
        currentStreak: number;
        totalSessionsAttended: number;
        totalZoneVisits: number;
    };
    schedule: DashboardScheduleItem[];
    myBookings: DashboardMyBooking[];
};

