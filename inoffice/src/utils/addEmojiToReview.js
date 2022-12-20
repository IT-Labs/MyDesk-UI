import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";
import styles from "../pages/Dashboard/Dashboard.module.scss";

export const addEmojiToReview = (reviews) => {
  const reviewUpdated = reviews.map((item, id) => {
    return {
      ...item,
      reviewOutput:
        item.reviewOutput &&
        (item.reviewOutput === "Positive" ? (
          <SmileOutlined className={styles.emoji} />
        ) : item.reviewOutput === "Neutral" ? (
          <MehOutlined className={styles.emoji} />
        ) : (
          <FrownOutlined className={styles.emoji} />
        )),
      review: item.reviews.length > 0 ? item.reviews : "This review is blank",
      key: id,
    };
  });

  return reviewUpdated;
};
