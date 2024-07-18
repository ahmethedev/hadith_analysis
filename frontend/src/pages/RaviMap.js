import React, { useRef, useEffect } from 'react';
import Viva from 'vivagraphjs';

const RaviMap = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const graph = Viva.Graph.graph();
        graph.addNode('anvaka', { url: 'https://secure.gravatar.com/avatar/91bad8ceeec43ae303790f8fe238164b' });
        graph.addNode('manunt', { url: 'https://secure.gravatar.com/avatar/c81bfc2cf23958504617dd4fada3afa8' });
        graph.addNode('thlorenz', { url: 'https://secure.gravatar.com/avatar/1c9054d6242bffd5fd25ec652a2b79cc' });
        graph.addNode('bling', { url: 'https://secure.gravatar.com/avatar/24a5b6e62e9a486743a71e0a0a4f71af' });
        graph.addNode('diyan', { url: 'https://secure.gravatar.com/avatar/01bce7702975191fdc402565bd1045a8?' });
        graph.addNode('pocheptsov', { url: 'https://secure.gravatar.com/avatar/13da974fc9716b42f5d62e3c8056c718' });
        graph.addNode('dimapasko', { url: 'https://secure.gravatar.com/avatar/8e587a4232502a9f1ca14e2810e3c3dd' });

        graph.addLink('anvaka', 'manunt');
        graph.addLink('anvaka', 'thlorenz');
        graph.addLink('anvaka', 'bling');
        graph.addLink('anvaka', 'diyan');
        graph.addLink('anvaka', 'pocheptsov');
        graph.addLink('anvaka', 'dimapasko');

        const graphics = Viva.Graph.View.svgGraphics();
        graphics.node(function(node) {
            // The function is called every time renderer needs a ui to display node
            return Viva.Graph.svg('image')
                  .attr('width', 24)
                  .attr('height', 24)
                  .link(node.data.url); // node.data holds custom object passed to graph.addNode();
         })
         .placeNode(function(nodeUI, pos){
             // Shift image to let links go to the center:
             nodeUI.attr('x', pos.x - 12).attr('y', pos.y - 12);
         });
        const renderer = Viva.Graph.View.renderer(graph, {
            container: containerRef.current,
            graphics,
        });

        renderer.run();

        return () => {
            renderer.dispose();
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default RaviMap;
