import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const BloodGroups3D = () => {
  const mountRef = useRef(null);
  const [bloodGroups] = useState(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]);
  const [positions, setPositions] = useState(() => {
    // Initialize positions in a circle
    return bloodGroups.map((group, i) => {
      const angle = (i / bloodGroups.length) * Math.PI * 2;
      const radius = 3;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        angle: angle,
        targetX: Math.cos(angle) * radius,
        targetY: Math.sin(angle) * radius,
        velocityX: (Math.random() - 0.5) * 0.08,
        velocityY: (Math.random() - 0.5) * 0.08,
        speed: 0.05 + Math.random() * 0.05
      };
    });
  });
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [rotationState, setRotationState] = useState({
    currentRotationX: 0,
    currentRotationY: 0,
    targetRotationX: 0,
    targetRotationY: 0
  });

  
  // Auto movement animation - always active
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prev => {
        return prev.map((pos, i) => {
          if (draggedIndex === i) return pos; // Don't move if being dragged

          // Generate new target position within circle
          let newTargetX = pos.targetX + pos.velocityX;
          let newTargetY = pos.targetY + pos.velocityY;
          
          // Check if new target is outside circle
          const distanceFromCenter = Math.sqrt(newTargetX * newTargetX + newTargetY * newTargetY);
          const maxRadius = 3.5;
          
          if (distanceFromCenter > maxRadius) {
            // Bounce off the circle boundary
            const angle = Math.atan2(newTargetY, newTargetX);
            newTargetX = Math.cos(angle) * maxRadius;
            newTargetY = Math.sin(angle) * maxRadius;
            
            // Reverse velocity with some randomness
            const newVelocityX = -pos.velocityX * 0.8 + (Math.random() - 0.5) * 0.04;
            const newVelocityY = -pos.velocityY * 0.8 + (Math.random() - 0.5) * 0.04;
            
            return {
              ...pos,
              targetX: newTargetX,
              targetY: newTargetY,
              velocityX: newVelocityX,
              velocityY: newVelocityY,
              x: pos.x + (newTargetX - pos.x) * pos.speed,
              y: pos.y + (newTargetY - pos.y) * pos.speed
            };
          }
          
          // Random direction change occasionally
          let velocityX = pos.velocityX;
          let velocityY = pos.velocityY;
          
          if (Math.random() < 0.05) { // 5% chance to change direction
            velocityX = (Math.random() - 0.5) * 0.1;
            velocityY = (Math.random() - 0.5) * 0.1;
          }
          
          // Smooth movement towards target
          const newX = pos.x + (newTargetX - pos.x) * pos.speed;
          const newY = pos.y + (newTargetY - pos.y) * pos.speed;
          
          return {
            ...pos,
            x: newX,
            y: newY,
            targetX: newTargetX,
            targetY: newTargetY,
            velocityX: velocityX,
            velocityY: velocityY
          };
        });
      });
    }, 30); // Update every 30ms for faster animation

    return () => clearInterval(interval);
  }, [draggedIndex]);

  useEffect(() => {
    const current = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // White background
    
    const camera = new THREE.PerspectiveCamera(
      75,
      current.clientWidth / current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(current.clientWidth, current.clientHeight);
    current.appendChild(renderer.domElement);

    // Create circle geometry for visual reference
    const circleGeometry = new THREE.RingGeometry(3.4, 3.8, 64);
    const circleMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x44ff44, 
      transparent: true, 
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);

    // Create text sprites for blood groups in 3D space
    const textMeshes = [];
    
    // Create canvas for text rendering
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 128;
    
    bloodGroups.forEach((group, i) => {
      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set text properties
      context.font = 'bold 48px Arial';
      context.fillStyle = 'black';
      context.strokeStyle = 'red';
      context.lineWidth = 4;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      
      // Draw text shadow (red)
      context.strokeText(group, canvas.width / 2, canvas.height / 2);
      // Draw main text (black)
      context.fillText(group, canvas.width / 2, canvas.height / 2);
      
      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      
      // Create material with the text texture
      const material = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true,
        alphaTest: 0.1
      });
      
      // Create plane geometry for the text
      const geometry = new THREE.PlaneGeometry(1, 0.5);
      const mesh = new THREE.Mesh(geometry, material);
      
      const pos = positions[i];
      mesh.position.set(pos.x, pos.y, 0);
      mesh.userData = { bloodGroup: group, index: i };
      
      textMeshes.push(mesh);
    });

    // Mouse controls for rotation
    let isRotating = false;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseDown = (event) => {
      if (draggedIndex === null) {
        isRotating = true;
        mouseX = event.clientX;
        mouseY = event.clientY;
      }
    };

    const onMouseUp = () => {
      isRotating = false;
    };

    const onMouseMove = (event) => {
      if (!isRotating || draggedIndex !== null) return;
      
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      setRotationState(prev => ({
        ...prev,
        targetRotationY: prev.targetRotationY + deltaX * 0.005,
        targetRotationX: prev.targetRotationX + deltaY * 0.005
      }));
      
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    current.addEventListener('mousedown', onMouseDown);
    current.addEventListener('mouseup', onMouseUp);
    current.addEventListener('mousemove', onMouseMove);

    // Create group for all objects
    const mainGroup = new THREE.Group();
    mainGroup.add(circle);
    textMeshes.forEach(mesh => mainGroup.add(mesh));
    scene.add(mainGroup);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Smooth rotation
      setRotationState(prev => {
        const newRotationX = prev.currentRotationX + (prev.targetRotationX - prev.currentRotationX) * 0.05;
        const newRotationY = prev.currentRotationY + (prev.targetRotationY - prev.currentRotationY) * 0.05;
        
        mainGroup.rotation.x = newRotationX;
        mainGroup.rotation.y = newRotationY;
        
        return {
          ...prev,
          currentRotationX: newRotationX,
          currentRotationY: newRotationY
        };
      });

      // Update text mesh positions
      textMeshes.forEach((mesh, i) => {
        mesh.position.set(positions[i].x, positions[i].y, 0);
        
        // Scale effect when dragging
        if (draggedIndex === i) {
          mesh.scale.set(1.2, 1.2, 1.2);
        } else {
          mesh.scale.set(1, 1, 1);
        }
      });
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const onResize = () => {
      camera.aspect = current.clientWidth / current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(current.clientWidth, current.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", onResize);
      current.removeEventListener('mousedown', onMouseDown);
      current.removeEventListener('mouseup', onMouseUp);
      current.removeEventListener('mousemove', onMouseMove);
      current.removeChild(renderer.domElement);
    };
  }, [positions, draggedIndex, bloodGroups]);

  const handleTextMouseDown = (index, event) => {
    event.preventDefault();
    setDraggedIndex(index);
  };

  const handleTextMouseMove = (event) => {
    if (draggedIndex === null) return;

    const rect = mountRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate relative position from center
    const relativeX = (event.clientX - centerX) / 200; // Scale down
    const relativeY = (centerY - event.clientY) / 200; // Invert Y axis
    
    // Constrain to circle (radius = 3.5)
    const distance = Math.sqrt(relativeX * relativeX + relativeY * relativeY);
    const maxRadius = 3.5;
    
    let newX = relativeX;
    let newY = relativeY;
    
    if (distance > maxRadius) {
      newX = (relativeX / distance) * maxRadius;
      newY = (relativeY / distance) * maxRadius;
    }
    
    // Calculate new angle
    const newAngle = Math.atan2(newY, newX);
    
    setPositions(prev => {
      const newPositions = [...prev];
      newPositions[draggedIndex] = {
        ...newPositions[draggedIndex],
        x: newX,
        y: newY,
        angle: newAngle,
        targetX: newX,
        targetY: newY,
        // Reset velocity for new movement pattern after drag
        velocityX: (Math.random() - 0.5) * 0.08,
        velocityY: (Math.random() - 0.5) * 0.08
      };
      return newPositions;
    });
  };

  const handleTextMouseUp = () => {
    setDraggedIndex(null);
  };

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (draggedIndex !== null) {
      document.addEventListener('mousemove', handleTextMouseMove);
      document.addEventListener('mouseup', handleTextMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleTextMouseMove);
      document.removeEventListener('mouseup', handleTextMouseUp);
    };
  }, [draggedIndex]);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
      
      {/* Blood group text overlays */}
      {bloodGroups.map((group, i) => {
        const pos = positions[i];
        const isDragged = draggedIndex === i;
        
        return (
          <div
            key={group}
            onMouseDown={(e) => handleTextMouseDown(i, e)}
            style={{
              position: "absolute",
              left: `calc(50% + ${pos.x * 200}px)`,
              top: `calc(50% + ${pos.y * -200}px)`,
              transform: "translate(-50%, -50%)",
              fontSize: "32px",
              fontWeight: "bold",
              color: isDragged ? "#ff4444" : "black",
              textShadow: isDragged 
                ? "3px 3px 0px #ff8888, -1px -1px 0px #ff8888, 1px -1px 0px #ff8888, -1px 1px 0px #ff8888"
                : "3px 3px 0px red, -1px -1px 0px red, 1px -1px 0px red, -1px 1px 0px red",
              userSelect: "none",
              cursor: isDragged ? "grabbing" : "grab",
              zIndex: isDragged ? 20 : 10,
              fontFamily: "Arial, sans-serif",
              transition: isDragged ? "none" : "all 0.3s ease",
              opacity: isDragged ? 0.9 : 1,
              transform: isDragged ? "translate(-50%, -50%) scale(1.1)" : "translate(-50%, -50%) scale(1)"
            }}
          >
            {group}
          </div>
        );
      })}
      
      {/* Instructions */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        color: "black",
        fontSize: "18px",
        fontWeight: "bold",
        textShadow: "2px 2px 4px rgba(255,0,0,0.5)",
        zIndex: 10
      }}>
      </div>
    </div>
  );
};

export default BloodGroups3D;