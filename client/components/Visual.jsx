import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import master_logo from "../asset/redis_logo.svg";
import replica_logo from "../asset/replica_logo.svg";
import client_logo from "../asset/client_logo.svg";

const Visual = () => {
  const svgRef = useRef();
  const sentinel = useSelector((state) => state.slider.sentinelsValue);
  const shard = useSelector((state) => state.slider.shardsValue);
  const replica = useSelector((state) => state.slider.replicasValue);

  useEffect(() => {
    const width = 800;
    const height = 600;
    const shardSize = 30;
    const replicaSize = 20;
    const clientSize = 35; // Define client size
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const shardData = [];
    const replicaData = [];

    for (let i = 0; i < shard; i++) {
      const shardObj = {
        id: `shard-${i}`,
        type: "shard",
      };
      shardData.push(shardObj);
      for (let j = 0; j < replica; j++) {
        const replicaObj = {
          id: `replica-${i}-${j}`,
          type: "replica",
          master: shardObj.id,
        };
        shardObj.replicas = shardObj.replicas || [];
        shardObj.replicas.push(replicaObj);
        replicaData.push(replicaObj);
      }
    }

    const clientData = [{ id: "client-0", type: "client" }]; // Add client data

    const allData = [...clientData, ...shardData, ...replicaData];

    const links = createLinks(shardData);

    const simulation = d3
      .forceSimulation(allData)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collide",
        d3.forceCollide().radius((d) =>
          d.type === "client"
            ? clientSize / 2
            : d.type === "shard"
            ? shardSize / 2
            : replicaSize / 2
        )
      );

    const link = svg
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5);

    const node = svg
      .selectAll("image")
      .data(allData)
      .enter()
      .append("image")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("width", (d) =>
        d.type === "client"
          ? clientSize
          : d.type === "shard"
          ? shardSize
          : replicaSize
      )
      .attr("height", (d) =>
        d.type === "client"
          ? clientSize
          : d.type === "shard"
          ? shardSize
          : replicaSize
      )
      .attr("href", (d) => {
        if (d.type === "client") return client_logo;
        if (d.type === "shard") return master_logo;
        if (d.type === "replica") return replica_logo;
      })
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });

    function createLinks(shardData) {
      const linksArray = [];
      shardData.forEach((shard) => {
        shard.replicas.forEach((replica) => {
          linksArray.push({ source: shard.id, target: replica.id });
        });
        // Link client to each shard
        linksArray.push({ source: "client-0", target: shard.id });
      });
      return linksArray;
    }

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      svg.selectAll("*").remove();
    };
  }, [shard, replica]);

  return <svg ref={svgRef}></svg>;
};

export default Visual;
