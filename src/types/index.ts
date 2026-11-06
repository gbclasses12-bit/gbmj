export interface Batch {
  id: number;
  title: string;
  thumbnail: string;
  category: 'JEE' | 'NEET' | '12TH' | '10TH' | 'All' | string;
  target: string;
  subjects: string[];
  badge: string;
  rating?: string;
  students?: string;
  videoCount?: number | string;
  notesCount?: number | string;
  foldersCount?: number | string;
}

export interface ContentCount {
  pdf?: { free: number; paid: number };
  video?: { free: number; paid: number };
  test?: { free: number; paid: number };
  folders?: { total: number; direct: number };
}

export interface ContentItemData {
  id: number;
  title?: string;
  file_url?: string;
  thumbnail?: string | null;
  file_type?: number; // 1: PDF, 2: Video
  video_type?: number; // 1: YouTube, 4: VOD HLS
  duration?: number;
  created_at?: number;
  is_live?: number;
  content_counts?: ContentCount;
  download_urls?: Array<{ title: string; url: string }> | string | null;
  description?: string | null;
  vdc_id?: string | null;
}

export interface ContentItem {
  type: 'folder' | 'file' | 'test';
  course_id: string;
  parent_id: number;
  entity_id: string;
  title: string;
  data: ContentItemData;
}

export interface BreadcrumbItem {
  id: string;
  title: string;
}

export interface ResolvedMedia {
  contentId: string;
  courseId: string;
  decryptedData: {
    id: number;
    title: string;
    description?: string | null;
    thumbnail?: string | null;
    file_url?: string;
    file_type?: number;
    video_type?: number;
    duration?: string | number;
    created_at?: string | number;
    download_urls?: Array<{ title: string; url: string }> | null;
    is_live?: number;
  };
}

export interface CourseOverview {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
}

export interface LiveClassItem {
  id: number;
  video_id: number | string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  live_from?: string | number;
  live_to?: string | number;
  live_status: number; // 0: upcoming, 1: live now, 2: completed
  course?: { title: string };
  file_url?: string;
  is_live?: number;
  subject?: string;
  instructor?: string;
  pdf_url?: string;
  date_label?: string;
}
