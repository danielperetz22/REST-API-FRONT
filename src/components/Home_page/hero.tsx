import { Box, Typography, Button, Grid, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
    const navigate = useNavigate();
  return (
    <Box sx={{ width: "100vw", height: "90vh", display: "flex", marginTop:"10rem"}}>

      <Container maxWidth="xl" sx={{ width: "100vw" }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={7}
            sx={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "2rem",}}>

            <Box
              sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", width: "100%" }}>
              <Typography variant="h2" gutterBottom sx={{ fontWeight: 800 }}>
                Discover, Share, and Discuss Your Favorite Books</Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                Join a vibrant community of book lovers! Share reviews, get
                recommendations, and connect with others who share your passion
                for reading.</Typography>

            <Button variant="outlined" size="medium" onClick={() => navigate("/register")}> Get Started</Button>
            </Box>
          </Grid>

          {/* Right Image */}
          <Grid item xs={12} md={5}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794"
              alt="Bookshelf"
              sx={{ width: "100%", borderRadius: 2, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", maxHeight: "500px"}}/>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};