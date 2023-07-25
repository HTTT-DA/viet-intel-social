import Header from "./Header";
import {Container} from "@mui/material";
function Index ({children}) {
    return(
        <>
            <Header/>
            <Container fixed>
                {children}
            </Container>
        </>
    )
}

export default Index;