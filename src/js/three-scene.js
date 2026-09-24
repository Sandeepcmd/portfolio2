import * as THREE from 'three';

export function initThreeScene() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 18;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting tailored for elegant Light Theme
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0x6366f1, 2.5);
  keyLight.position.set(10, 15, 10);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xec4899, 1.8);
  fillLight.position.set(-10, -10, -5);
  scene.add(fillLight);

  const cyanLight = new THREE.PointLight(0x06b6d4, 2, 50);
  cyanLight.position.set(0, 5, 5);
  scene.add(cyanLight);

  // Group for floating objects
  const objectsGroup = new THREE.Group();
  scene.add(objectsGroup);

  // Materials with soft translucent clay / frosted glass aesthetic for Light Theme
  const mainMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x6366f1,
    emissive: 0x4f46e5,
    emissiveIntensity: 0.1,
    roughness: 0.25,
    metalness: 0.15,
    transmission: 0.6,
    thickness: 1.2,
    transparent: true,
    opacity: 0.75,
    wireframe: false
  });

  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x818cf8,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });

  const accentMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xec4899,
    roughness: 0.3,
    metalness: 0.2,
    transparent: true,
    opacity: 0.65
  });

  const cyanMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x06b6d4,
    roughness: 0.2,
    metalness: 0.3,
    transparent: true,
    opacity: 0.7
  });

  // 1. Central 3D Icosahedron
  const icoGeo = new THREE.IcosahedronGeometry(2.4, 0);
  const icoMesh = new THREE.Mesh(icoGeo, mainMaterial);
  icoMesh.position.set(5.5, 2, -2);
  objectsGroup.add(icoMesh);

  // Outer wireframe cage for Icosahedron
  const icoWire = new THREE.Mesh(icoGeo, wireframeMaterial);
  icoWire.scale.set(1.15, 1.15, 1.15);
  icoMesh.add(icoWire);

  // 2. 3D Torus Knot
  const knotGeo = new THREE.TorusKnotGeometry(1.6, 0.45, 100, 16);
  const knotMesh = new THREE.Mesh(knotGeo, accentMaterial);
  knotMesh.position.set(-6, -4, -4);
  objectsGroup.add(knotMesh);

  // 3. 3D Octahedron
  const octGeo = new THREE.OctahedronGeometry(1.8, 0);
  const octMesh = new THREE.Mesh(octGeo, cyanMaterial);
  octMesh.position.set(-5.5, 4.5, -3);
  objectsGroup.add(octMesh);

  // 4. Smaller orbiting spheres
  const spheres = [];
  const sphereGeo = new THREE.SphereGeometry(0.5, 32, 32);
  for (let i = 0; i < 6; i++) {
    const sphere = new THREE.Mesh(sphereGeo, i % 2 === 0 ? mainMaterial : accentMaterial);
    const angle = (i / 6) * Math.PI * 2;
    const radius = 9 + Math.random() * 4;
    sphere.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 6 - 2
    );
    objectsGroup.add(sphere);
    spheres.push({
      mesh: sphere,
      speedX: (Math.random() - 0.5) * 0.008,
      speedY: (Math.random() - 0.5) * 0.008,
      originalY: sphere.position.y
    });
  }

  // Mouse Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Scroll Interaction
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY || window.pageYOffset;
  });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth mouse interpolation
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Rotate main meshes
    icoMesh.rotation.x = elapsedTime * 0.35;
    icoMesh.rotation.y = elapsedTime * 0.45;

    knotMesh.rotation.x = elapsedTime * 0.25;
    knotMesh.rotation.y = elapsedTime * 0.3;

    octMesh.rotation.x = elapsedTime * 0.4;
    octMesh.rotation.z = elapsedTime * 0.3;

    // Floating animation
    spheres.forEach((item, idx) => {
      item.mesh.position.y = item.originalY + Math.sin(elapsedTime * 1.5 + idx) * 0.6;
      item.mesh.rotation.y += 0.01;
    });

    // Camera responds gently to mouse and scroll
    camera.position.x = targetX * 1.5;
    camera.position.y = targetY * 1.2 - (scrollY * 0.004);
    camera.lookAt(0, -scrollY * 0.003, 0);

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}
