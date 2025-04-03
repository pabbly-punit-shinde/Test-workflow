// import { Position, MarkerType } from '@xyflow/react';

// // this helper function returns the intersection point
// // of the line between the center of the intersectionNode and the target node
// function getNodeIntersection(intersectionNode, targetNode) {
//   // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
//   const { width: intersectionNodeWidth, height: intersectionNodeHeight } =
//     intersectionNode.measured;
//   const intersectionNodePosition = intersectionNode.internals.positionAbsolute;
//   const targetPosition = targetNode.internals.positionAbsolute;

//   const w = intersectionNodeWidth / 2;
//   const h = intersectionNodeHeight / 2;

//   const x2 = intersectionNodePosition.x + w;
//   const y2 = intersectionNodePosition.y + h;
//   const x1 = targetPosition.x + targetNode.measured.width / 2;
//   const y1 = targetPosition.y + targetNode.measured.height / 2;

//   const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
//   const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
//   const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
//   const xx3 = a * xx1;
//   const yy3 = a * yy1;
//   const x = w * (xx3 + yy3) + x2;
//   const y = h * (-xx3 + yy3) + y2;

//   return { x, y };
// }

// // returns the position (top,right,bottom or right) passed node compared to the intersection point
// function getEdgePosition(node, intersectionPoint) {
//   const n = { ...node.internals.positionAbsolute, ...node };
//   const nx = Math.round(n.x);
//   const ny = Math.round(n.y);
//   const px = Math.round(intersectionPoint.x);
//   const py = Math.round(intersectionPoint.y);

//   if (px <= nx + 1) {
//     return Position.Left;
//   }
//   if (px >= nx + n.measured.width - 1) {
//     return Position.Right;
//   }
//   if (py <= ny + 1) {
//     return Position.Top;
//   }
//   if (py >= n.y + n.measured.height - 1) {
//     return Position.Bottom;
//   }

//   return Position.Top;
// }

// // returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
// export function getEdgeParams(source, target) {
//   const sourceIntersectionPoint = getNodeIntersection(source, target);
//   const targetIntersectionPoint = getNodeIntersection(target, source);

//   const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
//   const targetPos = getEdgePosition(target, targetIntersectionPoint);

//   return {
//     sx: sourceIntersectionPoint.x,
//     sy: sourceIntersectionPoint.y,
//     tx: targetIntersectionPoint.x,
//     ty: targetIntersectionPoint.y,
//     sourcePos,
//     targetPos,
//   };
// }

// export function createNodesAndEdges() {
//   const nodes = [];
//   const edges = [];
//   const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

//   nodes.push({ id: 'target', data: { label: 'Target' }, position: center });

//   for (let i = 0; i < 8; i += 1) {
//     const degrees = i * (360 / 8);
//     const radians = degrees * (Math.PI / 180);
//     const x = 250 * Math.cos(radians) + center.x;
//     const y = 250 * Math.sin(radians) + center.y;

//     nodes.push({ id: `${i}`, data: { label: 'Source' }, position: { x, y } });

//     edges.push({
//       id: `edge-${i}`,
//       target: 'target',
//       source: `${i}`,
//       type: 'floating',
//       markerEnd: {
//         type: MarkerType.Arrow,
//       },
//     });
//   }

//   return { nodes, edges };
// }


// import React, { useState, useCallback } from 'react';
// import {
//   ReactFlow,
//   Handle,
//   MiniMap,
//   addEdge,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
//   MarkerType,
//   BaseEdge,
//   useStore,
//   getBezierPath,
//   Position,
// } from '@xyflow/react';
// import './reactflow.css';
// import '@xyflow/react/dist/style.css';
// import { Box, Typography } from '@mui/material';

// // Utility functions for edge calculations
// export function getNodeIntersection(intersectionNode, targetNode) {
//   const { width: intersectionNodeWidth, height: intersectionNodeHeight } = intersectionNode.measured;
//   const intersectionNodePosition = intersectionNode.internals.positionAbsolute;
//   const targetPosition = targetNode.internals.positionAbsolute;

//   const w = intersectionNodeWidth / 2;
//   const h = intersectionNodeHeight / 2;

//   const x2 = intersectionNodePosition.x + w;
//   const y2 = intersectionNodePosition.y + h;
//   const x1 = targetPosition.x + targetNode.measured.width / 2;
//   const y1 = targetPosition.y + targetNode.measured.height / 2;

//   const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
//   const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
//   const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
//   const xx3 = a * xx1;
//   const yy3 = a * yy1;
//   const x = w * (xx3 + yy3) + x2;
//   const y = h * (-xx3 + yy3) + y2;

