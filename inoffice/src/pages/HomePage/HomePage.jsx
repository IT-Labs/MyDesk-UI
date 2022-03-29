import React, {Component} from "react";
import UserHead from "../../components/Head/UserHead";
import Layout, { Content } from "antd/lib/layout/layout";
import {
    Button,
    Row,
    Col
} from "antd";
import {Space} from 'antd';
import OfficeBranchSelection from "../../components/inputs/OfficeBranchSelection"
import Availability from "../../components/inputs/Availability";
import Entity from "../../components/inputs/Entity";
import SearchBar from "../../components/inputs/SearchBar";
import CalendarImplementation from "../../components/inputs/CalendarImplementation";
import OfficeImage from "../../components/inputs/OfficeImage";
import {useState} from "react";

const Home = () => {
    const [officeid, setofficeid] = useState()

    function changeofficebranch(value) {
        setofficeid(value)
    }

    return (
        <Layout style={
            {height: 730}
        }>
            <UserHead/>
            <Content>
                <Space>
                    <Row>
                        <Col span={24}>
                            <div></div>
                        </Col>
                    </Row>
                </Space>
                <Row align="middle">
                    <Col span={1}></Col>
                    <Col span={3}>
                        <OfficeBranchSelection onOfficebranchChange={changeofficebranch}/>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        <Availability/>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={3}>
                        <Entity/>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={4} >
                        <SearchBar/>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={4}>
                        <CalendarImplementation />
                    </Col>
                    <Col span={1}></Col>
                </Row>
                <Row>
                    <Col span={1}></Col>
                    <Col span={13}>
                        <OfficeImage officeid={officeid}/>
                    </Col>
                    <Col span={10}>
                        <p>
                            Cards Here...
                        </p>
                    </Col>
                </Row>
                <Space>
                    <Row>
                        <Col span={24}>
                            <div></div>
                        </Col>
                    </Row>
                </Space>

                <Row>
                    <Col span={15}></Col>
                    <Col span={4}>
                        <Button type="primary" shape="round" size="large">Show reviews</Button>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" shape="round" size="large">Reserve</Button>
                    </Col>
                    <Col span={1}></Col>
                </Row>
            </Content>
        </Layout>
    );

}
export default Home
