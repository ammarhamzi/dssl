import { api } from './api-client';
import type { 
  FormSubmission, 
  CreateFormSubmissionRequest, 
  UpdateFormSubmissionRequest,
  FormSubmissionListResponse 
} from '@/types/form-submission';

export class FormSubmissionService {
  private static readonly BASE_PATH = '/form-submissions';

  /**
   * Get all form submissions with optional filtering
   */
  static async getSubmissions(params?: {
    page?: number;
    limit?: number;
    status?: string;
    submitted_by?: number;
  }): Promise<FormSubmissionListResponse> {
    const response = await api.get(this.BASE_PATH, { params });
    return response.data;
  }

  /**
   * Get a specific form submission by ID
   */
  static async getSubmission(id: number): Promise<FormSubmission> {
    const response = await api.get(`${this.BASE_PATH}/${id}`);
    return response.data;
  }

  /**
   * Create a new form submission
   */
  static async createSubmission(data: CreateFormSubmissionRequest): Promise<FormSubmission> {
    const response = await api.post(this.BASE_PATH, data);
    return response.data;
  }

  /**
   * Update a form submission (for approval/rejection)
   */
  static async updateSubmission(id: number, data: UpdateFormSubmissionRequest): Promise<FormSubmission> {
    const response = await api.patch(`${this.BASE_PATH}/${id}`, data);
    return response.data;
  }

  /**
   * Delete a form submission
   */
  static async deleteSubmission(id: number): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}`);
  }

  /**
   * Approve a form submission
   */
  static async approveSubmission(id: number, notes?: string): Promise<FormSubmission> {
    return this.updateSubmission(id, {
      status: 'approved',
      review_notes: notes
    });
  }

  /**
   * Reject a form submission
   */
  static async rejectSubmission(id: number, notes?: string): Promise<FormSubmission> {
    return this.updateSubmission(id, {
      status: 'rejected',
      review_notes: notes
    });
  }

  /**
   * Get submissions pending approval
   */
  static async getPendingSubmissions(params?: {
    page?: number;
    limit?: number;
  }): Promise<FormSubmissionListResponse> {
    return this.getSubmissions({
      ...params,
      status: 'pending'
    });
  }

  /**
   * Get submissions by current user
   */
  static async getMySubmissions(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<FormSubmissionListResponse> {
    const response = await api.get(`${this.BASE_PATH}/my-submissions`, { params });
    return response.data;
  }

  /**
   * Get submission statistics
   */
  static async getStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }> {
    const response = await api.get(`${this.BASE_PATH}/stats`);
    return response.data;
  }
}