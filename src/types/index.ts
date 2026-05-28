export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  perfectpay_sale_code: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  title: string;
  company_name: string;
  logo_url: string | null;
  salary_range: string;
  description: string;
  requirements: string[];
  benefits: string[];
  application_url: string;
  is_active: boolean;
  created_at: string;
}

export interface Module {
  id: string;
  title: string;
  description: string | null;
  sequence_order: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  video_url: string;
  sequence_order: number;
  content: string | null;
  created_at: string;
}

export interface UserLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
}

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  applied_at: string;
}
