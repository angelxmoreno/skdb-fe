import { BaseEntity } from "@entities/Server";

export interface SerialKiller extends BaseEntity {
    name: string;
    date_of_birth: Date | null;
    photo_url: string | null;
    answers?: Answer[]; // Answers tied to this Serial Killer
}

export interface Section extends BaseEntity {
    name: string;
    questions?: Question[]; // Section contains questions
}

export interface Question extends BaseEntity {
    type: string;
    prompt: string;
    section_id: number;
    section?: Section;
    answers?: Answer[]; // Questions contain answers
}

export interface Answer extends BaseEntity {
    body: string;
    profile_id: number; // Kept as `profile_id`
    question_id: number;
    question?: Question; // Answers belong to a question
}
