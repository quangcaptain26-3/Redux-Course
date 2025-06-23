export interface Course {
    id: string;
    name: string;
    description: string;
    instructor: string;
    credits: number;
}

export type NewCourse = Omit<Course, 'id'>;
