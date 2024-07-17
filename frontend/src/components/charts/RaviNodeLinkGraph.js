import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Viva from 'vivagraphjs';

const RaviNetworkGraph = () => {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const graphContainerRef = useRef(null);
  const graphRef = useRef(null);
  const rendererRef = useRef(null);

  const ITEMS_PER_PAGE = 100;

  useEffect(() => {
    const fetchData = async () => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5031/api/Ravis/ravi-tribe-name?page=${page}&limit=${ITEMS_PER_PAGE}`);
        const newData = response.data;

        if (newData.length === 0) {
          setHasMore(false);
          setIsLoading(false);
          return;
        }

        const newNodes = newData.map((item) => ({
          id: item.narratorName,
          tribe: item.tribe,
          hadithCount: item.HadithCount,
        }));

        setGraphData(prevData => {
          const updatedNodes = [...prevData.nodes, ...newNodes];
          const newEdges = createNewEdges(updatedNodes, prevData.nodes.length);
          return {
            nodes: updatedNodes,
            edges: [...prevData.edges, ...newEdges]
          };
        });

        setPage(prevPage => prevPage + 1);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [page]);

  const createNewEdges = (allNodes, startIndex) => {
    const newEdges = [];
    for (let i = startIndex; i < allNodes.length; i++) {
      for (let j = 0; j < allNodes.length; j++) {
        if (i !== j && allNodes[i].tribe === allNodes[j].tribe) {
          newEdges.push({ from: allNodes[i].id, to: allNodes[j].id });
        }
      }
    }
    return newEdges;
  };

  useEffect(() => {
    Cookies.set('visited', 'true', { expires: 7 });
  }, []);

  useEffect(() => {
    if (graphData.nodes.length > 0 && graphContainerRef.current) {
      if (!graphRef.current) {
        graphRef.current = Viva.Graph.graph();
        
        const graphics = Viva.Graph.View.svgGraphics();
        graphics.node(function(node) {
          // Use a hash of the tribe name to generate a consistent color
          const color = `#${Math.abs(hashCode(node.data.tribe)).toString(16).substr(0, 6)}`;
          return Viva.Graph.svg('circle')
            .attr('r', 5)
            .attr('fill', color);
        }).placeNode(function(nodeUI, pos) {
          nodeUI.attr('cx', pos.x).attr('cy', pos.y);
        });

        rendererRef.current = Viva.Graph.View.renderer(graphRef.current, {
          graphics: graphics,
          container: graphContainerRef.current
        });

        rendererRef.current.run();
      }

      // Add new nodes and edges
      graphData.nodes.forEach(node => {
        if (!graphRef.current.getNode(node.id)) {
          graphRef.current.addNode(node.id, node);
        }
      });

      graphData.edges.forEach(edge => {
        if (!graphRef.current.getLink(edge.from, edge.to)) {
          graphRef.current.addLink(edge.from, edge.to);
        }
      });
    }
  }, [graphData]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Simple hash function for consistent color generation
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };

  return (
    <div>
      <div ref={graphContainerRef} style={{ width: '800px', height: '600px' }}></div>
      <div>
        <h3>Network Graph Statistics</h3>
        <p>Total Narrators: {graphData.nodes.length}</p>
        <p>Total Connections: {graphData.edges.length}</p>
      </div>
      {isLoading && <p>Loading...</p>}
      {hasMore && !isLoading && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
};

export default RaviNetworkGraph;