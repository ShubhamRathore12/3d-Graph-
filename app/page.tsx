'use client'; // This component uses client-side features (Three.js)
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
const NodeViz = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mountRef.current) return;
    // Set up the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background
    // Set up the camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    // Set up the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    // Create central node (a small sphere)
    const centralGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const centralMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const centralNode = new THREE.Mesh(centralGeometry, centralMaterial);
    scene.add(centralNode);
    // Create surrounding nodes (cubes)
    const nodes: THREE.Mesh[] = [];
    const nodeCount = 30; // Number of surrounding nodes
    const nodeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); // Cube shape
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00b7eb }); // Cyan color
    for (let i = 0; i < nodeCount; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      // Random spherical positioning around the central node
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 10 + Math.random() * 20; // Random distance between 10 and 30
      node.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      scene.add(node);
      nodes.push(node);
      // Create a line connecting the central node to this node
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x444444 });
      const points = [
        new THREE.Vector3(0, 0, 0), // Central node position
        node.position,
      ];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    }
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      // Rotate the entire scene for a dynamic effect
      scene.rotation.y += 0.002;
      // Render the scene
      renderer.render(scene, camera);
    };
    animate();
    // Handle window resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);
  return (
    <div
      ref={mountRef}
      style={{ position: 'relative', width: '100%', height: '100vh' }}
    />
  );
};
export default NodeViz;
