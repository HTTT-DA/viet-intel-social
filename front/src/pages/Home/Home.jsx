import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import {Button} from "@mui/material";

function Home() {
  return (
    <>
        <Button variant="text">Text</Button>
        <Button variant="contained">Contained</Button>
        <Button variant="outlined">Outlined</Button>
        <FontAwesomeIcon icon={faImage} />
        <h1>Home</h1>
    </>
  );
}

export default Home;