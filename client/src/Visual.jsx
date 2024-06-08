import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import master_logo from "../asset/redis_logo.svg";
import replica_logo from "../asset/replica_logo.svg";

const Visual = () => {
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

    const totalWidthNeeded = shard * shardSize + shard * replica * replicaSize;

    const horizontalGap = (width - totalWidthNeeded) / (shard + 1);

    for (let i = 0; i < shard; i++) {
      const shardObj = {
        id: `shard-${i}`,
        type: "shard",
        x: (i + 1) * horizontalGap + i * shardSize,
        y: height / 2 - shardSize / 2,
        replicas: [],
      };
      shardData.push(shardObj);
      const offset = shardSize + 10;
      for (let j = 0; j < replica; j++) {
        const replicaObj = {
          id: `replica-${i}-${j}`,
          type: "replica",
          x: shardObj.x + j * replicaSize,
          y: shardObj.y + offset,
        };
        shardObj.replicas.push(replicaObj);
        replicaData.push(replicaObj);
      }
    }

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
      })
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    function dragstarted(event, d) {
      //if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
      d.x = event.x;
      d.y = event.y;
      d3.select(this).attr("x", event.x).attr("y", event.y);
    }

    function dragended(event, d) {
      //if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // const simulation = d3
    //   .forceSimulation(allData)
    //   .force(
    //     "collide",
    //     d3
    //       .forceCollide()
    //       .radius((d) => (d.type === "shard" ? shardSize : replicaSize / 2))
    //   )
    //   .force("charge", d3.forceManyBody().strength(-200))
    //   .force(
    //     "link",
    //     d3
    //       .forceLink()
    //       .id((d) => d.id)
    //       .links(createLinks())
    //   )
    //   .force("center", d3.forceCenter(width / 2, height / 2));

    // simulation.on("tick", () => {
    //   images.attr("x", (d) => d.x).attr("y", (d) => d.y);
    // });

    function createLinks() {
      const linksArray = [];
      shardData.forEach((shard) => {
        shard.replicas.forEach((replica) => {
          linksArray.push({ source: replica, target: shard });
        });
      });
      return linksArray;
    }

    return () => {
      svg.selectAll("*").remove();
    };
  }, [shard, replica]);

  return <svg ref={svgRef}></svg>;
};

export default Visual;
