import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import dayjs from "dayjs";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  acceptAnswer,
  declineAnswer,
  getAnswerById,
} from "../../api-services/answer";
import { getContentByAnswer } from "../../api-services/question";
import { getUserByID } from "../../api-services/user";
import styles from "./styles.module.scss";

function DetailAnswer() {
  const [answer, setAnswer] = useState({
    status: "PENDING",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const { answerId } = useParams();
  const queryParams = queryString.parse(location.search);
  const questionId = queryParams.questionId;

  const handleDecline = async () => {
    try {
      await declineAnswer(answerId);
      window.location.href = `/content-censorship/list-answers/${questionId}`;
    } catch (error) {
      setOpenSnackbar(true);
      console.error(error);
    }
  };

  const handleAccept = async () => {
    try {
      await acceptAnswer(answerId);
      setAnswer({
        ...answer,
        status: "ACCEPTED",
      });
    } catch (error) {
      setOpenSnackbar(true);
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const answerResponse = await getAnswerById(answerId);
        const answer = answerResponse.data;
        console.log(answer)
        const questionResponse = await getContentByAnswer(answer.question_id);
        const userResponse = await getUserByID(answer.user_id);

        const question = questionResponse.data;
        const user = userResponse.data;

        setAnswer({
          ...answer,
          question,
          user,
        });
      } catch (error) {
        setOpenSnackbar(true);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [answerId]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <h1 style={{ color: "#243c64" }}>Detail Answer</h1>
      <Box bgcolor="#ffffff" padding={8} borderRadius={1} boxShadow={1}>
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <div className={styles["detail-wrapper"]}>
              <div
                className={`${styles["field-wrapper"]} ${styles["field-odd"]}`}
              >
                <div className={styles["field-label"]}>Status</div>
                <div className={styles["field-content"]}>
                  {answer?.status?.toUpperCase()}
                </div>
              </div>
              <div
                className={`${styles["field-wrapper"]} ${styles["field-even"]}`}
              >
                <div className={styles["field-label"]}>ID</div>
                <div className={styles["field-content"]}>{answer?.id}</div>
              </div>
              <div
                className={`${styles["field-wrapper"]} ${styles["field-odd"]}`}
              >
                <div className={styles["field-label"]}>User</div>
                <div className={styles["field-content"]}>
                  {answer?.user?.email}
                </div>
              </div>
              <div
                className={`${styles["field-wrapper"]} ${styles["field-odd"]}`}
              >
                <div className={styles["field-label"]}>Date Created</div>
                <div className={styles["field-content"]}>
                  {dayjs(answer?.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                </div>
              </div>
              <div
                className={`${styles["field-wrapper"]} ${styles["field-even"]}`}
              >
                <div className={styles["field-label"]}>Question Content</div>
                <div className={styles["field-content"]}>
                  {answer?.question?.content}
                </div>
              </div>
              <div
                className={`${styles["field-wrapper"]} ${styles["field-even"]}`}
              >
                <div className={styles["field-label"]}>Content</div>
                <div className={styles["field-content"]}>{answer?.content}</div>
              </div>
              <div
                className={`${styles["field-wrapper"]} ${styles["field-even"]}`}
              >
                <div className={styles["field-label"]}>Reference</div>
                <div className={styles["field-content"]}>
                  {answer?.reference}
                </div>
              </div>
              <div
                className={`${styles["field-wrapper"]} ${styles["field-even"]}`}
              >
                <div className={styles["field-label"]}>Image</div>
                <div className={styles["field-content"]}>
                  {answer?.image}
                </div>
              </div>
            </div>
            <div className={styles["btn-wrapper"]}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="error"
                  disabled={answer?.status === "ACCEPTED"}
                  onClick={handleDecline}
                >
                  DECLINE
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  disabled={answer?.status === "ACCEPTED"}
                  onClick={handleAccept}
                >
                  ACCEPT
                </Button>
              </Stack>
            </div>
          </>
        )}
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity={"error"} sx={{ width: "100%" }}>
          {"Something went wrong ! Please try again !"}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default DetailAnswer;
