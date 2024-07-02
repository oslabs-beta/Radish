import React, { useRef, useEffect, ReactElement } from "react";
import * as d3 from "d3";
import { SimulationNodeDatum, D3DragEvent  } from "d3";
import { useSelector } from "react-redux";
import master_logo from "../asset/redis_logo.svg";
import replica_logo from "../asset/replica_logo.svg";
import client_logo from "../asset/client_logo.svg";
import { useAppSelector } from "../Redux/store";

interface replicaObj extends SimulationNodeDatum{
  id: string,
  type: string,
  master: string,
}

interface shardObj {
  id: string,
  type: string,
  replicas: replicaObj[],
  x?: number,
  y?: number

}

interface nodeObj extends SimulationNodeDatum{
  id: string,
  type: string,
  master?: string,
  replicas?: replicaObj[],

}

interface test {
  index?: number
  id: string;
  type: string;
}



const Visual: React.FC = (): ReactElement => {
  const svgRef = useRef();
  const sentinel: number = useAppSelector((state) => state.slider.sentinelsValue);
  const shard: number = useAppSelector((state) => state.slider.shardsValue);
  const replica: number = useAppSelector((state) => state.slider.replicasValue);

  useEffect(() => {
    const width: number = 800;
    const height: number = 600;
    const shardSize: number = 30;
    const replicaSize: number = 20;
    const clientSize: number = 35; // Define client size
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const shardData: shardObj[] = [];
    const replicaData: replicaObj[] = [];

    for (let i: number = 0; i < shard; i++) {
      const shardObj: shardObj = {
        id: `shard-${i}`,
        type: "shard",
        replicas: [], 
      };
      shardData.push(shardObj);
      for (let j = 0; j < replica; j++) {
        const replicaObj: replicaObj = {
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
      .forceSimulation<nodeObj>(allData) // THIS NEEDS TO BE FIXED!!!! test is just a placeholder for now
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id) // any
          .distance(100)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collide",
        d3.forceCollide<nodeObj>().radius((d) =>
          d.type === "client"
            ? clientSize / 2
            : d.type === "shard"
            ? shardSize / 2
            : replicaSize / 2
        )
      );

      const dragstarted = (event: D3DragEvent<SVGAElement, nodeObj, nodeObj>, d: nodeObj): void => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
  
      const dragged = (event: any, d: nodeObj) => {
        d.fx = event.x;
        d.fy = event.y;
      }
  
      const dragended = (event: any, d: nodeObj) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

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
      .attr("x", (d: any) => d.x) // any
      .attr("y", (d: any) => d.y) // any
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
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("x", (d: any) => d.x).attr("y", (d: any) => d.y);
    });

    function createLinks(shardData: shardObj[]) {
      const linksArray: {source: string, target: string}[] = [];
      shardData.forEach((shard) => {
        shard.replicas.forEach((replica) => {
          linksArray.push({ source: shard.id, target: replica.id });
        });
        // Link client to each shard
        linksArray.push({ source: "client-0", target: shard.id });
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
