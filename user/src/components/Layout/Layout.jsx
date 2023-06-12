import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import {Container} from "@mui/material";
function Layout ({children}) {
    return(
        <>
            <Header/>
            <Container fixed>
                {children}
            </Container>
            <Footer/>
        </>
    )
}

export default Layout;