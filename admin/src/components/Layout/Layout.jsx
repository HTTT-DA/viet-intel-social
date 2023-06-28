import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import {Container, Grid} from "@mui/material";
function Layout ({children}) {
    return(
        <>
            <Grid container spacing={2}>
                <Grid item md={3}>
                    <Sidebar />
                </Grid>
                <Grid item md={9}>
                    <Container fixed>
                    <Header/>
                        {children}
                    </Container>
                </Grid>
            </Grid>
        </>
    )
}

export default Layout;