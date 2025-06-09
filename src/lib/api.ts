
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // FastAPI backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types for our data models
export interface Project {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: number;
  project_id: number;
  name: string;
  url?: string;
  description?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface TestCase {
  id: number;
  module_id: number;
  name: string;
  type: 'images' | 'requirements';
  content: string;
  created_at: string;
  updated_at: string;
}

// API functions
export const projectsApi = {
  getAll: () => api.get<Project[]>('/projects'),
  create: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<Project>('/projects', project),
  getById: (id: number) => api.get<Project>(`/projects/${id}`),
  update: (id: number, project: Partial<Project>) => 
    api.put<Project>(`/projects/${id}`, project),
  delete: (id: number) => api.delete(`/projects/${id}`),
};

export const modulesApi = {
  getAll: (projectId?: number) => 
    api.get<Module[]>('/modules', { params: { project_id: projectId } }),
  create: (module: Omit<Module, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<Module>('/modules', module),
  getById: (id: number) => api.get<Module>(`/modules/${id}`),
  update: (id: number, module: Partial<Module>) => 
    api.put<Module>(`/modules/${id}`, module),
  delete: (id: number) => api.delete(`/modules/${id}`),
};

export const testCasesApi = {
  getAll: (moduleId?: number) => 
    api.get<TestCase[]>('/test-cases', { params: { module_id: moduleId } }),
  create: (testCase: Omit<TestCase, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<TestCase>('/test-cases', testCase),
  getById: (id: number) => api.get<TestCase>(`/test-cases/${id}`),
  update: (id: number, testCase: Partial<TestCase>) => 
    api.put<TestCase>(`/test-cases/${id}`, testCase),
  delete: (id: number) => api.delete(`/test-cases/${id}`),
  generate: (moduleId: number, type: 'images' | 'requirements', data: any) =>
    api.post<TestCase>(`/modules/${moduleId}/generate-test-cases`, { type, data }),
};

export default api;
