export interface BaseResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: any;
  timestamp: string;
  path?: string;
}
