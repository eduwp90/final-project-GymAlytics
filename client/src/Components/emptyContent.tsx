import React from "react";
import { Empty } from "antd";
import "./components.less";

const EmptyContent = () => {
  return (
    <div className="center_div">
      <Empty
        image={"https://img.icons8.com/ios-filled/100/000000/relax.png"}
        imageStyle={{
          filter: "invert(80%)",
          width: "75px",
          height: "75px",
          display: "flex",
          justifyContent: "center",
          marginLeft: "77.5px"
        }}
        description={"You haven't created any workouts yet"}
      />
    </div>
  );
};

export default EmptyContent;
