import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface FashionDesignSubmission {
    status: SubmissionStatus;
    title: string;
    description: string;
    isPaid: boolean;
    email: string;
    timestamp: Time;
    image: ExternalBlob;
    artistName: string;
}
export enum SubmissionStatus {
    pending = "pending",
    rejected = "rejected",
    selected = "selected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminGetAllSubmissions(): Promise<Array<FashionDesignSubmission>>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllSubmissions(): Promise<Array<FashionDesignSubmission>>;
    getCallerUserRole(): Promise<UserRole>;
    getSubmissionCount(): Promise<bigint>;
    getSubmissionsByStatus(status: SubmissionStatus): Promise<Array<FashionDesignSubmission>>;
    getUnpaidSelectedDesigns(): Promise<Array<FashionDesignSubmission>>;
    isCallerAdmin(): Promise<boolean>;
    markDesignAsPaid(id: string): Promise<void>;
    submitDesign(submission: FashionDesignSubmission): Promise<string>;
    updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<void>;
}
