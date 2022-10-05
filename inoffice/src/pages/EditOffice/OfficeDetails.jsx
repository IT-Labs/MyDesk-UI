/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styles from "../EditOffice/Editoffice.module.scss";
import { DeleteFilled, QuestionCircleOutlined } from "@ant-design/icons";
import { Checkbox, Form, Input, Button, Image, Popconfirm, Table } from "antd";
import api from "../../helper/api";
import UploadOfficePlan from "./UploadOfficePlan/UploadOfficePlan";
import Loading from "../../components/Loading/Loading";
import {
  openError,
  openNotification,
} from "../../components/notification/Notification";

const OfficeDetails = ({ props }) => {
  const officeName = props.params.name;
  const officeId = props.params.id;
  const [desks, setDesks] = useState([]);

  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getDesks = () => {
    setIsLoading(true);
    api
      .get("admin/office-desks/" + officeId)
      .then((res) => {
        setDesks(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        openNotification("There was an error while loading");
      });
  };

  const getImage = () => {
    api
      .get("admin/office/image/" + officeId)
      .then((res) => {
        setImageUrl(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getDesks();
    getImage();
  }, []);

  const save = () => {
    setIsLoading(true);
    const properlySortedData = desks.map((item) => {
      return {
        id: item.id,
        category: {
          id: item.id,
          unavailable: item.category?.unavailable ? true : false,
          singleMonitor: item.category?.singleMonitor ? true : false,
          doubleMonitor: item.category?.doubleMonitor ? true : false,
          nearWindow: item.category?.nearWindow ? true : false,
        },
      };
    });

    const config = {
      Authorization: `Bearer ${localStorage.getItem("msal.idtoken")}`,
      "Content-Type": "application/json",
    };

    api
      .put("admin/office-desks", properlySortedData, config)
      .then((res) => {
        getDesks();
        openNotification("You have successfully updated the entities");
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.response.data);
        setIsLoading(false);
        openError("It seems there was an error while saving");
      });
  };

  const check = (id, category) => {
    const newItem = desks.map((item) => {
      if (item.id === id) {
        if (category === "unavailable") {
          return {
            ...item,
            category: {
              ...item.category,
              unavailable: !item.category?.unavailable ? true : false,
            },
          };
        } else if (category === "singleMonitor") {
          return {
            ...item,
            category: {
              ...item.category,
              singleMonitor: !item.category?.singleMonitor ? true : false,
            },
          };
        } else if (category === "dualMonitor") {
          return {
            ...item,
            category: {
              ...item.category,
              doubleMonitor: !item.category?.doubleMonitor ? true : false,
            },
          };
        } else if (category === "nearWindow") {
          return {
            ...item,
            category: {
              ...item.category,
              nearWindow: !item.category?.nearWindow ? true : false,
            },
          };
        }
      }
      return item;
    });

    setDesks(newItem);

    // const newChecked = [...checked, checkedValues.target.value];
    // setChecked(newChecked);
    // const newUnchecked = unchecked.filter((item) => {
    //   let flag = false;
    //   newChecked.forEach((id) => {
    //     if (id === item) flag = true;
    //   });
    //   return flag ? false : true;
    // });
    // setUnchecked(newUnchecked);
  };

  const handleSubmit = (e) => {
    const numberOfDesk = parseInt(e.numberOfDesks);
    if (numberOfDesk < 1 || numberOfDesk > 500) {
      openError("You can only add a number between 1 and 500");
      return;
    }
    const data = {
      numberOfDesks: numberOfDesk,
    };
    const allDesks = numberOfDesk + parseInt(desks.length);
    if (allDesks > 500) {
      openError("You cannot have more than 500 desks active");
      return;
    }
    api
      .post("admin/office-desks/" + officeId, data)
      .then((res) => {
        openNotification("You have successfully added new entities");
        getDesks();
      })
      .catch((err) => {
        openError(
          "An error occurred while updating the entities, please try again"
        );
        console.log(err);
      });
  };

  const deleteNotification = (deskId) => {
    api
      .delete("admin/office-desks/" + deskId)
      .then(() => {
        getDesks();
        openNotification("You have successfully deleted the entity");
      })
      .catch(() => {
        openError(
          "An error occurred while deleting the entity, please try again"
        );
      });
  };

  const columns = [
    {
      title: "Desk No.",
      dataIndex: "indexForOffice",
      key: 1,
      align: "center",
      width: "15%",
    },
    {
      title: "Unavailable desks",
      dataIndex: "unavailable",
      key: 2,

      render: (text, item, index) => {
        return (
          <Checkbox
            className={styles.checkbox}
            checked={item.category?.unavailable}
            onChange={() => check(item.id, "unavailable")}
          ></Checkbox>
        );
      },
      align: "center",
      width: "15%",
    },
    {
      title: "Single monitor",
      dataIndex: "singleMonitor",
      key: 3,

      render: (text, item, index) => {
        return (
          <Checkbox
            className={styles.checkbox}
            checked={item.category?.singleMonitor}
            disabled={item.category?.doubleMonitor}
            onChange={() => check(item.id, "singleMonitor")}
          ></Checkbox>
        );
      },
      align: "center",
      width: "15%",
    },
    {
      title: "Dual monitor",
      dataIndex: "dualMonitor",
      key: 4,

      render: (text, item, index) => {
        return (
          <Checkbox
            className={styles.checkbox}
            checked={item.category?.doubleMonitor}
            disabled={item.category?.singleMonitor}
            onChange={() => check(item.id, "dualMonitor")}
          ></Checkbox>
        );
      },
      align: "center",
      width: "15%",
    },
    {
      title: "Near window",
      dataIndex: "nearWindow",
      key: 5,

      render: (text, item, index) => {
        return (
          <Checkbox
            className={styles.checkbox}
            checked={item.category?.nearWindow}
            onChange={() => check(item.id, "nearWindow")}
          ></Checkbox>
        );
      },
      align: "center",
      width: "15%",
    },
    {
      title: "Delete",
      dataIndex: "delete",
      align: "center",
      key: 6,
      borderRight: "none",
      render: (text, item, id) => {
        return (
          <Popconfirm
            title="Are you sure to delete this desk?"
            onConfirm={() => deleteNotification(item.id)}
            okText="OK"
            cancelText="Cancel"
            shape="round"
            style={{ padding: 0 }}
            placement="topRight"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <DeleteFilled
              className={styles.deleteIconDesks}
              key={item.id}
              value={item.id}
              style={{ padding: 0 }}
            />
          </Popconfirm>
        );
      },
      width: "15%",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.containerSize}>
        <div className={styles.firstRow}>
          <div>
            <h2 className={styles.h2}>Edit office</h2>
            <div className={styles.officeTitles}>
              Name/Location: <span className={styles.labels}>{officeName}</span>
            </div>
          </div>
          <div>
            <UploadOfficePlan
              className={styles.uploadOfficePlanButton}
              triggerText="Update office plan/information"
              imageUrl={imageUrl}
            />
          </div>
        </div>
        <div>
          <Form className={styles.form} onFinish={handleSubmit}>
            <Form.Item name="numberOfDesks">
              <Input
                className={styles.input}
                placeholder="Enter number of desks"
                type="number"
                rules
              />
            </Form.Item>
            <Button
              htmlType="submit"
              className={`${styles.uploadOfficePlan} btn ${styles.btn}`}
              block
            >
              Add new entities
            </Button>
          </Form>
        </div>
        <div className={styles.secondRow}>
          <div className={styles.secondRowSize}>
            <div id="scrollableDiv">
              {isLoading ? (
                <div className={styles.loading}>
                  <Loading />
                </div>
              ) : (
                <Table
                  bordered
                  className={styles.newTable}
                  dataSource={desks}
                  columns={columns}
                  pagination={false}
                  scroll={{ y: 322 }}
                />
              )}
            </div>
            <Popconfirm
              title="Do you want to save this changes?"
              onConfirm={() => save()}
              okText="OK"
              cancelText="Cancel"
              className={`${styles.uploadOfficePlan} greenBtn`}
              shape="round"
              placement="topRight"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            >
              <button
                style={{
                  width: 150,
                  marginLeft: 5,
                  marginTop: 10,
                  height: 30,
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </Popconfirm>
          </div>
          <div className={styles.imgContainer}>
            {imageUrl ? (
              <Image src={imageUrl} className={styles.officeImagePlan}></Image>
            ) : (
              <Image
                className={styles.officeImagePlan}
                src="https://i.postimg.cc/MpM7bn2J/Screenshot-5.png"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeDetails;
