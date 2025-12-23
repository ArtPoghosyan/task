export interface TODO {
  id: number;
  name: string;
  completed: boolean;
}

export interface UPDATED_TODO {
  name?: string;
  completed?: boolean;
}
