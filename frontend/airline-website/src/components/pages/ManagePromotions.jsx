import React, { useEffect, useState } from 'react';
import { useContext} from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, Box, CircularProgress } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';

// URL API
const apiUrl = 'http://localhost:3000/api/users/promotions';

function Promotions() {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
      const { user } = useContext(AuthContext);
    

    // Lấy dữ liệu từ API
    useEffect(() => {
      if (!user) {
        alert('Bạn cần đăng nhập để thanh toán!');
        return;
      }
        async function fetchPromotions() {
            try {
                localStorage.clear();
                const response = await fetch(apiUrl);
                const data = await response.json();

                // Kiểm tra kiểu dữ liệu và xử lý
                if (Array.isArray(data)) {
                    setPromotions(data);
                } else if (typeof data === 'object') {
                    const promotionsArray = Object.values(data); // Chuyển object thành array
                    setPromotions(promotionsArray);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu từ API:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPromotions();
    }, []);

    return (
        <Container sx={{ paddingTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Chương trình khuyến mãi
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {promotions.map((promotion) => (
                        <Grid item xs={12} sm={6} md={4} key={promotion.id}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={promotion.image}
                                    alt={promotion.title}
                                />
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {promotion.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" paragraph>
                                        <strong>Thời gian bắt đầu:</strong> {new Date(promotion.start_date).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" paragraph>
                                        <strong>Thời gian kết thúc:</strong> {new Date(promotion.end_date).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" paragraph>
                                        <strong>Trạng thái:</strong> {promotion.status}
                                    </Typography>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        href={promotion.description} 
                                        target="_blank"
                                        sx={{ marginTop: '1rem' }}
                                    >
                                        Xem chi tiết
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}

export default Promotions;