//   return { x, y };
// }

// export function getEdgePosition(node, intersectionPoint) {
//   const n = { ...node.internals.positionAbsolute, ...node };
//   const nx = Math.round(n.x);
//   const ny = Math.round(n.y);
//   const px = Math.round(intersectionPoint.x);
//   const py = Math.round(intersectionPoint.y);

//   if (px <= nx + 1) return Position.Left;
//   if (px >= nx + n.measured.width - 1) return Position.Right;
//   if (py <= ny + 1) return Position.Top;
//   if (py >= n.y + n.measured.height - 1) return Position.Bottom;

//   return Position.Top;
// }

// export function getEdgeParams(source, target) {
//   const sourceIntersectionPoint = getNodeIntersection(source, target);
//   const targetIntersectionPoint = getNodeIntersection(target, source);

//   const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
//   const targetPos = getEdgePosition(target, targetIntersectionPoint);

//   return {
//     sx: sourceIntersectionPoint.x,
//     sy: sourceIntersectionPoint.y,
//     tx: targetIntersectionPoint.x,
//     ty: targetIntersectionPoint.y,
//     sourcePos,
//     targetPos,
//   };
// }

// // Floating Edge Component
// const FloatingEdge = ({ id, source, target, markerEnd, style }) => {
//   const sourceNode = useStore(store => store.nodeInternals.get(source));
//   const targetNode = useStore(store => store.nodeInternals.get(target));

//   if (!sourceNode || !targetNode) {
//     return null;
//   }

//   const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);
//   const [edgePath] = getBezierPath({
//     sourceX: sx,
//     sourceY: sy,
//     targetX: tx,
//     targetY: ty,
//   });

//   return <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />;
// };

// // Custom Node Component
// const CustomNode = ({ data }) => (
//   <Box
//     sx={{
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       border: '1px solid #ccc',
//       borderRadius: '5px',
//       padding: '10px',
//       backgroundColor: '#f9f9f9',
//       position: 'relative',
//       boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//       width: '150px',
//       height: '100px',
//     }}
//   >
//     <img src={data.icon} alt="Node Icon" width="40px" height="40px" style={{ marginBottom: '5px' }} />
//     <Typography variant="h6" align="center" sx={{ marginTop: '5px' }}>
//       {data.label}
//     </Typography>
//     <Handle type="source" position="bottom" style={{ opacity: 0 }} />
//     <Handle type="target" position="top" style={{ opacity: 0 }} />
//   </Box>
// );

// // Create initial nodes and edges
// export function createNodesAndEdges() {
//   const nodes = [
//     {
//       id: '1',
//       position: { x: 250, y: 100 },
//       data: { label: 'Jotform', icon: '/assets/images/reactflow/Logo.png' },
//       type: 'custom',
//     },
//     {
//       id: '2',
//       position: { x: 250, y: 300 },
//       data: { label: 'Google Sheet', icon: '/assets/images/reactflow/SheetLogo.svg' },
//       type: 'custom',
//     },
//     {
//       id: '3',
//       position: { x: 250, y: 500 },
//       data: { label: 'Router', icon: '/assets/images/reactflow/Router.svg' },
//       type: 'custom',
//     },
//     {
//       id: '4',
//       position: { x: 500, y: 700 },
//       data: { label: 'Mailchimp', icon: '/assets/images/reactflow/MailchimpLogo.svg' },
//       type: 'custom',
//     },
//     {
//       id: '5',
//       position: { x: 0, y: 700 },
//       data: { label: 'Mailchimp', icon: '/assets/images/reactflow/MailchimpLogo.svg' },
//       type: 'custom',
//     },
//   ];

//   const edges = [
//     {
//       id: 'e1-2',
//       source: '1',
//       target: '2',
//       type: 'floating',
//       animated: true,
//       markerEnd: {
//         type: MarkerType.ArrowClosed,
//         width: 20,
//         height: 20,
//         color: '#007bff',
//       },
//       style: {
//         strokeWidth: 2,
//         stroke: '#007bff',
    
