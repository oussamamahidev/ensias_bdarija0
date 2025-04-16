export interface TestCase {
  input: string;
  expectedOutput: string;
  id?: number; // Used for UI management
}

export interface CodeChallenge {
  _id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  tags: string[];
  starterCode: string;
  testCases: TestCase[];
  submissions: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
  author: {
    _id: string;
    name: string;
    picture?: string;
  };
}

export interface CodeSubmission {
  _id: string;
  challengeId: string;
  userId: string;
  code: string;
  passed: boolean;
  testResults: {
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
  }[];
  executionTime: number;
  createdAt: string;
}
