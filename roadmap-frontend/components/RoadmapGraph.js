import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box, Paper } from '@mui/material';
import { getCategoryProperties } from '../lib/roadmapUtils';

const RoadmapGraph = ({ 
  graph, 
  selectedPath = [], 
  highlightPath = true, 
  onNodeClick,
  width = 960, 
  height = 600 
}) => {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!graph || Object.keys(graph).length === 0) return;
    
    // Clear previous SVG content
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Convert graph to D3 compatible format
    const nodes = Object.values(graph).map(block => ({
      id: block.id,
      title: block.title,
      category: block.category,
      time: block.average_time,
      cost: block.cost,
      inPath: selectedPath.includes(block.id)
    }));
    
    const links = [];
    Object.values(graph).forEach(block => {
      block.forward_connections.forEach(targetId => {
        links.push({
          source: block.id,
          target: targetId,
          inPath: selectedPath.includes(block.id) && selectedPath.includes(targetId) &&
            Math.abs(selectedPath.indexOf(block.id) - selectedPath.indexOf(targetId)) === 1
        });
      });
    });
    
    // Create a hierarchical layout
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX())
      .force('y', d3.forceY());
    
    // Create SVG element
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);
    
    // Define arrow markers for the links
    svg.append('defs').selectAll('marker')
      .data(['normal', 'highlighted'])
      .enter().append('marker')
      .attr('id', d => d)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', d => d === 'highlighted' ? '#ff9800' : '#999')
      .attr('d', 'M0,-5L10,0L0,5');
    
    // Add links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', d => d.inPath && highlightPath ? '#ff9800' : '#999')
      .attr('stroke-opacity', d => d.inPath && highlightPath ? 0.8 : 0.5)
      .attr('stroke-width', d => d.inPath && highlightPath ? 3 : 1)
      .attr('marker-end', d => `url(#${d.inPath && highlightPath ? 'highlighted' : 'normal'})`);
    
    // Add nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', (event, d) => onNodeClick && onNodeClick(d.id))
      .attr('cursor', 'pointer');
    
    // Add circle for each node
    node.append('circle')
      .attr('r', 15)
      .attr('fill', d => {
        const { color } = getCategoryProperties(d.category);
        return d.inPath && highlightPath ? '#ff9800' : color;
      })
      .attr('stroke', d => d.inPath && highlightPath ? '#ff9800' : '#fff')
      .attr('stroke-width', d => d.inPath && highlightPath ? 3 : 1);
    
    // Add text to each node
    node.append('text')
      .attr('dx', 20)
      .attr('dy', 5)
      .text(d => d.title)
      .attr('font-size', '10px')
      .attr('fill', d => d.inPath && highlightPath ? '#ff9800' : '#333');
    
    // Simulation update
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
    
    // Zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        svg.selectAll('g').attr('transform', event.transform);
      });
    
    svg.call(zoom);
    
    // Drag functions
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
    
  }, [graph, selectedPath, highlightPath, width, height, onNodeClick]);
  
  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%', overflow: 'hidden' }}>
      <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <svg ref={svgRef} width={width} height={height} />
      </Box>
    </Paper>
  );
};

export default RoadmapGraph; 