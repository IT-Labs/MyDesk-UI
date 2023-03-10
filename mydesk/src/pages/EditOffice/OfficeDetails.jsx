/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import styles from "../EditOffice/Editoffice.module.scss";
import { DeleteFilled, QuestionCircleOutlined } from "@ant-design/icons";
import {
  Checkbox,
  Form,
  Input,
  Button,
  Image,
  Popconfirm,
  Table,
  Col,
  Row,
} from "antd";
import UploadOfficePlan from "./UploadOfficePlan/UploadOfficePlan";
import Loading from "../../components/Loading/Loading";
import {
  fetchAdminAllDeskApi,
  updateOfficeDeskApi,
  addNewDeskApi,
  deleteDeskApi,
} from "../../services/desk.service";
import { fetchAdminOfficeImageApi } from "../../services/office.service";
import { checkDeskProperty } from "../../utils/checkDeskProperty";
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
  const [saveBtnDisabled, setSaveBtnDisabled] = useState(true);
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
            data-cy="checkbox-unavailable"
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
            data-cy="checkbox-1monitor"
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
            data-cy="checkbox-2monitor"
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
            data-cy="checkbox-nearwindow"
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
            title="Are you sure you want to delete this desk?"
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
              data-cy="delete-desk"
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

  const getDesks = () => {
    setIsLoading(true);
    fetchAdminAllDeskApi(officeId)
      .then((res) => {
        setDesks(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const getImage = () => {
    fetchAdminOfficeImageApi(officeId).then((res) => {
      setImageUrl(res.data);
    });
  };

  const getNewImage = () => {
    getImage();
  };

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

    updateOfficeDeskApi(properlySortedData)
      .then((res) => {
        setSaveBtnDisabled(true);
        getDesks();
        openNotification("You have successfully updated the entities");
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const check = (id, category) => {
    const newItem = checkDeskProperty(desks, id, category);

    setSaveBtnDisabled(false);
    setDesks(newItem);
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

    addNewDeskApi(officeId, data).then((res) => {
      setSaveBtnDisabled(false);
      openNotification("You have successfully added new entities");
      getDesks();
    });
  };

  const deleteNotification = (deskId) => {
    deleteDeskApi(deskId).then(() => {
      setSaveBtnDisabled(false);
      getDesks();
      openNotification("You have successfully deleted the entity");
    });
  };

  useEffect(() => {
    getDesks();
    getImage();
  }, []);

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
              getNewProps={getNewImage}
            />
          </div>
        </div>
        <div>
          <Form className={styles.form} onFinish={handleSubmit}>
            <Form.Item name="numberOfDesks">
              <Input
                className={styles.input}
                data-cy="input-numberofdesks"
                placeholder="Enter number of desks"
                type="number"
                rules
              />
            </Form.Item>
            <Button
              htmlType="submit"
              data-cy="button-addentities"
              className={`${styles.uploadOfficePlan} btn ${styles.btn}`}
              block
            >
              Add new entities
            </Button>
          </Form>
        </div>

        <Row gutter={[8, 8]} className={styles.tableRow}>
          <Col
            className={styles.tableCol}
            span={12}
            xl={12}
            lg={12}
            md={23}
            sm={23}
            xs={23}
          >
            <div>
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
                className={saveBtnDisabled ? null : "greenBtn"}
                shape="round"
                placement="topRight"
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                disabled={saveBtnDisabled}
              >
                <Button
                  data-cy="save-button"
                  style={{
                    width: 150,
                    marginLeft: 5,
                    marginTop: 10,
                    height: 30,
                    cursor: "pointer",
                  }}
                  disabled={saveBtnDisabled}
                >
                  Save
                </Button>
              </Popconfirm>
            </div>
          </Col>
          <Col
            className={styles.tableCol}
            span={12}
            xl={12}
            lg={12}
            md={23}
            sm={23}
            xs={23}
          >
            <div className={styles.imgContainer}>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  className={styles.officeImagePlan}
                ></Image>
              ) : (
                <Image
                  className={styles.officeImagePlan}
                  src="https://i.postimg.cc/MpM7bn2J/Screenshot-5.png"
                />
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default OfficeDetails;
