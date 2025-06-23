import type { Course, NewCourse } from "./courseTypes";


// --- Mock API to simulate backend operations ---
let mockCourses: Course[] = [
    { id: '1', name: 'Advanced React', description: 'Explore hooks, context, and performance optimization.', instructor: 'John Smith', credits: 3 },
    { id: '2', name: 'Complete Redux', description: 'Master state management with Redux Toolkit.', instructor: 'Emily Johnson', credits: 4 },
    { id: '3', name: 'TypeScript for Frontend', description: 'Harness the power of TypeScript in React projects.', instructor: 'Michael Brown', credits: 3 },
    { id: '4', name: 'Node.js Essentials', description: 'Build scalable backend applications with Node.js.', instructor: 'Sarah Davis', credits: 4 },
    { id: '5', name: 'GraphQL Fundamentals', description: 'Learn to query and mutate data with GraphQL APIs.', instructor: 'David Wilson', credits: 3 },
    { id: '6', name: 'UI/UX Design Principles', description: 'Create user-friendly interfaces with modern design tools.', instructor: 'Anna Taylor', credits: 2 },
    { id: '7', name: 'Testing with Jest', description: 'Write robust tests for JavaScript applications.', instructor: 'James Lee', credits: 3 },
    { id: '8', name: 'Docker for Developers', description: 'Containerize applications for consistent environments.', instructor: 'Laura Martinez', credits: 4 },
    { id: '9', name: 'Advanced CSS', description: 'Master CSS Grid, Flexbox, and animations.', instructor: 'Robert Clark', credits: 2 },
];

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const courseAPI = {
    fetchCourses: async (): Promise<Course[]> => {
        await simulateDelay(500);
        console.log('API: Fetched courses');
        return [...mockCourses];
    },
    addCourse: async (course: NewCourse): Promise<Course> => {
        await simulateDelay(300);
        const newCourse: Course = { ...course, id: new Date().toISOString() };
        mockCourses.push(newCourse);
        console.log('API: Added course', newCourse);
        return newCourse;
    },
    updateCourse: async (course: Course): Promise<Course> => {
        await simulateDelay(300);
        const index = mockCourses.findIndex(c => c.id === course.id);
        if (index !== -1) {
            mockCourses[index] = course;
            console.log('API: Updated course', course);
            return course;
        }
        throw new Error('Course not found');
    },
    deleteCourse: async (id: string): Promise<string> => {
        await simulateDelay(300);
        const index = mockCourses.findIndex(c => c.id === id);
        if (index !== -1) {
            mockCourses = mockCourses.filter(c => c.id !== id);
            console.log('API: Deleted course with id', id);
            return id;
        }
        throw new Error('Course not found');
    },
};
