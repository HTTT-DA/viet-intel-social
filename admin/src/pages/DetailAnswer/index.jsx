import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import styles from "./styles.module.scss";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

function DetailQuestion() {
  const [question, setQuestion] = useState({});

  useEffect(() => {
    setQuestion({
      id: 1,
      status: "pending",
      user: {
        username: "user1",
      },
      category: {
        name: "category1",
      },
      createdAt: "2021-10-10T00:00:00.000Z",
      content:
        "Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu. \nFugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu.",
    });
  }, []);

  return (
    <div>
      <h1 style={{ color: "#243c64" }}>Detail Question</h1>
      <Box bgcolor="#ffffff" padding={8} borderRadius={1} boxShadow={1}>
        <div className={styles["detail-wrapper"]}>
          <div className={`${styles["field-wrapper"]} ${styles["field-odd"]}`}>
            <div className={styles["field-label"]}>Status</div>
            <div className={styles["field-content"]}>
              {question?.status?.toUpperCase()}
            </div>
          </div>
          <div className={`${styles["field-wrapper"]} ${styles["field-even"]}`}>
            <div className={styles["field-label"]}>ID</div>
            <div className={styles["field-content"]}>{question?.id}</div>
          </div>
          <div className={`${styles["field-wrapper"]} ${styles["field-odd"]}`}>
            <div className={styles["field-label"]}>User</div>
            <div className={styles["field-content"]}>
              {question?.user?.username}
            </div>
          </div>
          <div className={`${styles["field-wrapper"]} ${styles["field-even"]}`}>
            <div className={styles["field-label"]}>Category</div>
            <div className={styles["field-content"]}>
              {question?.category?.name}
            </div>
          </div>
          <div className={`${styles["field-wrapper"]} ${styles["field-odd"]}`}>
            <div className={styles["field-label"]}>Date Created</div>
            <div className={styles["field-content"]}>
              {dayjs(question?.createdAt).format("DD/MM/YYYY HH:mm:ss")}
            </div>
          </div>
          <div className={`${styles["field-wrapper"]} ${styles["field-even"]}`}>
            <div className={styles["field-label"]}>Content</div>
            <div className={styles["field-content"]}>{question?.content}</div>
          </div>
        </div>
        <div className={styles["btn-wrapper"]}>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="error">
              DECLINE
            </Button>
            <Button variant="contained" color="success">
              ACCEPT
            </Button>
          </Stack>
        </div>
      </Box>
    </div>
  );
}

export default DetailQuestion;
