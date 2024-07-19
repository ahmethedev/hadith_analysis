import React, { useState, useEffect } from 'react';
import Viva from 'vivagraphjs';
import axios from 'axios';

const RaviMap = () => {
    const [tribes, setTribes] = useState([]);
    const [selectedTribe, setSelectedTribe] = useState('');
    const [ravis, setRavis] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTribes = async () => {
            try {
                const response = await axios.get('http://localhost:5031/api/Ravis/tribes');
                setTribes(response.data);
            } catch (error) {
                console.error('Error fetching tribes:', error);
            }
        };

        fetchTribes();
    }, []);

    useEffect(() => {
        if (!selectedTribe) return;

        const fetchRavisByTribe = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5031/api/Ravis/by-tribe?tribe=${encodeURIComponent(selectedTribe)}`);
                setRavis(response.data);
            } catch (error) {
                console.error('Error fetching ravis:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRavisByTribe();
    }, [selectedTribe]);

    useEffect(() => {
        if (ravis.length === 0) return;

        // Remove existing graph container
        const oldContainer = document.getElementById('graphContainer');
        if (oldContainer) {
            oldContainer.remove();
        }

        // Create new graph container
        const newContainer = document.createElement('div');
        newContainer.id = 'graphContainer';
        newContainer.style.width = '100vw';
        newContainer.style.height = '100vh';
        document.body.appendChild(newContainer);

        const graph = Viva.Graph.graph();

        // Create nodes for each ravi
        ravis.forEach(ravi => {
            graph.addNode(ravi.ravi_id.toString(), { name: ravi.narrator_name });
        });

        // Create links between all ravis in the tribe
        for (let i = 0; i < ravis.length; i++) {
            for (let j = i + 1; j < ravis.length; j++) {
                graph.addLink(ravis[i].ravi_id.toString(), ravis[j].ravi_id.toString());
            }
        }

        const graphics = Viva.Graph.View.svgGraphics();

        graphics.node((node) => {
            const ui = Viva.Graph.svg('g');
            const circle = Viva.Graph.svg('circle')
                .attr('r', 20)
                .attr('fill', '#00a2e8');
            ui.append(circle);

            const text = Viva.Graph.svg('text')
                .text(node.data.name)
                .attr('font-size', '10px')
                .attr('fill', 'black')
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle');
            ui.append(text);

            return ui;
        }).placeNode((nodeUI, pos) => {
            nodeUI.attr('transform', `translate(${pos.x}, ${pos.y})`);
        });

        graphics.link(() => {
            return Viva.Graph.svg('line')
                .attr('stroke', '#999')
                .attr('stroke-width', 1);
        });

        const layout = Viva.Graph.Layout.forceDirected(graph, {
            springLength: 200,
            springCoeff: 0.0005,
            dragCoeff: 0.02,
            gravity: -1.2
        });

        const renderer = Viva.Graph.View.renderer(graph, {
            container: newContainer,
            graphics: graphics,
            layout: layout
        });

        renderer.run();

        return () => {
            renderer.dispose();
        };
    }, [ravis]);

    const handleTribeChange = (event) => {
        setSelectedTribe(event.target.value);
    };

    return (
        <div>
            <select value={selectedTribe} onChange={handleTribeChange}>
                <option value="">Select a tribe</option>
                {tribes.map(tribe => (
                    <option key={tribe} value={tribe}>{tribe}</option>
                ))}
            </select>
            {loading && <div>Loading...</div>}
        </div>
    );
};

export default RaviMap;