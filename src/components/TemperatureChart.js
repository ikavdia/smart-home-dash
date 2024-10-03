import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const TemperatureChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data && data.length > 0) {
      const svg = d3.select(svgRef.current);
      const width = 300;
      const height = 200;
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };

      const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.time))
        .range([margin.left, width - margin.right]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.temperature)])
        .nice()
        .range([height - margin.bottom, margin.top]);

      const line = d3.line()
        .x(d => x(d.time))
        .y(d => y(d.temperature));

      svg.selectAll("*").remove(); // Clear previous chart

      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);
    }
  }, [data]);

  return <svg ref={svgRef} width="100%" height="200"></svg>;
};

export default TemperatureChart;