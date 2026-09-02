/**
 * VASPTrace - Hardware-Accelerated Interactive Animated Graph Visualizer
 * Canvas-based multi-hop blockchain pathfinder with particle flow animation, radar pulse, & touch support
 */

export class VASPTraceGraph {
  constructor(canvas, container, callbacks = {}) {
    this.canvas = canvas;
    this.container = container;
    this.ctx = this.canvas.getContext('2d');
    this.callbacks = callbacks;

    this.nodes = [];
    this.edges = [];
    this.particles = [];
    this.selectedNode = null;
    this.hoveredNode = null;

    // Viewport transform
    this.scale = 1.0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.isDragging = false;
    this.draggedNode = null;
    this.lastMousePos = { x: 0, y: 0 };
    this.initialPinchDist = null;

    // Animation & Real-Time Radar State
    this.animationProgress = 1.0;
    this.maxHopsToDisplay = 99;
    this.animFrameId = null;
    this.radarAngle = 0;
    this.radarPulseRadius = 0;

    this.initEvents();
    this.resize();
    this.startLoop();
  }

  resize() {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.max(rect.width, 300) * dpr;
    this.canvas.height = Math.max(rect.height, 300) * dpr;
    this.canvas.style.width = `${Math.max(rect.width, 300)}px`;
    this.canvas.style.height = `${Math.max(rect.height, 300)}px`;
    this.ctx.scale(dpr, dpr);
    this.width = Math.max(rect.width, 300);
    this.height = Math.max(rect.height, 300);
    this.draw();
  }

  setData(scenarioData, animate = true) {
    this.nodes = JSON.parse(JSON.stringify(scenarioData.nodes));
    this.edges = JSON.parse(JSON.stringify(scenarioData.edges));
    this.selectedNode = null;
    this.hoveredNode = null;
    this.particles = [];

    this.centerGraph();

    if (animate) {
      this.animateHopExpansion();
    } else {
      this.animationProgress = 1.0;
      this.maxHopsToDisplay = 99;
      this.initParticles();
    }
  }

  centerGraph() {
    if (this.nodes.length === 0) return;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    this.nodes.forEach(n => {
      if (n.x < minX) minX = n.x;
      if (n.x > maxX) maxX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.y > maxY) maxY = n.y;
    });

    const graphWidth = maxX - minX || 100;
    const graphHeight = maxY - minY || 100;
    const graphCenterX = (minX + maxX) / 2;
    const graphCenterY = (minY + maxY) / 2;

    const availableWidth = this.width - 60;
    const availableHeight = this.height - 60;
    const fitScale = Math.min(1.2, Math.max(0.4, Math.min(availableWidth / (graphWidth + 80), availableHeight / (graphHeight + 80))));

