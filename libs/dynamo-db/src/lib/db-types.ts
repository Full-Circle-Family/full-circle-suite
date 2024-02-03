export interface Message {
  id: string;
  userId: string;
  created: Date;
  userMessage: string;
  gptResponse: string;
  gptModel: string;
}

export interface User {
  id: string;
  created: Date;
  phone: string;
  stressScore: number;
  exerciseMode: boolean;
  subscriptionStartDate: Date;
  subscriptionEndDate: Date | null;
  firstname: string;
  lastname?: string;
  role?: string;
  archeType?: string;
  parentingConcerns?: string;
  infantFirstName?: string;
  infantBirtdate?: string;
  infantCharacteristics?: string;

  email?: string;
  birthdate: Date;
  numberOfChildren?: number;
  introduction?: string;
  initialIntroduction: string;
  exerciseName?: string;
  exerciseStep?: number;
  exerciseLastParticipated: Date;
}

export interface GPTSystemPrompt {
  id: string;
  created: Date;
  prompt: string;
  currentlySelected: boolean;
}

export interface GPTModel {
  id: string;
  currentlySelected: boolean;
}

export interface SelectedTrainingData {
  id: string;
  userId: string;
  created: Date;
  userMessage: string;
  gptResponse: string;
  gptModel: string;
}

export interface GuidedExercise {
  id: string;
  created: Date;
  exerciseName: string;
  steps: number;
  questions: string[];
}
