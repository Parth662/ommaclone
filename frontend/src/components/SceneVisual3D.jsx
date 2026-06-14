import React, { useRef, useEffect } from "react";

export default function SceneVisual3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Generate vertices for a 3D Torus Knot
    const numPoints = 120;
    const vertices = [];
    
    // R: major radius, r: minor radius, p,q: knot parameters
    const R = 60;
    const r = 24;
    const p = 2;
    const q = 3;
    
    for (let i = 0; i < numPoints; i++) {
      const theta = (i / numPoints) * Math.PI * 2 * p;
      const r_theta = r * Math.sin((q * theta) / p) + R;
      const x = r_theta * Math.cos(theta);
      const y = r_theta * Math.sin(theta);
      const z = r * Math.cos((q * theta) / p);
      vertices.push({ x, y, z });
    }

    let angleX = 0.01;
    let angleY = 0.015;
    let angleZ = 0.005;

    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = (e.clientX - rect.left - width / 2) / 80;
      targetMouseY = (e.clientY - rect.top - height / 2) / 80;
    };

    const handleMouseLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.resetTransform();
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const focalLength = 320;

      // Smooth mouse rotation interpolation
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      const currentAngleX = angleX + mouseY;
      const currentAngleY = angleY + mouseX;

      // Rotate points
      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);
      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);

      const projected = vertices.map((v) => {
        // Rotate X
        let y1 = v.y * cosX - v.z * sinX;
        let z1 = v.z * cosX + v.y * sinX;

        // Rotate Y
        let x2 = v.x * cosY - z1 * sinY;
        let z2 = z1 * cosY + v.x * sinY;

        // Rotate Z
        let x3 = x2 * cosZ - y1 * sinZ;
        let y3 = y1 * cosZ + x2 * sinZ;

        // Perspective Projection
        // Map Z to depth offset
        const zDepth = z2 + 220;
        const scale = focalLength / zDepth;
        const projX = x3 * scale + centerX;
        const projY = y3 * scale + centerY;

        return { x: projX, y: projY, depth: zDepth };
      });

      // Draw lines connecting consecutive vertices
      ctx.lineWidth = 1.8;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        const p2 = projected[(i + 1) % projected.length];
        
        // Depth cueing
        const avgDepth = (p1.depth + p2.depth) / 2;
        const alpha = Math.max(0.12, Math.min(0.85, 1 - (avgDepth - 160) / 140));

        // Create gradient line between purple (#a78bfa) and cyan (#5eead4)
        const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        grad.addColorStop(0, `rgba(167, 139, 250, ${alpha})`);
        grad.addColorStop(1, `rgba(94, 234, 212, ${alpha})`);

        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Draw nodes at each vertex
      projected.forEach((p) => {
        const size = Math.max(1.8, Math.min(4.5, (300 / p.depth) * 2.8));
        const alpha = Math.max(0.2, Math.min(0.9, 1 - (p.depth - 160) / 140));

        // Outer glow
        ctx.fillStyle = `rgba(167, 139, 250, ${alpha * 0.35})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 2.4, 0, Math.PI * 2);
        ctx.fill();

        // Inner core
        ctx.fillStyle = `rgba(94, 234, 212, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update angles for auto rotation
      angleX += 0.002;
      angleY += 0.003;
      angleZ += 0.001;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        background: "transparent",
      }}
    />
  );
}
