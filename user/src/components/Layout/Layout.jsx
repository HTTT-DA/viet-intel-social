import Header from "../Header/Header";
import {Container} from "@mui/material";
function Layout ({children}) {
    return(
        <>
            <Header/>
            <Container fixed>
                {children}
            </Container>
        </>
    )
}

export default Layout;