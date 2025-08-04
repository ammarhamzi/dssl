export interface FormSubmission {
  id: number;
  uuid: string;
  // Inspector details
  inspector_name: string;
  inspector_id: string;
  inspector_email: string;
  inspector_image?: string;
  date_time: Date;
  // Site details
  geolocation?: string;
  site?: string;
  // Inspection details
  inspection_type: string;
  remarks?: string;
  inspection_image?: string;
  // System fields
  submitted_by: number;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: number;
  reviewed_at?: Date;
  review_notes?: string;
  created_at: Date;
  updated_at: Date;
  // Joined fields
  submitter?: {
    id: number;
    name: string;
    email: string;
  };
  reviewer?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateFormSubmissionRequest {
  // Inspector details
  inspector_name: string;
  inspector_id: string;
  inspector_email: string;
  inspector_image?: File;
  date_time: Date;
  // Site details
  geolocation?: string;
  site?: string;
  // Inspection details
  inspection_type: string;
  remarks?: string;
  inspection_image?: File;
}

export interface UpdateFormSubmissionRequest {
  status: 'approved' | 'rejected';
  review_notes?: string;
}

export interface FormSubmissionListResponse {
  submissions: FormSubmission[];
  total: number;
  page: number;
  limit: number;
}