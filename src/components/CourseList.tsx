import  { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useAppSelector, useAppDispatch } from '../app/store';
import { fetchCourses, deleteCourse } from '../features/courses/courseSlice';

import ConfirmationDialog from './ConfirmationDialog';
import {
    CircularProgress,
    Alert,
    Box,
    Card,
    CardContent,
    CardActions,
    Typography,
    IconButton,
    Chip,
    Grid,
    Fade,
    Zoom,
    Tooltip,
    Badge,
    Divider,
    Skeleton,

} from '@mui/material';
import { 
    Edit, 
    Delete, 
    School, 
    Person, 
    BookmarkBorder,
    LibraryBooks,
} from '@mui/icons-material';
import type { Course } from '../features/courses/courseTypes';

interface CourseListProps {
    onEdit: (course: Course) => void;
}

const CourseList: FC<CourseListProps> = ({ onEdit }) => {
    const dispatch = useAppDispatch();
    const { courses, status, error } = useAppSelector((state) => state.courses);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCourses());
        }
    }, [status, dispatch]);

    const handleDeleteClick = (id: string, courseName: string) => {
        setCourseToDelete(id);
        setDialogOpen(true);
    };
    
    const handleConfirmDelete = async () => {
        if (courseToDelete) {
            setDeletingId(courseToDelete);
            try {
                await dispatch(deleteCourse(courseToDelete)).unwrap();
            } catch (error) {
                console.error('Failed to delete course:', error);
            } finally {
                setDeletingId(null);
            }
        }
        setDialogOpen(false);
        setCourseToDelete(null);
    };

    const getCreditColor = (credits: number) => {
        if (credits <= 2) return 'success';
        if (credits <= 4) return 'primary';
        return 'warning';
    };

    const LoadingSkeleton = () => (
        <Grid container spacing={3}>
            {[1, 2, 3, 4].map((item) => (
                <Grid item xs={12} sm={6} lg={4} key={item}>
                    <Card sx={{ height: 280 }}>
                        <CardContent>
                            <Skeleton variant="text" width="80%" height={32} />
                            <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
                            <Skeleton variant="text" width="100%" height={20} sx={{ mt: 2 }} />
                            <Skeleton variant="text" width="100%" height={20} />
                            <Skeleton variant="text" width="60%" height={20} />
                            <Skeleton variant="text" width="70%" height={20} sx={{ mt: 2 }} />
                        </CardContent>
                        <CardActions>
                            <Skeleton variant="circular" width={40} height={40} />
                            <Skeleton variant="circular" width={40} height={40} />
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    const EmptyState = () => (
        <Fade in timeout={800}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 8,
                    textAlign: 'center',
                }}
            >
                <LibraryBooks 
                    sx={{ 
                        fontSize: 80, 
                        color: 'text.secondary', 
                        mb: 2,
                        opacity: 0.5,
                    }} 
                />
                <Typography variant="h5" color="text.secondary" gutterBottom>
                    Chưa có khóa học nào
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
                    Hãy thêm khóa học đầu tiên của bạn bằng cách sử dụng form ở trên!
                </Typography>
            </Box>
        </Fade>
    );

    const CourseCard = ({ course, index }: { course: Course; index: number }) => (
        <Grid item xs={12} sm={6} lg={4} key={course.id}>
            <Zoom in timeout={300 + index * 100}>
                <Card
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        background: (theme) => theme.palette.mode === 'dark' 
                            ? 'linear-gradient(145deg, rgba(30, 30, 30, 0.9) 0%, rgba(50, 50, 50, 0.9) 100%)'
                            : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                            transform: 'translateY(-8px) scale(1.02)',
                            boxShadow: (theme) => `0 12px 40px ${theme.palette.primary.main}20`,
                            '& .course-actions': {
                                opacity: 1,
                                transform: 'translateY(0)',
                            },
                            '& .course-title': {
                                color: 'primary.main',
                            },
                        },
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            borderRadius: '4px 4px 0 0',
                        },
                    }}
                >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        {/* Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography 
                                    variant="h6" 
                                    component="h3"
                                    className="course-title"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        lineHeight: 1.3,
                                        transition: 'color 0.3s ease',
                                        mb: 1,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {course.name}
                                </Typography>
                                <Chip
                                    size="small"
                                    icon={<School />}
                                    label={`${course.credits} tín chỉ`}
                                    color={getCreditColor(course.credits)}
                                    variant="outlined"
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Description */}
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                                mb: 3,
                                lineHeight: 1.6,
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                minHeight: '4.8em', // 3 lines * 1.6 line-height
                            }}
                        >
                            {course.description}
                        </Typography>

                        <Divider sx={{ my: 2, opacity: 0.3 }} />

                        {/* Instructor */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography 
                                variant="body2" 
                                color="text.primary"
                                sx={{ fontWeight: 500 }}
                            >
                                {course.instructor}
                            </Typography>
                        </Box>
                    </CardContent>

                    {/* Actions */}
                    <CardActions 
                        className="course-actions"
                        sx={{
                            p: 2,
                            pt: 0,
                            opacity: 0.7,
                            transform: 'translateY(10px)',
                            transition: 'all 0.3s ease',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Chỉnh sửa khóa học" arrow>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(course);
                                    }}
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                            transform: 'scale(1.1)',
                                        },
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Xóa khóa học" arrow>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(course.id, course.name);
                                    }}
                                    disabled={deletingId === course.id}
                                    sx={{
                                        bgcolor: 'error.main',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'error.dark',
                                            transform: 'scale(1.1)',
                                        },
                                        '&:disabled': {
                                            bgcolor: 'action.disabled',
                                        },
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {deletingId === course.id ? (
                                        <CircularProgress size={16} color="inherit" />
                                    ) : (
                                        <Delete fontSize="small" />
                                    )}
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Chip
                            size="small"
                            icon={<BookmarkBorder />}
                            label="Khóa học"
                            variant="outlined"
                            sx={{ 
                                fontSize: '0.7rem',
                                height: 24,
                                opacity: 0.7,
                            }}
                        />
                    </CardActions>

                    {/* Loading overlay for deletion */}
                    {deletingId === course.id && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                bgcolor: 'rgba(0, 0, 0, 0.7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 1,
                                zIndex: 1,
                            }}
                        >
                            <CircularProgress color="primary" />
                        </Box>
                    )}
                </Card>
            </Zoom>
        </Grid>
    );

    // Main content rendering
    let content;
    if (status === 'loading') {
        content = <LoadingSkeleton />;
    } else if (status === 'succeeded') {
        content = courses.length === 0 ? (
            <EmptyState />
        ) : (
            <Grid container spacing={3}>
                {courses.map((course, index) => (
                    <CourseCard key={course.id} course={course} index={index} />
                ))}
            </Grid>
        );
    } else if (status === 'failed') {
        content = (
            <Fade in timeout={500}>
                <Alert 
                    severity="error"
                    sx={{
                        borderRadius: 2,
                        fontSize: '1rem',
                        '& .MuiAlert-icon': {
                            fontSize: '1.5rem',
                        },
                    }}
                >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Không thể tải danh sách khóa học
                    </Typography>
                    {error}
                </Alert>
            </Fade>
        );
    }

    return (
        <Box>
            {/* Stats Bar */}
            {status === 'succeeded' && courses.length > 0 && (
                <Fade in timeout={600}>
                    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                        <Badge
                            badgeContent={courses.length}
                            color="primary"
                            sx={{
                                '& .MuiBadge-badge': {
                                    fontSize: '0.9rem',
                                    height: 28,
                                    minWidth: 28,
                                    fontWeight: 700,
                                },
                            }}
                        >
                            <Chip
                                icon={<LibraryBooks />}
                                label="Tổng số khóa học"
                                variant="outlined"
                                size="medium"
                                sx={{
                                    fontSize: '1rem',
                                    px: 1,
                                    py: 2.5,
                                    fontWeight: 600,
                                }}
                            />
                        </Badge>
                    </Box>
                </Fade>
            )}

            {content}

            <ConfirmationDialog 
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="🗑️ Xác nhận Xóa Khóa học"
                message="Bạn có chắc chắn muốn xóa khóa học này không? Hành động này không thể hoàn tác."
            />
        </Box>
    );
};

export default CourseList;