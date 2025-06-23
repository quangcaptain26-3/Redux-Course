import  { useState, useEffect } from 'react';
import type { FC } from 'react';	
import type { FormEvent } from 'react';	

import { useAppDispatch } from '../app/store';
import { addCourse, updateCourse } from '../features/courses/courseSlice';
import {
    TextField,
    Button,
    CircularProgress,
    Box,
    Snackbar,
    Alert,
    InputAdornment,
    Fade,
    Zoom,
    Grid,
    Chip,
} from '@mui/material';
import { 
    Add, 
    Save, 
    Cancel, 
    School, 
    Person, 
    Description, 
    Numbers,
    CheckCircle,
    Clear,
} from '@mui/icons-material';
import type { Course } from '../features/courses/courseTypes';

interface CourseFormProps {
    courseToEdit: Course | null;
    onFinishEditing: () => void;
}

const CourseForm: FC<CourseFormProps> = ({ courseToEdit, onFinishEditing }) => {
    const dispatch = useAppDispatch();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [instructor, setInstructor] = useState('');
    const [credits, setCredits] = useState<number | ''>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, type: 'success' | 'error' }>({ 
        open: false, 
        message: '', 
        type: 'success' 
    });
    const [formErrors, setFormErrors] = useState({
        name: false,
        description: false,
        instructor: false,
        credits: false,
    });

    const isEditMode = courseToEdit !== null;

    useEffect(() => {
        if (isEditMode) {
            setName(courseToEdit.name);
            setDescription(courseToEdit.description);
            setInstructor(courseToEdit.instructor);
            setCredits(courseToEdit.credits);
        }
    }, [courseToEdit, isEditMode]);

    const validateForm = () => {
        const errors = {
            name: !name.trim(),
            description: !description.trim(),
            instructor: !instructor.trim(),
            credits: credits === '' || Number(credits) <= 0,
        };
        setFormErrors(errors);
        return !Object.values(errors).some(error => error);
    };

    const clearForm = () => {
        setName('');
        setDescription('');
        setInstructor('');
        setCredits('');
        setFormErrors({ name: false, description: false, instructor: false, credits: false });
        onFinishEditing();
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setSnackbar({ 
                open: true, 
                message: 'Vui lòng điền đầy đủ thông tin hợp lệ!', 
                type: 'error' 
            });
            return;
        }
        
        setIsSubmitting(true);
        try {
            if (isEditMode && courseToEdit) {
                await dispatch(updateCourse({ 
                    id: courseToEdit.id, 
                    name: name.trim(), 
                    description: description.trim(), 
                    instructor: instructor.trim(), 
                    credits: Number(credits) 
                })).unwrap();
                setSnackbar({ 
                    open: true, 
                    message: '✅ Cập nhật khóa học thành công!', 
                    type: 'success' 
                });
            } else {
                await dispatch(addCourse({ 
                    name: name.trim(), 
                    description: description.trim(), 
                    instructor: instructor.trim(), 
                    credits: Number(credits) 
                })).unwrap();
                setSnackbar({ 
                    open: true, 
                    message: '🎉 Thêm khóa học thành công!', 
                    type: 'success' 
                });
            }
            clearForm();
        } catch (error) {
            console.error('Failed to save course:', error);
            setSnackbar({ 
                open: true, 
                message: `❌ Lỗi: ${error instanceof Error ? error.message : 'Có lỗi xảy ra'}`, 
                type: 'error' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFieldChange = (field: string, value: string | number) => {
        // Clear error when user starts typing
        if (formErrors[field as keyof typeof formErrors]) {
            setFormErrors(prev => ({ ...prev, [field]: false }));
        }
        
        switch (field) {
            case 'name':
                setName(value as string);
                break;
            case 'description':
                setDescription(value as string);
                break;
            case 'instructor':
                setInstructor(value as string);
                break;
            case 'credits':
                setCredits(value === '' ? '' : Number(value));
                break;
        }
    };

    return (
        <Box>
            {/* Status Indicator */}
            {isEditMode && (
                <Fade in={isEditMode}>
                    <Chip
                        icon={<School />}
                        label={`Đang chỉnh sửa: ${courseToEdit?.name}`}
                        color="primary"
                        variant="outlined"
                        sx={{ 
                            mb: 3,
                            fontSize: '0.9rem',
                            '& .MuiChip-icon': {
                                color: 'primary.main',
                            },
                        }}
                        onDelete={clearForm}
                        deleteIcon={<Clear />}
                    />
                </Fade>
            )}

            <Box 
                component="form" 
                onSubmit={handleSubmit} 
                noValidate
                sx={{
                    '& .MuiTextField-root': {
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                        },
                        '&:focus-within': {
                            transform: 'translateY(-2px)',
                            '& .MuiOutlinedInput-root': {
                                boxShadow: (theme) => `0 4px 20px ${theme.palette.primary.main}20`,
                            },
                        },
                    },
                }}
            >
                <Grid container spacing={3}>
                    {/* Course Name */}
                    <Grid item xs={12} md={6}>
                        <Zoom in timeout={300}>
                            <TextField 
                                label="Tên khóa học" 
                                value={name} 
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                fullWidth 
                                required
                                error={formErrors.name}
                                helperText={formErrors.name ? 'Vui lòng nhập tên khóa học' : ''}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <School color={formErrors.name ? 'error' : 'primary'} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease-in-out',
                                    },
                                }}
                            />
                        </Zoom>
                    </Grid>

                    {/* Credits */}
                    <Grid item xs={12} md={6}>
                        <Zoom in timeout={400}>
                            <TextField 
                                label="Số tín chỉ" 
                                value={credits} 
                                onChange={(e) => handleFieldChange('credits', e.target.value)}
                                type="number" 
                                fullWidth 
                                required
                                error={formErrors.credits}
                                helperText={formErrors.credits ? 'Vui lòng nhập số tín chỉ hợp lệ (> 0)' : ''}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Numbers color={formErrors.credits ? 'error' : 'primary'} />
                                        </InputAdornment>
                                    ),
                                    inputProps: { min: 1, max: 10 }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease-in-out',
                                    },
                                }}
                            />
                        </Zoom>
                    </Grid>

                    {/* Instructor */}
                    <Grid item xs={12}>
                        <Zoom in timeout={500}>
                            <TextField 
                                label="Giảng viên" 
                                value={instructor} 
                                onChange={(e) => handleFieldChange('instructor', e.target.value)}
                                fullWidth 
                                required
                                error={formErrors.instructor}
                                helperText={formErrors.instructor ? 'Vui lòng nhập tên giảng viên' : ''}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person color={formErrors.instructor ? 'error' : 'primary'} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease-in-out',
                                    },
                                }}
                            />
                        </Zoom>
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12}>
                        <Zoom in timeout={600}>
                            <TextField 
                                label="Mô tả khóa học" 
                                value={description} 
                                onChange={(e) => handleFieldChange('description', e.target.value)}
                                fullWidth 
                                multiline 
                                rows={4}
                                required
                                error={formErrors.description}
                                helperText={formErrors.description ? 'Vui lòng nhập mô tả khóa học' : 'Mô tả chi tiết về nội dung và mục tiêu của khóa học'}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                            <Description color={formErrors.description ? 'error' : 'primary'} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease-in-out',
                                    },
                                }}
                            />
                        </Zoom>
                    </Grid>
                </Grid>

                {/* Action Buttons */}
                <Zoom in timeout={700}>
                    <Box sx={{ 
                        mt: 4, 
                        display: 'flex', 
                        gap: 2, 
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                    }}>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            size="large"
                            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : (isEditMode ? <Save /> : <Add />)}
                            disabled={isSubmitting}
                            sx={{
                                minWidth: 180,
                                height: 48,
                                borderRadius: 3,
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                background: (theme) => isEditMode 
                                    ? `linear-gradient(45deg, ${theme.palette.warning.main} 30%, ${theme.palette.warning.light} 90%)`
                                    : `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                                boxShadow: (theme) => `0 4px 20px ${isEditMode ? theme.palette.warning.main : theme.palette.primary.main}30`,
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: (theme) => `0 6px 25px ${isEditMode ? theme.palette.warning.main : theme.palette.primary.main}40`,
                                },
                                '&:disabled': {
                                    background: 'rgba(0, 0, 0, 0.12)',
                                    transform: 'none',
                                },
                            }}
                        >
                            {isSubmitting ? 'Đang xử lý...' : (isEditMode ? 'Lưu thay đổi' : 'Thêm khóa học')}
                        </Button>
                        
                        {isEditMode && (
                            <Button 
                                variant="outlined" 
                                size="large"
                                startIcon={<Cancel />}
                                onClick={clearForm}
                                sx={{
                                    minWidth: 140,
                                    height: 48,
                                    borderRadius: 3,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    borderWidth: 2,
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        borderWidth: 2,
                                        transform: 'translateY(-2px)',
                                        boxShadow: (theme) => `0 4px 15px ${theme.palette.text.primary}20`,
                                    },
                                }}
                            >
                                Hủy
                            </Button>
                        )}
                    </Box>
                </Zoom>
            </Box>

            {/* Enhanced Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.type}
                    variant="filled"
                    icon={snackbar.type === 'success' ? <CheckCircle /> : undefined}
                    sx={{
                        fontSize: '1rem',
                        borderRadius: 2,
                        boxShadow: (theme) => `0 4px 20px ${
                            snackbar.type === 'success' 
                                ? theme.palette.success.main 
                                : theme.palette.error.main
                        }30`,
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CourseForm;