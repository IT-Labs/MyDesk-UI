/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styles from "../EditOffice/Editoffice.module.scss";
import { DeleteFilled } from "@ant-design/icons";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Checkbox, Form, Input, Button, Image, Popconfirm, Table } from "antd";
import api from "../../helper/api";
import UploadOfficePlan from "./UploadOfficePlan/UploadOfficePlan";
import Loading from "../../components/Loading/Loading";
import {
  openError,
  openNotification,
} from "../../components/notification/Notification";

const OfficeDetails = ({ props }) => {
  const [officeName] = useState(props.params.name);
  const [officeId] = useState(props.params.id);
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
        deskId: item.id,
        unavailable: item.categories?.unavailable ? true : false,
        singleMonitor: item.categories?.singleMonitor ? true : false,
        dualMonitor: item.categories?.doubleMonitor ? true : false,
        nearWindow: item.categories?.nearWindow ? true : false,
      };
    });

    const data = {
      ListOfDesksToUpdate: [...properlySortedData],
    };

    const config = {
      Authorization: `Bearer ${localStorage.getItem("msal.idtoken")}`,
      "Content-Type": "application/json",
    };

    api
      .put(
        "admin/office-desks",
        {
          listOfDesksToUpdate: [...properlySortedData],
        },
        config
      )
      .then((res) => {
        getDesks();
        openNotification("You have successfully updated the entities");
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.response);
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
            categories: {
              ...item.categories,
              unavailable: !item.categories?.unavailable ? true : false,
            },
          };
        } else if (category === "singleMonitor") {
          return {
            ...item,
            categories: {
              ...item.categories,
              singleMonitor: !item.categories?.singleMonitor ? true : false,
            },
          };
        } else if (category === "dualMonitor") {
          return {
            ...item,
            categories: {
              ...item.categories,
              doubleMonitor: !item.categories?.doubleMonitor ? true : false,
            },
          };
        } else if (category === "nearWindow") {
          return {
            ...item,
            categories: {
              ...item.categories,
              nearWindow: !item.categories?.nearWindow ? true : false,
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
        console.log(err);
      });
  };

  const deleteNotification = (deskId) => {
    api
      .delete("admin/office-desks/" + deskId)
      .then(() => {
        getDesks();
        openNotification("You successfully deleted the entity");
      })
      .catch(() => {
        openError("Error while deleting desk");
      });
  };

  const columns = [
    {
      title: "All desks",
      dataIndex: "indexForOffice",
      key: 1,
      align: "center",
      width: "16.6666666667%",
    },
    {
      title: "Unavailable desks",
      dataIndex: "unavailable",
      key: 2,

      render: (text, item, index) => {
        return (
          <Checkbox
            className={styles.checkbox}
            checked={item.categories?.unavailable}
            onChange={() => check(item.id, "unavailable")}
          ></Checkbox>
        );
      },
      align: "center",
      width: "10%",
    },
    {
      title: "Single monitor",
      dataIndex: "singleMonitor",
      key: 3,

      render: (text, item, index) => {
        return (
          <Checkbox
            className={styles.checkbox}
            checked={item.categories?.singleMonitor}
            disabled={item.categories?.doubleMonitor}
            onChange={() => check(item.id, "singleMonitor")}
          ></Checkbox>
        );
      },
      align: "center",
      width: "16.6666666667%",
    },
    {
      title: "Dual monitor",
      dataIndex: "dualMonitor",
      key: 4,

      render: (text, item, index) => {
        return (
          <Checkbox
            className={styles.checkbox}
            checked={item.categories?.doubleMonitor}
            disabled={item.categories?.singleMonitor}
            onChange={() => check(item.id, "dualMonitor")}
          ></Checkbox>
        );
      },
      align: "center",
      width: "16.6666666667%",
    },
    {
      title: "Near window",
      dataIndex: "nearWindow",
      key: 5,

      render: (text, item, index) => {
        return (
          <Checkbox
            className={styles.checkbox}
            checked={item.categories?.nearWindow}
            onChange={() => check(item.id, "nearWindow")}
          ></Checkbox>
        );
      },
      align: "center",
      width: "16.6666666667%",
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
            okText="Yes"
            cancelText="No"
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
      width: "10%",
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
            <button
              className={`${styles.uploadOfficePlan} greenBtn`}
              onClick={save}
              // block
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