//       },
//     },
//     {
//       id: 'e2-3',
//       source: '2',
//       target: '3',
//       type: 'floating',
//       animated: true,
//       markerEnd: {
//         type: MarkerType.ArrowClosed,
//         width: 20,
//         height: 20,
//         color: '#007bff',
//       },
//       style: {
//         strokeWidth: 2,
//         stroke: '#007bff',
//       },
//     },
//     {
//       id: 'e3-4',
//       source: '3',
//       target: '4',
//       type: 'floating',
//       animated: true,
//       markerEnd: {
//         type: MarkerType.ArrowClosed,
//         width: 20,
//         height: 20,
//         color: '#007bff',
//       },
//       style: {
//         strokeWidth: 2,
//         stroke: '#007bff',
//       },
//     },
//     {
//       id: 'e3-5',
//       source: '3',
//       target: '5',
//       type: 'floating',
//       animated: true,
//       markerEnd: {
//         type: MarkerType.ArrowClosed,
//         width: 20,
//         height: 20,
//         color: '#007bff',
//       },
//       style: {
//         strokeWidth: 2,
//         stroke: '#007bff',
//       },
//     },
//   ];

//   return { nodes, edges };
// }

// // Main FlowChart component
// const FlowChart = () => {
//   const { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges();
//   const [nodes, , onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

//   const onConnect = useCallback(
//     (params) =>
//       setEdges((eds) =>
//         addEdge(
//           {
//             ...params,
//             type: 'floating',
//             markerEnd: { type: MarkerType.Arrow },
//           },
//           eds,
//         ),
//       ),
//     [setEdges],
//   );

//   return (
//     <div style={{ height: 800, width: '100%' }} className="floatingedges">
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         fitView
//         fitViewOptions={{ padding: 0.2 }}
//         nodeTypes={{ custom: CustomNode }}
//         edgeTypes={{ floating: FloatingEdge }}
//       >
//         <MiniMap />
//         <Controls />
//         <Background variant="dots" gap={12} size={1} />
//       </ReactFlow>
//     </div>
//   );
// };

// export default FlowChart;


import './reactflow.css';

import React from 'react';
import {
  Handle,
  BaseEdge,
  useStore,
  Position,
  MarkerType,
  getBezierPath,
} from '@xyflow/react';

import { Box, Typography } from '@mui/material';

// Node intersection and edge position calculation functions remain the same
export function getNodeIntersection(intersectionNode, targetNode) {
  const imageWidth = 110;
  const imageHeight = 110;
  
  const intersectionNodePosition = intersectionNode.internals.positionAbsolute;
  const targetPosition = targetNode.internals.positionAbsolute;

  const sourceX = intersectionNodePosition.x + imageWidth / 2;
  const sourceY = intersectionNodePosition.y + imageHeight / 2;
  const targetX = targetPosition.x + imageWidth / 2;
  const targetY = targetPosition.y + imageHeight / 2;

  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const angle = Math.atan2(dy, dx);

  const radius = imageWidth / 2;
  const x = sourceX + Math.cos(angle) * radius;
  const y = sourceY + Math.sin(angle) * radius;

  return { x, y };
}

export function getEdgePosition(node, intersectionPoint) {
  const imageWidth = 110;
  const imageHeight = 110;
  const centerX = node.internals.positionAbsolute.x + imageWidth / 2;
  const centerY = node.internals.positionAbsolute.y + imageHeight / 2;
  
  const dx = intersectionPoint.x - centerX;
  const dy = intersectionPoint.y - centerY;
  const angle = Math.atan2(dy, dx);

  const degrees = ((angle * 180) / Math.PI + 360) % 360;
  
  if (degrees >= 315 || degrees < 45) return Position.Right;
  if (degrees >= 45 && degrees < 135) return Position.Bottom;
  if (degrees >= 135 && degrees < 225) return Position.Left;
  return Position.Top;
}

export function getEdgeParams(source, target) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}

// Updated gradient definitions to match node colors
const GradientDefinitions = () => (
  <defs>
    {/* Jotform to Google Sheets */}
    <linearGradient id="edge-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#0A1551" />
      <stop offset="100%" stopColor="#4285f4" />
    </linearGradient>
    {/* Google Sheets to Router */}
    <linearGradient id="edge-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#4285f4" />
      <stop offset="100%" stopColor="#20b276" />
    </linearGradient>
    {/* Router to Hubspot */}
    <linearGradient id="edge-gradient-3" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#20b276" />
      <stop offset="100%" stopColor="#F8761F" />
    </linearGradient>
    {/* Router to MySQL */}
    <linearGradient id="edge-gradient-4" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#20b276" />
      <stop offset="100%" stopColor="#007392" />
    </linearGradient>
  </defs>
);

const FloatingEdge = ({ id, source, target, markerEnd, style }) => {
  const sourceNode = useStore(store => store.nodeInternals.get(source));
  const targetNode = useStore(store => store.nodeInternals.get(target));

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);
  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  const gradientUrl = style?.stroke || 'url(#edge-gradient-1)';

  return (
    <>
      <GradientDefinitions />
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{ ...style, stroke: gradientUrl }} 
      />
    </>
  );
};

