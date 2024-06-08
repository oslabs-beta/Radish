import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import master_logo from "../asset/redis_logo.svg";
import replica_logo from "../asset/replica_logo.svg";



const Visualization = () => {
  const svgRef = useRef();
  const sentinel = useSelector((state) => state.sentinelsValue);
  const shard = useSelector((state) => state.shardsValue);
  const replica = useSelector((state) => state.replicasValue);

  useEffect(() => {
    const width = 800;
    const height = 600;
    const margin = 50;
    const shardSize = 30;
    const replicaSize = 20;
    const sentinelSize = 25;
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const shardData = [];
    const replicaData = [];
    const sentinelData = [];

    const totalWidthNeeded = (shard * shardSize) + (shard * replica * replicaSize);

    const horizontalGap = (width - totalWidthNeeded) / (shard + 1);

    // for (let i = 0; i < sentinel; i++) {
    //   sentinelData.push({
    //     id: `{sentinel-${i}}`,
    //     type: "sentinel",
    //     x: Math.random() * (width - 2 * margin) + margin,
    //     y: Math.random() * (height - 2 * margin) + margin,
    //   });
    // }

    for (let i = 0; i < shard; i++) {
      shardData.push({
        id: `{shard-${i}}`,
        type: "shard",
        x: (i + 1) * horizontalGap + i * shardSize,
        y: height / 2 - shardSize / 2,
      });
    }
    shardData.forEach((shard, i) => {
      const offset = shardSize + 10;
      for (let j = 0; j < replica; j++) {
        replicaData.push({
            id: `replica-${i}-${j}`,
            type: "replica",
            x: shard.x + j * replicaSize,
            y: shard.y + offset,
          });
      }
    });

    const allData = [...shardData, ...replicaData];

    

    const images = svg
      .selectAll("image")
      .data(allData)
      .enter()
      .append("image")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("width", (d) =>
        d.type === "shard"
          ? shardSize
          : d.type === "replica"
          ? replicaSize
          : sentinelSize
      )
      .attr("height", (d) =>
        d.type === "shard"
          ? shardSize
          : d.type === "replica"
          ? replicaSize
          : sentinelSize
      )
      .attr("href", (d) => {
        if (d.type === "shard") return master_logo;
        if (d.type === "replica") return replica_logo;
        // return sentinel_logo;
      });

    return () => {
      svg.selectAll("*").remove();
    };
  }, [shard, replica]);
  return <svg ref={svgRef}></svg>;
};

export default Visualization;
