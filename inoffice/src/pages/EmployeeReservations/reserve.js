// function thisisaplaceholder(){
//   return (
//     <div>
//       {" "}
//       {loadingData && <Spin indicator={antIcon} />}
//       {!loadingData && (
//         <div>

//           <Row style={{ display: "flex", justifyContent: "space-between" }}>
//             <Col span={2}></Col>
//             <Col span={4}>Date</Col>
//             <Col span={5}></Col>
//             <Col span={4}>
//               <label>Entity</label>
//             </Col>
//             <Col span={7}></Col>
//             <Col span={2} style={{ right: "5%" }}>
//               Options
//             </Col>
//           </Row>
//           <Space>
//             <Row>
//               <Col span={24}>
//                 <div></div>
//               </Col>
//             </Row>
//           </Space>
//           <List
//             dataSource={futurereservations}
//             renderItem={(item, index) => (
//               <List.Item>
//                 <Layout>
//                   <Row
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       width: "100%",
//                     }}
//                   >
//                     <Col span={6}>
//                       <p>
//                         {item.startDate
//                           .split("T")[0]
//                           .split("-")
//                           .reverse()
//                           .join("/")}{" "}
//                         -{" "}
//                         {item.endDate
//                           .split("T")[0]
//                           .split("-")
//                           .reverse()
//                           .join("/")}
//                       </p>
//                     </Col>

//                     <Col span={5}>
//                       {item.deskId ? "Desk" : "Conference room"} [
//                       {item.deskId ? item.deskIndex : item.confRoomIndex}]
//                     </Col>
//                     <Col span={3}>
//                       <Button
//                         onClick={() => deleteNotification(item.id)}
//                         style={{
//                           left: "-15px",
//                           color: "teal",
//                           fontWeight: "bold",
//                           borderRadius: "7px",
//                         }}
//                       >
//                         Cancel
//                       </Button>
//                     </Col>
//                   </Row>
//                 </Layout>
//               </List.Item>
//             )}
//           />
//         </div>
//       )}{" "}
//     </div>
//   );
// }