const CustomNode = ({ data }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      width: '150px',
      height: '150px',
    }}
  >
    <Box
      sx={{
        position: 'relative',
        width: '110px',
        height: '110px',
      }}
    >
      <img 
        src={data.icon} 
        alt="Node Icon" 
        style={{
          width: '110px',
          height: '110px',
          position: 'relative',
          zIndex: 1
        }} 
      />
      <Handle 
        type="source" 
        position="bottom" 
        style={{ 
          bottom: '0px',
          opacity: 1,
          zIndex: 2,
          width: '16px',
          height: '16px',
          background: 'transparent',
          border: 'none'
        }}
      />
      <Handle 
        type="target" 
        position="top" 
        style={{ 
          top: '0px',
          opacity: 1,
          zIndex: 2,
          width: '16px',
          height: '16px',
          background: 'transparent',
          border: 'none'
        }}
      />
    </Box>
    <Typography variant="h6" align="center" sx={{ marginTop: '5px' }}>
      {data.label}
    </Typography>
  </Box>
);

export function createNodesAndEdges(isHorizontal = false) {
  const nodes = [
    {
      id: '1',
      position: { x: 250, y: 100 },
      data: { 
        label: 'Jotform', 
        icon: '/assets/images/reactflow/Jotform Logo.svg'
      },
      type: 'custom',
    },
    {
      id: '2',
      position: { x: 250, y: 300 },
      data: { 
        label: 'Google Sheet', 
        icon: '/assets/images/reactflow/Sheet Logo.svg',
        sourcePosition: isHorizontal ? 'right' : 'bottom',
      },
      type: 'custom',
    },
    {
      id: '3',
      position: { x: 250, y: 500 },
      data: { 
        label: 'Router', 
        icon: '/assets/images/reactflow/Router Logo.svg',
        sourcePosition: isHorizontal ? 'right' : 'bottom',
      },
      type: 'custom',
    },
    {
      id: '4',
      position: { x: 500, y: 700 },
      data: { 
        label: 'Hubspot', 
        icon: '/assets/images/reactflow/Hubsot Logo.svg',
        sourcePosition: isHorizontal ? 'right' : 'bottom',
      },
      type: 'custom',
    },
    {
      id: '5',
      position: { x: 0, y: 700 },
      data: { 
        label: 'MySql', 
        icon: '/assets/images/reactflow/Mysql Logo.svg',
        sourcePosition: isHorizontal ? 'right' : 'bottom',
      },
      type: 'custom',
    },
  ];

  const edges = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      type: 'floating',
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#4285f4',
      },
      style: {
        strokeWidth: 2,
        stroke: 'url(#edge-gradient-1)',
      },
    },
    {
      id: 'e2-3',
      source: '2',
      target: '3',
      type: 'floating',
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#20b276',
      },
      style: {
        strokeWidth: 2,
        stroke: 'url(#edge-gradient-2)',
      },
    },
    {
      id: 'e3-4',
      source: '3',
      target: '4',
      type: 'floating',
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#F8761F',
      },
      style: {
        strokeWidth: 2,
        stroke: 'url(#edge-gradient-3)',
      },
    },
    {
      id: 'e3-5',
      source: '3',
      target: '5',
      type: 'floating',
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#007392',
      },
      style: {
        strokeWidth: 2,
        stroke: 'url(#edge-gradient-4)',
      },
    },
  ];

  return { nodes, edges };
}

export function getVerticalLayout(nodes) {
  return nodes.map((node, index) => {
    const yOffset = 100;
    return {
      ...node,
      position: {
        x: -300,
        y: 350 + index * yOffset,
      },
    };
  });
}

export function getHorizontalLayout(nodes) {
  return nodes.map((node, index) => {
    const xOffset = 100;
    return {
      ...node,
      position: {
        x: -300 + index * xOffset,
        y: 350,
      },
    };
  });
}

export function FloatingConnectionLine({ fromX, fromY, toX, toY, connectionLineStyle }) {
  return (
    <g>
      <GradientDefinitions />
      <path
        fill="none"
        stroke="url(#edge-gradient-1)"
        strokeWidth={2}
        className="animated"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
        style={connectionLineStyle}
      />
      <circle cx={toX} cy={toY} fill="#1F1F38" r={5} stroke="#fff" strokeWidth={1.5} />
    </g>
  );
}

export default FloatingEdge;