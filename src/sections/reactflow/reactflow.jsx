import './reactflow.css';
import '@xyflow/react/dist/style.css';

import ELK from 'elkjs/lib/elk.bundled';
import React, { useState, useCallback, useLayoutEffect } from 'react';
import {
  Handle,
  MiniMap,
  addEdge,
  Controls,
  ReactFlow,
  MarkerType,
  useReactFlow,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from '@xyflow/react';

import { Box, IconButton, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import FloatingEdge from './floating-edge';
import { createNodesAndEdges } from './utils';
import FloatingConnectionLine from './floating-connection-line';

// Define node colors mapping
const nodeColors = {
  'Google Sheet': '#4285f4',
  Router: '#20B276',
  Mailchimp: '#F8761F',
  MySQL: '#007392',
};

// Dynamic Gradient Definitions Component
const GradientDefinitions = ({ edges, nodes }) => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }}>
    <defs>
      {edges.map((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);

        if (!sourceNode || !targetNode) return null;

        const sourceColor = nodeColors[sourceNode.data.label] || '#4285f4';
        const targetColor = nodeColors[targetNode.data.label] || '#20B276';

        return (
          <linearGradient
            key={edge.id}
            id={`edge-gradient-${edge.id}`}
            gradientUnits="userSpaceOnUse"
            x1={sourceNode.position.x}
            y1={sourceNode.position.y}
            x2={targetNode.position.x}
            y2={targetNode.position.y}
          >
            <stop offset="0%" stopColor={sourceColor} />
            <stop offset="100%" stopColor={targetColor} />
          </linearGradient>
        );
      })}
    </defs>
  </svg>
);

const elk = new ELK();

const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '100',
  'elk.spacing.nodeNode': '200',
  'elk.layered.nodePlacement.strategy': 'SIMPLE',
  'elk.layered.spacing.edgeNodeBetweenLayers': '50',
  'elk.spacing.componentComponent': '80',
};

const CustomNode = ({ data }) => {
  const isHorizontal = data.sourcePosition === 'right';
  
  return (
    <>
      <Handle type="target" position={isHorizontal ? 'left' : 'top'} />
      <Box
        display="flex"
        alignItems="center"
        flexDirection={isHorizontal ? 'column' : 'row'}
        width={isHorizontal ? '150px' : '300px'}
        gap="8px"
      >
        <img
          src={data.icon}
          height="110px"
          width="110px"
          alt="Node"
          style={{ position: 'relative', zIndex: 1 }}
        />
        <Box
          width="100%"
          textAlign={isHorizontal ? 'center' : 'left'}
          sx={{
            position: isHorizontal ? 'absolute' : 'relative',
            bottom: isHorizontal ? '-20px' : 'auto',
            left: isHorizontal ? '50%' : 'auto',
            transform: isHorizontal ? 'translateX(-50%)' : 'none',
          }}
        >
          <Typography fontSize="22px" fontWeight="700" color="#1C252E">
            {data.label}
          </Typography>
          <Typography fontSize="18px" fontWeight="400" color="#556370">
            New Response
          </Typography>
        </Box>
      </Box>
      <Handle type="source" position={isHorizontal ? 'right' : 'bottom'} />
    </>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

const getLayoutedElements = (nodes, edges, options = {}) => {
  const isHorizontal = options?.['elk.direction'] === 'RIGHT';
  const graph = {
    id: 'root',
    layoutOptions: options,
    children: nodes.map((node) => ({
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      data: {
        ...node.data,
        sourcePosition: isHorizontal ? 'right' : 'bottom',
      },
      width: 150,
      height: 150,
    })),
    edges,
  };

  return elk
    .layout(graph)
    .then((layoutedGraph) => ({
      nodes: layoutedGraph.children.map((node) => ({
        ...node,
        position: { x: node.x, y: node.y },
      })),
      edges: layoutedGraph.edges,
    }))
    .catch(console.error);
};

const FlowChartContent = () => {
  const [isVertical, setIsVertical] = useState(true);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const onConnect = useCallback(
    (params) => {
      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);

      if (!sourceNode || !targetNode) return;

      const edgeId = `${params.source}-${params.target}`;

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            id: edgeId,
            type: 'floating',
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: nodeColors[targetNode.data.label],
            },
            style: {
              strokeWidth: 2,
              stroke: `url(#edge-gradient-${edgeId})`,
            },
          },
          eds
        )
      );
    },
    [setEdges, nodes]
  );

  const onLayout = useCallback(
    (direction) => {
      const opts = {
        'elk.direction': direction,
        ...elkOptions,
      };

      getLayoutedElements(nodes, edges, opts).then(
        ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);
          window.requestAnimationFrame(() => fitView());
        }
      );
    },
    [nodes, edges, setNodes, setEdges, fitView]
  );

  const toggleOrientation = useCallback(() => {
    setIsVertical((prev) => {
      const newIsVertical = !prev;
      onLayout(newIsVertical ? 'DOWN' : 'RIGHT');
      return newIsVertical;
    });
  }, [onLayout]);

  useLayoutEffect(() => {
    const { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges();
    setNodes(initialNodes);
    setEdges(
      initialEdges.map((edge) => ({
        ...edge,
        id: `${edge.source}-${edge.target}`,
        style: {
          ...edge.style,
          stroke: `url(#edge-gradient-${edge.source}-${edge.target})`,
        },
      }))
    );

    const opts = {
      'elk.direction': 'DOWN',
      ...elkOptions,
    };

    getLayoutedElements(initialNodes, initialEdges, opts).then(
      ({ nodes: layoutedNodes, edges: layoutedEdges }) => {
        setNodes(layoutedNodes);
        setEdges(
          layoutedEdges.map((edge) => ({
            ...edge,
            id: `${edge.source}-${edge.target}`,
            style: {
              ...edge.style,
              stroke: `url(#edge-gradient-${edge.source}-${edge.target})`,
            },
          }))
        );
        window.requestAnimationFrame(() => fitView());
      }
    );
  }, [setNodes, setEdges, fitView]);

  return (
    <div style={{ height: 800, width: '100%', position: 'relative' }} className="floatingedges">
      <GradientDefinitions edges={edges} nodes={nodes} />

      <Box sx={{ position: 'absolute', left: 12, bottom: 140, zIndex: 1000 }}>
        <IconButton
          onClick={toggleOrientation}
          sx={{
            '&:hover': { bgcolor: '#343B57' },
            boxShadow: 1,
            width: 40,
            height: 40,
            zIndex: 1000,
            border: '2px',
            borderColor: '#343B57',
          }}
        >
          <Iconify
            icon="dashicons:image-rotate-left"
            width={20}
            sx={{
              transform: isVertical ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          />
        </IconButton>
      </Box>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        edgeTypes={edgeTypes}
        connectionLineComponent={FloatingConnectionLine}
      >
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default function FlowChart() {
  return (
    <ReactFlowProvider>
      <FlowChartContent />
    </ReactFlowProvider>
  );
}
