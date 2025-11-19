
export interface Curriculum {
  [branch: string]: {
    [semester: string]: string[];
  };
}

export interface User {
  email: string;
}
