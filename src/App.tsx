import { useState } from 'react';
import type { FC } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
  Fade,
  Paper,
} from '@mui/material';
import { 
  Brightness4, 
  Brightness7,
  School,
  AutoStories
} from '@mui/icons-material';
import type { Course } from './features/courses/courseTypes';
import CourseForm from './components/CourseForm';
import CourseList from './components/CourseList';

const App: FC = () => {
    const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
    const [darkMode, setDarkMode] = useState(false);

    // Create dynamic theme
    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: darkMode ? '#90caf9' : '#1976d2',
                light: darkMode ? '#bbdefb' : '#42a5f5',
                dark: darkMode ? '#64b5f6' : '#1565c0',
            },
            secondary: {
                main: darkMode ? '#f48fb1' : '#dc004e',
            },
            background: {
                default: darkMode 
                    ? 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                paper: darkMode ? '#1e1e1e' : '#ffffff',
            },
        },
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            h4: {
                fontWeight: 700,
                letterSpacing: '-0.5px',
            },
            h6: {
                fontWeight: 600,
            },
        },
        components: {
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        background: darkMode 
                            ? 'linear-gradient(45deg, #1a1a2e 30%, #16213e 90%)'
                            : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                    },
                },
            },
            MuiContainer: {
                styleOverrides: {
                    root: {
                        paddingTop: '2rem',
                        paddingBottom: '2rem',
                    },
                },
            },
        },
    });

    const handleEdit = (course: Course) => {
        setCourseToEdit(course);
        // Smooth scroll to top
        window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
        });
    };

    const handleFinishEditing = () => {
        setCourseToEdit(null);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: '100vh',
                    background: darkMode 
                        ? 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundAttachment: 'fixed',
                }}
            >
                <AppBar 
                    position="static" 
                    elevation={0}
                    sx={{ 
                        mb: 4,
                        background: darkMode 
                            ? 'linear-gradient(45deg, #1a1a2e 30%, #16213e 90%)'
                            : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        backdropFilter: 'blur(10px)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <Toolbar sx={{ py: 1 }}>
                        <School sx={{ mr: 2, fontSize: 28 }} />
                        <Typography 
                            variant="h6" 
                            component="div" 
                            sx={{ 
                                flexGrow: 1,
                                fontWeight: 700,
                                letterSpacing: '0.5px',
                                fontSize: '1.5rem',
                            }}
                        >
                            Hệ thống Đăng ký Khóa học
                        </Typography>
                        <AutoStories sx={{ mr: 1, opacity: 0.8 }} />
                        <IconButton 
                            onClick={toggleDarkMode} 
                            color="inherit"
                            sx={{
                                ml: 1,
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'rotate(180deg)',
                                },
                            }}
                        >
                            {darkMode ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                    <Fade in timeout={800}>
                        <Box>
                            {/* Course Form Section */}
                            <Paper
                                elevation={darkMode ? 8 : 12}
                                sx={{
                                    p: { xs: 2, sm: 3, md: 4 },
                                    mb: 4,
                                    borderRadius: 3,
                                    background: darkMode 
                                        ? 'rgba(30, 30, 30, 0.8)'
                                        : 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: darkMode 
                                            ? '0 12px 40px rgba(0, 0, 0, 0.3)'
                                            : '0 12px 40px rgba(0, 0, 0, 0.15)',
                                    },
                                }}
                            >
                                <Typography 
                                    variant="h4" 
                                    gutterBottom
                                    sx={{
                                        background: darkMode
                                            ? 'linear-gradient(45deg, #90caf9, #64b5f6)'
                                            : 'linear-gradient(45deg, #2196F3, #21CBF3)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 3,
                                        textAlign: 'center',
                                    }}
                                >
                                    {courseToEdit ? '✏️ Chỉnh sửa khóa học' : '➕ Thêm khóa học mới'}
                                </Typography>
                                <CourseForm 
                                    courseToEdit={courseToEdit} 
                                    onFinishEditing={handleFinishEditing} 
                                />
                            </Paper>

                            {/* Course List Section */}
                            <Paper
                                elevation={darkMode ? 8 : 12}
                                sx={{
                                    p: { xs: 2, sm: 3, md: 4 },
                                    borderRadius: 3,
                                    background: darkMode 
                                        ? 'rgba(30, 30, 30, 0.8)'
                                        : 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: darkMode 
                                            ? '0 12px 40px rgba(0, 0, 0, 0.3)'
                                            : '0 12px 40px rgba(0, 0, 0, 0.15)',
                                    },
                                }}
                            >
                                <Typography 
                                    variant="h4" 
                                    gutterBottom
                                    sx={{
                                        background: darkMode
                                            ? 'linear-gradient(45deg, #f48fb1, #f06292)'
                                            : 'linear-gradient(45deg, #dc004e, #f06292)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 3,
                                        textAlign: 'center',
                                    }}
                                >
                                    📚 Danh sách khóa học
                                </Typography>
                                <CourseList onEdit={handleEdit} />
                            </Paper>
                        </Box>
                    </Fade>
                </Container>

                {/* Floating background elements */}
                <Box
                    sx={{
                        position: 'fixed',
                        top: '20%',
                        left: '10%',
                        width: '300px',
                        height: '300px',
                        background: darkMode
                            ? 'radial-gradient(circle, rgba(144, 202, 249, 0.1) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(33, 150, 243, 0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(40px)',
                        zIndex: -1,
                        animation: 'float 6s ease-in-out infinite',
                        '@keyframes float': {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-20px)' },
                        },
                    }}
                />
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: '20%',
                        right: '10%',
                        width: '200px',
                        height: '200px',
                        background: darkMode
                            ? 'radial-gradient(circle, rgba(244, 143, 177, 0.1) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(220, 0, 78, 0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(40px)',
                        zIndex: -1,
                        animation: 'float 8s ease-in-out infinite reverse',
                    }}
                />
            </Box>
        </ThemeProvider>
    );
};

export default App;