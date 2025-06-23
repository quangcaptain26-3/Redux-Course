import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { courseAPI } from './courseAPI';
import type { Course, NewCourse } from './courseTypes';

interface CoursesState {
    courses: Course[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CoursesState = {
    courses: [],
    status: 'idle',
    error: null,
};

export const fetchCourses = createAsyncThunk('courses/fetchCourses', async () => {
    const response = await courseAPI.fetchCourses();
    return response;
});

export const addCourse = createAsyncThunk('courses/addCourse', async (course: NewCourse) => {
    const response = await courseAPI.addCourse(course);
    return response;
});

export const updateCourse = createAsyncThunk('courses/updateCourse', async (course: Course) => {
    const response = await courseAPI.updateCourse(course);
    return response;
});

export const deleteCourse = createAsyncThunk('courses/deleteCourse', async (id: string) => {
    await courseAPI.deleteCourse(id);
    return id;
});

const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
                state.status = 'succeeded';
                state.courses = action.payload;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch courses';
            })
            .addCase(addCourse.fulfilled, (state, action: PayloadAction<Course>) => {
                state.courses.push(action.payload);
            })
            .addCase(updateCourse.fulfilled, (state, action: PayloadAction<Course>) => {
                const index = state.courses.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.courses[index] = action.payload;
                }
            })
            .addCase(deleteCourse.fulfilled, (state, action: PayloadAction<string>) => {
                state.courses = state.courses.filter(c => c.id !== action.payload);
            });
    },
});

export default courseSlice.reducer;
