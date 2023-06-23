import { Grid} from "@mui/material";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import QuestionCard from "../../components/QuestionCard/QuestionCard";
import Leaderboard from "../../components/Leaderboard/Leaderboard";
import QuestionModal from "../../components/QuestionModal/QuestionModal";
function Home() {
  return (
    <>
        <Grid container spacing={6}>
            <Grid item xs={3}>
                <Grid container direction="column" spacing={2}>
                    <Grid item  position='fixed'>
                        <ProfileCard/>
                    </Grid>
                    <Grid item position='fixed' sx={{
                        bottom:20,
                    }}>
                        <QuestionModal/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid container direction="column" spacing={3}>
                    <Grid item>
                        <QuestionCard/>
                    </Grid>
                    <Grid item>
                        <QuestionCard/>
                    </Grid>
                    <Grid item>
                        <QuestionCard/>
                    </Grid>
                    <Grid item>
                        <QuestionCard/>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={3}>
                <Grid container direction="column">
                    <Grid item position='fixed' sx={{
                        marginRight: 2,
                    }}>
                        <Leaderboard />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </>
  );
}

export default Home;