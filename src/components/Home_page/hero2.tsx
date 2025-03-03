import React from "react";
import { Box, Typography, Stack, Card, CardHeader, CardMedia, CardContent, Avatar, IconButton, Grid } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export const HeroSection2 = () => {
    return (
        <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
            {/* Hero Section */}
            <Box sx={{ width: "100%", minHeight: "450px", display: "flex", bgcolor: "#352d2a", justifyContent: "center", alignItems: "center", fontFamily: "inherit" }}>
                <Stack direction="column" alignItems="center" spacing={1}>
                    <Typography sx={{ color: "white", fontSize: "3rem", fontWeight: 800, textAlign: "center", pt: "rem",fontFamily: "monospace" }}>
                        The
                    </Typography>
                    <Typography sx={{ color: "white", fontSize: "6rem", fontWeight: 400, textAlign: "center", fontFamily: "Dancing Script" }}>
                        BookClub
                    </Typography>
                </Stack>
            </Box>

            {/* Welcome Section */}
            <Box sx={{ width: "100%", minHeight: "400px", display: "flex", bgcolor: "#FEFCF8", alignItems: "center", justifyContent: "center", padding: 4 }}>
                <Box sx={{ display: "flex", width: "100%", maxWidth: "1400px", gap: 6 }}>
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <Typography sx={{ color: "#352d2a", fontSize: "3rem", fontWeight: 700,fontFamily: "monospace" }}>
                            Welcome to The BookClub
                        </Typography>
                        <Typography sx={{ color: "#555", fontSize: "1.3rem", marginTop: 2 }}>
                            Join our community of book lovers! Discover new books, share reviews, and meet fellow readers.
                        </Typography>
                    </Box>

                    <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <img
                            src="https://i.pinimg.com/736x/77/6a/d2/776ad23df6392ef660214300a837de55.jpg"
                            alt="Bookshelf"
                            style={{ width: "100%", maxWidth: "500px", borderRadius: "8px" }}
                        />
                    </Box>
                </Box>
            </Box>

            {/* Example Posts Introduction */}
            <Box sx={{ width: "100%", textAlign: "center", padding: 4, bgcolor: "#EFECE8" }}>
                <Typography sx={{ fontSize: "2.5rem", fontWeight: "bold", color: "#352d2a",fontFamily: "monospace" }}>
                    See What Our Members Are Sharing!
                </Typography>
                <Typography sx={{ fontSize: "1.2rem", color: "#666", maxWidth: "800px", margin: "auto", marginTop: 1 }}>
                    Here are some example posts from members discussing their favorite books. 
                    Dive into book reviews, discussions, and recommendations just like these in our vibrant community!
                </Typography>
            </Box>

            {/* Example Posts */}
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center", padding: 4, bgcolor: "#EFECE8" }}>
                <Grid container spacing={4} justifyContent="center">
                    
                    {/* Example Post 1 - Harry Potter */}
                    <Grid item xs={12} sm={8} md={6} lg={5}>
                        <Card sx={{ maxWidth: 700, mx: "auto", borderRadius: 2 }}>
                            <CardHeader
                                avatar={<Avatar src="https://randomuser.me/api/portraits/men/32.jpg" />}
                                title={<Typography sx={{ fontWeight: "bold" }}>Bodo</Typography>}
                                subheader="bodo@example.com"
                                action={<IconButton aria-label="settings"><MoreVertIcon /></IconButton>}
                            />
                            <CardMedia
                                component="img"
                                height="350"
                                image="https://i.pinimg.com/736x/0a/79/dd/0a79dd7d98d41d8142fb2a91a62cce4a.jpg"
                                alt="Harry Potter and the Chamber of Secrets"
                                sx={{ objectFit: "cover" }}
                            />
                            <CardContent>
                                <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                                    Harry Potter and the Chamber of Secrets
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    A thrilling continuation of Harry Potter’s journey at Hogwarts, 
                                    filled with magical creatures, mysterious messages, and the chilling secret of the Chamber. 
                                    A must-read for fantasy lovers!
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Example Post 2 - The Stranger */}
                    <Grid item xs={12} sm={8} md={6} lg={5}>
                        <Card sx={{ maxWidth: 700, mx: "auto", borderRadius: 2 }}>
                            <CardHeader
                                avatar={<Avatar src="https://randomuser.me/api/portraits/women/45.jpg" />}
                                title={<Typography sx={{ fontWeight: "bold" }}>Jhonny</Typography>}
                                subheader="jhonny@example.com"
                                action={<IconButton aria-label="settings"><MoreVertIcon /></IconButton>}
                            />
                            <CardMedia
                                component="img"
                                height="350"
                                image="https://i.pinimg.com/736x/ec/c0/c7/ecc0c768e143e14057a5ef33bcada045.jpg"
                                alt="The Stranger"
                                sx={{ objectFit: "cover" }}
                            />
                            <CardContent>
                                <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                                    The Stranger
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    A thought-provoking novel exploring existentialism and the absurd. 
                                    Meursault’s detached perspective on life makes you question everything. 
                                    A classic that stays with you long after reading.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>
            </Box>
        </Box>
    );
};
