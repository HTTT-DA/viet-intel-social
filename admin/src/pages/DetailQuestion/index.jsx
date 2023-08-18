import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCategoryByID } from "../../api-services/category";
import {
  acceptQuestion,
  declineQuestion,
  getQuestionById,
} from "../../api-services/question";
import { getUserByID } from "../../api-services/user";
import styles from "./styles.module.scss";

function DetailQuestion() {
  const [question, setQuestion] = useState({
    status: "PENDING",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const { questionId } = useParams();

  const handleDecline = async () => {
    try {
      await declineQuestion(questionId);
      window.location.href = "/content-censorship";
    } catch (error) {
      setOpenSnackbar(true);
      console.error(error);
    }
  };

  const handleAccept = async () => {
    try {
      await acceptQuestion(questionId);
      setQuestion({
        ...question,
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
        const questionResponse = await getQuestionById(questionId);
        const question = questionResponse.data;
        const categoryResponse = await getCategoryByID(question.category_id);
        const userResponse = await getUserByID(question.user_id);

        const category = categoryResponse.data;
        const user = userResponse.data;

        setQuestion({
          ...question,
          category,
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
  }, [questionId]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <h1 style={{ color: "#243c64" }}>Detail Question</h1>
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
                  {question?.status?.toUpperCase()}
                </div>
              </div>
              <div
                className={`${styles["field-wrapper"]} ${styles["field-even"]}`}
              >
                <div className={styles["field-label"]}>ID</div>
                <div className={styles["field-content"]}>{question?.id}</div>
              </div>
              <div
                className={`${styles["field-wrapper"]} ${styles["field-odd"]}`}
              >
                <div className={styles["field-label"]}>User</div>
                <div className={styles["field-content"]}>
                  {question?.user?.email}
                </div>
              </div>
              <div
                className={`${styles["field-wrapper"]} ${styles["field-even"]}`}
              >
                <div className={styles["field-label"]}>Category</div>
                <div className={styles["field-content"]}>
                  {question?.category?.name}
                </div>
              </div>
              <div
                className={`${styles["field-wrapper"]} ${styles["field-odd"]}`}
              >
                <div className={styles["field-label"]}>Date Created</div>
                <div className={styles["field-content"]}>
                  {dayjs(question?.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                </div>
              </div>
              <div
                className={`${styles["field-wrapper"]} ${styles["field-even"]}`}
              >
                <div className={styles["field-label"]}>Content</div>
                <div className={styles["field-content"]}>
                  {question?.content}
                </div>
              </div>
            </div>
            <div className={styles["btn-wrapper"]}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="error"
                  disabled={question?.status === "ACCEPTED"}
                  onClick={handleDecline}
                >
                  DECLINE
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  disabled={question?.status === "ACCEPTED"}
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

export default DetailQuestion;
