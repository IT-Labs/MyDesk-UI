import React from "react";
import "antd/dist/antd.css";
import {
    Row,
    Col,
    Space,
    notification,
    Select,
    Spin,
    List,
    Layout
} from "antd";
import {DeleteFilled} from '@ant-design/icons';
import {useState, useEffect} from "react";
import api from "../../helper/api";
import {LoadingOutlined} from '@ant-design/icons';


const FutureReservations = () => {
    const antIcon = <LoadingOutlined style={
            {fontSize: 24}
        }
        spin/>

    const [loadingData, setLoading] = useState(true);
    const [futurereservations, setFutureReservations] = useState([]);
    const [refreshstate, setRefreshState] = useState();
    


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await api.get("employee/reserve").then((response) => {
                setFutureReservations(response.data)
            }).catch((error) => {
                console.error("Error message");
            })

            setLoading(false);
        };
        fetchData();
    }, [refreshstate])



    const deleteNotification = async (id) => {
         
       
      await api.delete("employee/reserve/" + id)
      .then((response) => {
        notification.open(
          {
            message: 'Notification', 
            description: "You successfully canceled a reservation", 
            placement: "top", 
            duration: 1
          }
        );
        setRefreshState({})
      }).catch((error) => {
        console.error("Error message");
      })
    }
    return (
        <div> {
            loadingData && <Spin indicator={antIcon}/>
        }
            {
            !loadingData && (
              <div> 
                
                <Row align="middle">
                        <Col span={2}></Col>
                        <Col span={4}>
                            Date
                        </Col>
                        <Col span={5}></Col>
                        <Col span={4}>
                        <label>Entity</label>
                        </Col>
                        <Col span={7}></Col>
                        <Col span={2}>Options</Col>
                    </Row>
                    <Space>
                        <Row>
                            <Col span={24}>
                                <div></div>
                            </Col>
                        </Row>
                    </Space>
                <List 
                dataSource={futurereservations}
                renderItem={(item,index) =>(
                  <List.Item>
                    <Layout>
                    <Row align="middle">
                        <Col span={1}>
                        </Col>
                        
                        <Col span={6}>
                        {item.startDate.split("T")[0].split("-").reverse().join("/")} - {item.endDate.split("T")[0].split("-").reverse().join("/")}
                        </Col>
                        <Col span={3}></Col>
                        <Col span={5}>
                          {item.deskId ? "Desk" : "Conference room" } [{item.deskId ? item.deskIndex : item.confRoomIndex}]
                        </Col>
                        <Col span={6}></Col>
                        <Col span={2} >Cancel reservation</Col>
                        <Col span={1}>
                          <DeleteFilled style={{ cursor: 'pointer'}}  onClick={() => deleteNotification(item.id)}/>
                        </Col>
                      </Row>
                      </Layout>
                    
                  </List.Item>
                )}
                />
              </div>
            )
        } </div>
    )
}
export default FutureReservations;
