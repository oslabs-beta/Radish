import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import master_logo from "../asset/redis_logo.svg";
import replica_logo from "../asset/redis_logo.svg";
//import redis_logo from "../asset/redis_logo.svg";
import sentinel_logo from "../asset/sentinel.svg";

const Visualization = () => {
  const svgRef = useRef();
  const sentinel = useSelector((state) => state.sentinelsValue);
  const shard = useSelector((state) => state.shardsValue);
  const replica = useSelector((state) => state.replicasValue);

  useEffect(() => {
    const width = 800;
    const height = 600;
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const data = [];

    for (let i = 0; i < sentinel; i++) {
      data.push({
        type: "sentinel",
        x: Math.random() * width,
        y: Math.random() * height,
      });
    }

    for (let i = 0; i < shard; i++) {
      data.push({
        type: "shard",
        x: Math.random() * width,
        y: Math.random() * height,
      });
    }
    for (let i = 0; i < replica; i++) {
      data.push({
        type: "replica",
        x: Math.random() * width,
        y: Math.random() * height,
      });
    }

    const images = svg
      .selectAll("image")
      .data(data, (d) => `${d.type}-${d.x}-${d.y}`);

    images
      .enter()
      .append("image")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("width", 20)
      .attr("height", 20)
      .attr("href", (d) => {
        if (d.type === "sentinel") return sentinel_logo;
        if (d.type === "shard") return master_logo;
        if (d.type === "replica") return replica_logo;
      });
    images.exit().remove();

    return () => {
      <svg ref={svgRef}></svg>;
    };
  }, [sentinel, shard, replica]);
  return <svg ref={svgRef}></svg>;
};

export default Visualization;