    this.scale = fitScale;
    this.offsetX = (this.width / 2) - (graphCenterX * this.scale);
    this.offsetY = (this.height / 2) - (graphCenterY * this.scale);
  }

  animateHopExpansion() {
    this.animationProgress = 0;
    this.maxHopsToDisplay = 0;
    this.particles = [];
    const maxHop = Math.max(...this.edges.map(e => e.hop || 1), 1);
    
    let currentHop = 1;
    const interval = setInterval(() => {
      this.maxHopsToDisplay = currentHop;
      this.initParticles();
      if (this.callbacks.onHopExpanded) {
        this.callbacks.onHopExpanded(currentHop, maxHop);
      }
      currentHop++;
      if (currentHop > maxHop) {
        clearInterval(interval);
        this.maxHopsToDisplay = 99;
      }
    }, 600);
  }

  initParticles() {
    this.particles = [];
    const visibleEdges = this.edges.filter(e => (e.hop || 1) <= this.maxHopsToDisplay);
    visibleEdges.forEach(edge => {
      const fromNode = this.nodes.find(n => n.id === edge.from);
      const toNode = this.nodes.find(n => n.id === edge.to);
      if (fromNode && toNode) {
        for (let i = 0; i < 4; i++) {
          this.particles.push({
            edge: edge,
            from: fromNode,
            to: toNode,
            progress: i * 0.25,
            speed: 0.008 + Math.random() * 0.004,
            size: 3 + Math.random() * 2,
            color: this.getEdgeColor(edge, fromNode, toNode)
          });
        }
      }
    });
  }

  getEdgeColor(edge, fromNode, toNode) {
    if (toNode.type === 'mixer') return '#EF4444';
    if (toNode.type === 'bridge') return '#F59E0B';
    if (toNode.type === 'vasp') return '#10B981';
    return '#06B6D4';
  }

  screenToWorld(x, y) {
    return {
      x: (x - this.offsetX) / this.scale,
      y: (y - this.offsetY) / this.scale
    };
  }

  initEvents() {
    // Mouse Events
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      this.handlePointerDown(mouseX, mouseY);
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      this.handlePointerMove(mouseX, mouseY);
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.draggedNode = null;
    });

    // Touch Events (Mobile/Tablet Support)
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const rect = this.canvas.getBoundingClientRect();
        const touchX = e.touches[0].clientX - rect.left;
        const touchY = e.touches[0].clientY - rect.top;
        this.handlePointerDown(touchX, touchY);
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        this.initialPinchDist = Math.sqrt(dx * dx + dy * dy);
      }
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      if (e.touches.length === 1) {
        const touchX = e.touches[0].clientX - rect.left;
        const touchY = e.touches[0].clientY - rect.top;
        this.handlePointerMove(touchX, touchY);
      } else if (e.touches.length === 2 && this.initialPinchDist) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const zoomRatio = dist / this.initialPinchDist;
        this.scale = Math.min(2.5, Math.max(0.3, this.scale * (zoomRatio > 1 ? 1.03 : 0.97)));
        this.initialPinchDist = dist;
      }
    }, { passive: false });

    this.canvas.addEventListener('touchend', () => {
      this.isDragging = false;
      this.draggedNode = null;
      this.initialPinchDist = null;
    });

    // Mouse Wheel Zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      const newScale = Math.min(2.5, Math.max(0.3, this.scale * zoomFactor));

      this.offsetX = mouseX - (mouseX - this.offsetX) * (newScale / this.scale);
      this.offsetY = mouseY - (mouseY - this.offsetY) * (newScale / this.scale);
      this.scale = newScale;
    });
  }

  handlePointerDown(x, y) {
    const worldPos = this.screenToWorld(x, y);
    const clickedNode = this.nodes.slice().reverse().find(n => {
      const dx = n.x - worldPos.x;
      const dy = n.y - worldPos.y;
      return Math.sqrt(dx * dx + dy * dy) <= (n.radius || 28);
    });

    if (clickedNode) {
      this.draggedNode = clickedNode;
      this.selectedNode = clickedNode;
      if (this.callbacks.onNodeSelected) {
        this.callbacks.onNodeSelected(clickedNode);
      }
    } else {
      this.isDragging = true;
      this.selectedNode = null;
      if (this.callbacks.onNodeSelected) {
        this.callbacks.onNodeSelected(null);
      }
    }
    this.lastMousePos = { x, y };
  }

  handlePointerMove(x, y) {
    const worldPos = this.screenToWorld(x, y);

    if (this.draggedNode) {
      this.draggedNode.x = worldPos.x;
      this.draggedNode.y = worldPos.y;
    } else if (this.isDragging) {
      const dx = x - this.lastMousePos.x;
      const dy = y - this.lastMousePos.y;
      this.offsetX += dx;
      this.offsetY += dy;
    } else {
      const hovered = this.nodes.find(n => {
        const dx = n.x - worldPos.x;
        const dy = n.y - worldPos.y;
        return Math.sqrt(dx * dx + dy * dy) <= (n.radius || 28);
      });
      if (this.hoveredNode !== hovered) {
        this.hoveredNode = hovered;
        this.canvas.style.cursor = hovered ? 'pointer' : 'grab';
      }
    }
    this.lastMousePos = { x, y };
  }

  startLoop() {
    const loop = () => {
      this.updateParticles();
      this.radarAngle += 0.02;
      this.radarPulseRadius = (this.radarPulseRadius + 0.5) % 45;
      this.draw();
      this.animFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  updateParticles() {
    this.particles.forEach(p => {
      p.progress += p.speed;
      if (p.progress > 1.0) {
        p.progress = 0;
      }
    });
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    this.drawGrid(ctx);

    ctx.save();
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.scale, this.scale);

    const visibleEdges = this.edges.filter(e => (e.hop || 1) <= this.maxHopsToDisplay);

    visibleEdges.forEach(edge => {
      const fromNode = this.nodes.find(n => n.id === edge.from);
      const toNode = this.nodes.find(n => n.id === edge.to);
      if (fromNode && toNode) {
        this.drawEdge(ctx, edge, fromNode, toNode);
      }
    });

    this.particles.forEach(p => {
      if ((p.edge.hop || 1) <= this.maxHopsToDisplay) {
        this.drawParticle(ctx, p);
      }
    });

    this.nodes.forEach(node => {
      this.drawNode(ctx, node);
    });

    ctx.restore();
  }

  drawGrid(ctx) {
    const gridSize = 40 * this.scale;
    const startX = this.offsetX % gridSize;
    const startY = this.offsetY % gridSize;

    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 1;

    ctx.beginPath();
    for (let x = startX; x < this.width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
    }
    for (let y = startY; y < this.height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
    }
    ctx.stroke();
  }

  drawEdge(ctx, edge, fromNode, toNode) {
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return;

    const color = this.getEdgeColor(edge, fromNode, toNode);

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.moveTo(fromNode.x, fromNode.y);
    ctx.lineTo(toNode.x, toNode.y);
    ctx.stroke();

    const angle = Math.atan2(dy, dx);
    const arrowDist = dist - (toNode.radius || 28) - 4;
    const arrowX = fromNode.x + Math.cos(angle) * arrowDist;
    const arrowY = fromNode.y + Math.sin(angle) * arrowDist;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(arrowX - 10 * Math.cos(angle - Math.PI / 6), arrowY - 10 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(arrowX - 10 * Math.cos(angle + Math.PI / 6), arrowY - 10 * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    const midX = (fromNode.x + toNode.x) / 2;
    const midY = (fromNode.y + toNode.y) / 2;

    ctx.font = 'bold 9px Inter, sans-serif';
    const labelText = `${edge.amount} (Hop ${edge.hop || 1})`;
    const textWidth = ctx.measureText(labelText).width;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.roundRect(midX - textWidth / 2 - 6, midY - 10, textWidth + 12, 18, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#E2E8F0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labelText, midX, midY);

    ctx.restore();
  }

  drawParticle(ctx, p) {
    const from = p.from;
    const to = p.to;
    const x = from.x + (to.x - from.x) * p.progress;
    const y = from.y + (to.y - from.y) * p.progress;

    ctx.save();
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.arc(x, y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawNode(ctx, node) {
    const radius = node.radius || 28;
    const isSelected = this.selectedNode === node;
    const isHovered = this.hoveredNode === node;

    let strokeColor = '#06B6D4';
    let fillColor = 'rgba(15, 23, 42, 0.92)';
    let badgeText = 'WALLET';
    let badgeBg = '#0369A1';
    let iconChar = 'W';

    if (node.type === 'victim') {
      strokeColor = '#38BDF8';
      badgeText = 'VICTIM';
      badgeBg = '#0284C7';
      iconChar = '👤';
    } else if (node.type === 'burner') {
      strokeColor = '#F59E0B';
      badgeText = 'BURNER';
      badgeBg = '#D97706';
      iconChar = '🔥';
    } else if (node.type === 'layering') {
      strokeColor = '#A855F7';
      badgeText = 'PEEL-CHAIN';
      badgeBg = '#9333EA';
      iconChar = '⛓️';
    } else if (node.type === 'dex') {
      strokeColor = '#EC4899';
      badgeText = 'DEX SWAP';
      badgeBg = '#DB2777';
      iconChar = '🔄';
    } else if (node.type === 'bridge') {
      strokeColor = '#EAB308';
      badgeText = 'BRIDGE';
      badgeBg = '#CA8A04';
      iconChar = '🌉';
    } else if (node.type === 'mixer') {
      strokeColor = '#EF4444';
      badgeText = 'MIXER';
      badgeBg = '#DC2626';
      iconChar = '🌪️';
    } else if (node.type === 'vasp') {
      strokeColor = '#10B981';
      badgeText = 'VASP (EXCHANGE)';
      badgeBg = '#059669';
      iconChar = '🏦';
    }

    ctx.save();

    // Radar Pulse on Target VASP or Selected Node
    if (node.type === 'vasp' || isSelected) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius + this.radarPulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = node.type === 'vasp' ? `rgba(16, 185, 129, ${1 - this.radarPulseRadius / 45})` : `rgba(6, 182, 212, ${1 - this.radarPulseRadius / 45})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    if (isSelected || isHovered || node.type === 'vasp') {
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius + (isSelected ? 10 : 6), 0, Math.PI * 2);
      ctx.fillStyle = strokeColor === '#10B981' ? 'rgba(16, 185, 129, 0.2)' : (strokeColor === '#EF4444' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(6, 182, 212, 0.2)');
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = fillColor;
    ctx.fill();

    ctx.lineWidth = isSelected ? 3.5 : 2.5;
    ctx.strokeStyle = strokeColor;
    ctx.shadowColor = strokeColor;
    ctx.shadowBlur = isSelected ? 16 : 8;
    ctx.stroke();

    ctx.font = '16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(iconChar, node.x, node.y - 2);

    ctx.shadowBlur = 0;
    ctx.font = 'bold 8px Inter, sans-serif';
    const bWidth = ctx.measureText(badgeText).width + 8;
    ctx.fillStyle = badgeBg;
    ctx.beginPath();
    ctx.roundRect(node.x - bWidth / 2, node.y - radius - 14, bWidth, 12, 3);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(badgeText, node.x, node.y - radius - 8);

    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillStyle = '#F8FAFC';
    ctx.fillText(node.label, node.x, node.y + radius + 14);

    ctx.font = '8.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94A3B8';
    const shortAddr = node.address.length > 14 ? `${node.address.slice(0, 6)}...${node.address.slice(-4)}` : node.address;
    ctx.fillText(shortAddr, node.x, node.y + radius + 26);

    ctx.restore();
  }

  zoomIn() {
    this.scale = Math.min(2.5, this.scale * 1.2);
    this.draw();
  }

  zoomOut() {
    this.scale = Math.max(0.4, this.scale * 0.8);
    this.draw();
  }

  resetView() {
    this.centerGraph();
    this.draw();
  }

  destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }
}
