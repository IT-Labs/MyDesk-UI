import React from "react";
import { useState, useEffect } from "react";
import { List, Card, Layout, Button } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import api from "../../helper/api";

const CardsSection = (props) => {
  const [loadingData, setLoading] = useState(true);
  const [dataConfRooms, setDataConfRooms] = useState([]);
  const [selectedCardInSection, setselectedCardInSection] = useState();
  const [dataDesks, setDataDesks] = useState([]);
  const { Meta } = Card;

  function selectCard(e) {
    props.selectedCard(e);
    setselectedCardInSection(e);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await api
        .get("employee/office-desks/" + props.officeid)
        .then((response) => {
          setDataDesks(response.data);
        })
        .catch((error) => {
          console.error("error message");
        });
      await api
        .get("employee/office-conferencerooms/" + props.officeid)
        .then((response) => {
          setDataConfRooms(response.data);
        })
        .catch((error) => {
          console.error("error message");
        });
      setLoading(false);
    };
    fetchData();
  }, [props.officeid, props.refresh]);

  return (
    <div>
      {loadingData && <div>Loading</div>}
      {!loadingData && (
        <div
          id="scrollableDiv"
          style={{
            height: 600,
            overflow: "auto",
            padding: "0 16px",
            border: "2px solid rgba(140, 140, 140, 0.35)",
          }}
        >
          <br></br>
          <InfiniteScroll
            dataLength={dataConfRooms.length + dataDesks.length}
            scrollableTarget="scrollableDiv"
            display="flex"
          >
            <Layout>
              <List
                grid={{ gutter: 5, column: 5 }}
                dataSource={dataConfRooms.concat(dataDesks)}
                renderItem={(item, index) => (
                  <List.Item
                    style={{
                      border:
                        item == selectedCardInSection ? "solid 2px" : "none",
                    }}
                  >
                    <Card
                      onClick={() => selectCard(item)}
                      bodyStyle={{
                        backgroundColor:
                          item.reservationId != null ? "#f37076" : "#69e28d",
                      }}
                      hoverable={true}
                      bordered={true}
                    >
                      <Meta
                        title={
                          !item.categories
                            ? "Conf Room " + [index + 1]
                            : "Desk " + [index + 1 - dataConfRooms.length]
                        }
                        description={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "start",
                            }}
                            className="cardContentInformation"
                          >
                            {item.capacity >= 0 ? (
                              <p style={{ color: "#000000	" }}>
                                Capacity:{item.capacity}
                              </p>
                            ) : (
                              <p
                                style={{
                                  color: "#000000	",
                                }}
                              >
                                Category:{item.categories}
                              </p>
                            )}
                          </div>
                        }
                      />
                    </Card>
                  </List.Item>
                )}
              />
            </Layout>
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};
export default CardsSection;
