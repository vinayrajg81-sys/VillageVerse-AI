// VillageVerse AI: Advanced 3D Digital Twin with Karnataka Rural Architecture & Dynamics
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { api } from '../services/api';
import { usePanchayat } from '../context/PanchayatContext';
import { getAssetsForPanchayat } from '../services/panchayatAssets';
import { DigitalTwinAsset } from '../types';
import { 
  Box, Map, Layers, RefreshCw, Sparkles, Wrench, ShieldCheck, 
  AlertTriangle, X, Info, Activity, ZoomIn, ZoomOut, RotateCcw,
  Sun, Moon, Sunrise, Sunset, Video, Crosshair, Download, FileText,
  Navigation, Eye, Plane, Building2, ChevronDown
} from 'lucide-react';
import { GISMapViewer } from '../components/common/GISMapViewer';

type TimeOfDay = 'dawn' | 'day' | 'golden' | 'night';
type CameraViewMode = 'orbit' | 'drone' | 'topdown' | 'street';

export const DigitalTwin: React.FC = () => {
  const { activePanchayat, panchayats, switchPanchayat } = usePanchayat();
  const gpDisplayName = activePanchayat.name.replace(/\s*(Rural\s*)?Gram\s*Panchayat/i, '').trim() || activePanchayat.name;

  const [assets, setAssets] = useState<DigitalTwinAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<DigitalTwinAsset | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [cameraMode, setCameraMode] = useState<CameraViewMode>('orbit');
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const controlsRef = useRef<{
    zoomIn?: () => void;
    zoomOut?: () => void;
    reset?: () => void;
  }>({});

  const categories = [
    'All', 'Building', 'Water Tank', 'Lake', 'Borewell', 
    'Hospital', 'School', 'Anganwadi', 'Road', 'Solar Panel', 'Street Light'
  ];

  useEffect(() => {
    loadAssets();
  }, [activeCategory, activePanchayat.id]);

  const loadAssets = async () => {
    setLoading(true);
    const cat = activeCategory === 'All' ? undefined : activeCategory;
    const items = getAssetsForPanchayat(activePanchayat, cat);
    setAssets(items);
    setSelectedAsset(items[0] || null);
    setLoading(false);
  };

  // ==========================================
  // Three.js 3D Advanced Karnataka Village Twin
  // ==========================================
  useEffect(() => {
    if (viewMode !== '3d' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.parentElement?.clientWidth || 800;
    const height = 520;

    // 1. Scene & Atmosphere Config
    const scene = new THREE.Scene();

    // Atmosphere presets based on timeOfDay
    let skyColor = 0x090d16;
    let sunColor = 0xffffff;
    let sunIntensity = 1.3;
    let ambientIntensity = 0.8;
    let fogDensity = 0.025;
    let streetLightIntensity = 0;

    if (timeOfDay === 'dawn') {
      skyColor = 0x2d1a36;
      sunColor = 0xffa07a;
      sunIntensity = 1.1;
      ambientIntensity = 0.7;
      fogDensity = 0.035;
      streetLightIntensity = 0.6;
    } else if (timeOfDay === 'day') {
      skyColor = 0x0c1b33;
      sunColor = 0xf8fafc;
      sunIntensity = 1.4;
      ambientIntensity = 0.9;
      fogDensity = 0.02;
      streetLightIntensity = 0;
    } else if (timeOfDay === 'golden') {
      skyColor = 0x3d1d12;
      sunColor = 0xfb923c;
      sunIntensity = 1.5;
      ambientIntensity = 0.7;
      fogDensity = 0.028;
      streetLightIntensity = 0.8;
    } else if (timeOfDay === 'night') {
      skyColor = 0x030712;
      sunColor = 0x38bdf8;
      sunIntensity = 0.25;
      ambientIntensity = 0.35;
      fogDensity = 0.03;
      streetLightIntensity = 2.4;
    }

    scene.background = new THREE.Color(skyColor);
    scene.fog = new THREE.FogExp2(skyColor, fogDensity);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 18, 26);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(sunColor, sunIntensity);
    sunLight.position.set(20, 30, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // 3. Ground Terrain & Village Grid
    const groundGeo = new THREE.PlaneGeometry(50, 50, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: timeOfDay === 'night' ? 0x050c18 : 0x0f1e2e,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(50, 50, 0x1e3a5f, 0x0d1f33);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // 4. Roads Network (Crossroads + Main Arterial Highway)
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const roadX = new THREE.Mesh(new THREE.PlaneGeometry(50, 3), roadMat);
    roadX.rotation.x = -Math.PI / 2;
    roadX.position.set(0, 0.02, 0);
    scene.add(roadX);

    const roadZ = new THREE.Mesh(new THREE.PlaneGeometry(3, 50), roadMat);
    roadZ.rotation.x = -Math.PI / 2;
    roadZ.position.set(0, 0.025, 0);
    scene.add(roadZ);

    // 5. Lake (Shivalli Kere) & Flowing Irrigation Canal
    const lakeGeo = new THREE.CylinderGeometry(5.5, 5, 0.3, 32);
    const lakeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85
    });
    const lake = new THREE.Mesh(lakeGeo, lakeMat);
    lake.position.set(-8, 0.15, 6);
    scene.add(lake);

    // Irrigation Canal
    const canalGeo = new THREE.BoxGeometry(40, 0.2, 1.8);
    const canalMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      roughness: 0.15,
      metalness: 0.75,
      transparent: true,
      opacity: 0.9
    });
    const canal = new THREE.Mesh(canalGeo, canalMat);
    canal.position.set(0, 0.08, -8);
    scene.add(canal);

    // 6. Agricultural Plots (Sugarcane & Paddy with green crop stripes)
    const farmMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.9 });
    const farm1 = new THREE.Mesh(new THREE.BoxGeometry(12, 0.1, 10), farmMat);
    farm1.position.set(-14, 0.05, -14);
    scene.add(farm1);

    const farm2 = new THREE.Mesh(new THREE.BoxGeometry(10, 0.1, 12), farmMat);
    farm2.position.set(14, 0.05, -14);
    scene.add(farm2);

    // 7. Interactive Asset Meshes & Markers
    const interactiveMeshes: Array<{ mesh: THREE.Mesh; asset: DigitalTwinAsset }> = [];
    const streetLightBulbs: THREE.PointLight[] = [];

    assets.forEach((asset) => {
      const pos = asset.position3D || { x: 0, y: 0.5, z: 0 };
      const size = asset.size || [1.5, 1.5, 1.5];

      let geometry: THREE.BufferGeometry;
      if (asset.category === 'Water Tank') {
        geometry = new THREE.CylinderGeometry(size[0] / 2, size[0] / 2, size[1], 16);
      } else if (asset.category === 'Lake') {
        geometry = new THREE.CylinderGeometry(size[0] / 2, size[0] / 1.8, 0.2, 24);
      } else if (asset.category === 'Street Light') {
        geometry = new THREE.CylinderGeometry(0.08, 0.08, size[1], 8);
      } else {
        geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
      }

      const material = new THREE.MeshStandardMaterial({
        color: asset.color || 0x10b981,
        roughness: 0.3,
        metalness: 0.4,
        emissive: asset.status === 'Critical' ? 0xef4444 : (timeOfDay === 'night' ? 0x064e3b : 0x000000),
        emissiveIntensity: timeOfDay === 'night' ? 0.4 : 0.2
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(pos.x, pos.y, pos.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      // Add a floating glowing holographic marker above building
      const markerGeo = new THREE.OctahedronGeometry(0.35);
      const markerMat = new THREE.MeshBasicMaterial({ 
        color: asset.status === 'Needs Maintenance' ? 0xf59e0b : 0x38bdf8 
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(pos.x, pos.y + (size[1] / 2) + 0.7, pos.z);
      scene.add(marker);

      // If Street Light, add real point light for night illumination
      if (asset.category === 'Street Light') {
        const pLight = new THREE.PointLight(0xfef08a, streetLightIntensity, 12);
        pLight.position.set(pos.x, pos.y + size[1] / 2, pos.z);
        scene.add(pLight);
        streetLightBulbs.push(pLight);
      }

      interactiveMeshes.push({ mesh, asset });
    });

    // 8. Karnataka Village Specific Structures:
    // Temple with Gopuram Pinnacle
    const templeGroup = new THREE.Group();
    const templeBase = new THREE.Mesh(new THREE.BoxGeometry(3, 1.8, 3), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
    templeBase.position.y = 0.9;
    templeGroup.add(templeBase);

    const gopuram = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.2, 4), new THREE.MeshStandardMaterial({ color: 0xb45309 }));
    gopuram.position.y = 2.9;
    gopuram.rotation.y = Math.PI / 4;
    templeGroup.add(gopuram);

    templeGroup.position.set(-6, 0, -4);
    scene.add(templeGroup);

    // Traditional Karnataka tiled-roof village dwellings
    for (let h = 0; h < 8; h++) {
      const house = new THREE.Group();
      const hBase = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 1.6), new THREE.MeshStandardMaterial({ color: 0xf1f5f9 }));
      hBase.position.y = 0.6;
      const hRoof = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.8, 4), new THREE.MeshStandardMaterial({ color: 0x9a3412 })); // Terracotta
      hRoof.position.y = 1.6;
      hRoof.rotation.y = Math.PI / 4;
      house.add(hBase);
      house.add(hRoof);

      const hX = (h % 4) * 3 + 4;
      const hZ = Math.floor(h / 4) * 3 + 4;
      house.position.set(hX, 0, hZ);
      scene.add(house);
    }

    // 9. Floating Clouds
    const clouds: THREE.Mesh[] = [];
    const cloudGeo = new THREE.SphereGeometry(1.8, 8, 8);
    const cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 });
    for (let c = 0; c < 5; c++) {
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      cloud.position.set(-20 + c * 10, 14 + (c % 2) * 2, -15 + c * 6);
      scene.add(cloud);
      clouds.push(cloud);
    }

    // 10. Flying Birds
    const birds: THREE.Mesh[] = [];
    const birdGeo = new THREE.ConeGeometry(0.12, 0.4, 4);
    const birdMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
    for (let b = 0; b < 6; b++) {
      const bird = new THREE.Mesh(birdGeo, birdMat);
      bird.rotation.x = Math.PI / 2;
      bird.position.set(-8 + b * 2, 8 + Math.sin(b), 4 + b * 1.5);
      scene.add(bird);
      birds.push(bird);
    }

    // 11. Moving Road Vehicles (Ambulance, Tractor, Milk Tanker)
    const vehicles: Array<{ mesh: THREE.Mesh; axis: 'x' | 'z'; speed: number }> = [];
    const vGeo = new THREE.BoxGeometry(1.2, 0.6, 0.7);
    const vColors = [0xef4444, 0x10b981, 0x0284c7];

    for (let v = 0; v < 3; v++) {
      const vMesh = new THREE.Mesh(vGeo, new THREE.MeshStandardMaterial({ color: vColors[v] }));
      vMesh.position.set(-15 + v * 12, 0.32, 0);
      scene.add(vMesh);
      vehicles.push({ mesh: vMesh, axis: 'x', speed: 0.08 + v * 0.02 });
    }

    // 12. Walking Citizens
    const pedestrians: Array<{ mesh: THREE.Mesh; dir: number }> = [];
    const pGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.7, 8);
    const pMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
    for (let p = 0; p < 5; p++) {
      const ped = new THREE.Mesh(pGeo, pMat);
      ped.position.set(1.8, 0.35, -10 + p * 4);
      scene.add(ped);
      pedestrians.push({ mesh: ped, dir: p % 2 === 0 ? 1 : -1 });
    }

    // 13. Swaying Trees
    const trees: THREE.Mesh[] = [];
    const treeGeo = new THREE.ConeGeometry(0.65, 2.2, 6);
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x15803d });
    for (let i = 0; i < 28; i++) {
      const tree = new THREE.Mesh(treeGeo, treeMat);
      const angle = (i / 28) * Math.PI * 2;
      const rad = 17 + (i % 3) * 2;
      tree.position.set(Math.cos(angle) * rad, 1.1, Math.sin(angle) * rad);
      scene.add(tree);
      trees.push(tree);
    }

    // 14. Smart Infrastructure Additions (Canal Solar, EV Hub, Biogas)
    const futuristicAssetsGroup = new THREE.Group();
    // Canal-top solar panels
    const canalSolar = new THREE.Mesh(
      new THREE.BoxGeometry(18, 0.1, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.8, roughness: 0.2 })
    );
    canalSolar.position.set(0, 0.8, -8);
    futuristicAssetsGroup.add(canalSolar);

    // EV Public Charging Station
    const evHub = new THREE.Mesh(
      new THREE.BoxGeometry(2, 1.2, 1.5),
      new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.3 })
    );
    evHub.position.set(3, 0.6, 2.5);
    futuristicAssetsGroup.add(evHub);

    // Micro Biogas Digester
    const bioDigester = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.3 })
    );
    bioDigester.position.set(12, 1.2, 12);
    futuristicAssetsGroup.add(bioDigester);
    scene.add(futuristicAssetsGroup);

    // 15. Raycaster for Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const targets = interactiveMeshes.map(m => m.mesh);
      const intersects = raycaster.intersectObjects(targets);

      if (intersects.length > 0) {
        const hit = interactiveMeshes.find(m => m.mesh === intersects[0].object);
        if (hit) setSelectedAsset(hit.asset);
      }
    };
    canvas.addEventListener('click', handleCanvasClick);

    // 16. Orbit Dragging Controls
    let orbitAngle = 0.8;
    let cameraHeight = 18;
    let cameraRadius = 26;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      orbitAngle += deltaX * 0.007;
      cameraHeight = Math.max(6, Math.min(36, cameraHeight - deltaY * 0.05));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const handleMouseUp = () => { isDragging = false; };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Expose camera controls to buttons
    controlsRef.current = {
      zoomIn: () => { cameraRadius = Math.max(12, cameraRadius - 4); },
      zoomOut: () => { cameraRadius = Math.min(48, cameraRadius + 4); },
      reset: () => {
        orbitAngle = 0.8;
        cameraHeight = 18;
        cameraRadius = 26;
        setCameraMode('orbit');
      }
    };

    // 17. 60 FPS Render & Animation Loop
    let droneFlyAngle = 0;
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      // Move clouds gently across sky
      clouds.forEach((cloud, idx) => {
        cloud.position.x += 0.02 * (idx + 1) * 0.4;
        if (cloud.position.x > 25) cloud.position.x = -25;
      });

      // Fly birds in gentle circle
      birds.forEach((bird, idx) => {
        const bAngle = Date.now() * 0.001 + idx;
        bird.position.x = -8 + Math.sin(bAngle) * 5;
        bird.position.z = 6 + Math.cos(bAngle) * 5;
      });

      // Move vehicles on roads
      vehicles.forEach((veh) => {
        veh.mesh.position.x += veh.speed;
        if (veh.mesh.position.x > 24) veh.mesh.position.x = -24;
      });

      // Walk pedestrians
      pedestrians.forEach((ped) => {
        ped.mesh.position.z += 0.02 * ped.dir;
        if (ped.mesh.position.z > 14 || ped.mesh.position.z < -14) {
          ped.dir *= -1;
        }
      });

      // Wind sway on trees
      const windTime = Date.now() * 0.002;
      trees.forEach((tree, idx) => {
        tree.rotation.z = Math.sin(windTime + idx) * 0.04;
      });

      // Camera position handling
      if (cameraMode === 'drone') {
        droneFlyAngle += 0.004;
        camera.position.x = Math.sin(droneFlyAngle) * 16;
        camera.position.y = 8 + Math.cos(droneFlyAngle * 0.5) * 3;
        camera.position.z = Math.cos(droneFlyAngle) * 16;
        camera.lookAt(0, 1.5, 0);
      } else if (cameraMode === 'topdown') {
        camera.position.set(0, 38, 0.01);
        camera.lookAt(0, 0, 0);
      } else if (cameraMode === 'street') {
        camera.position.set(0, 2.2, 10);
        camera.lookAt(0, 2.2, 0);
      } else {
        // Orbit mode
        if (!isDragging) orbitAngle += 0.001;
        camera.position.x = cameraRadius * Math.sin(orbitAngle);
        camera.position.y = cameraHeight;
        camera.position.z = cameraRadius * Math.cos(orbitAngle);
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const newW = canvas.parentElement?.clientWidth || 800;
      camera.aspect = newW / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      canvas.removeEventListener('click', handleCanvasClick);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [viewMode, assets, timeOfDay, cameraMode, activePanchayat.id]);

  const handleDroneInspect = () => {
    setActionNotice(`Autonomous UAV dispatched to scan ${selectedAsset?.name || 'Asset'}. Thermal telemetry stream active.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleLogWorkOrder = async () => {
    const woId = `WO-${Date.now().toString().slice(-4)}`;
    setActionNotice(`Work order ${woId} created for ${selectedAsset?.name}. Assigned to ${activePanchayat.taluk} Taluk Works Division.`);
    try {
      await api.supabase.from('notifications').insert([{
        title: `Work Order ${woId}`,
        message: `Maintenance scheduled for ${selectedAsset?.name || 'Asset'} (${selectedAsset?.category})`,
        type: 'warning',
        department: 'Works Division'
      }]);
    } catch {}
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              {activePanchayat.id}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/40">
              {activePanchayat.latitude.toFixed(4)}° N, {activePanchayat.longitude.toFixed(4)}° E
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {activePanchayat.taluk} Taluk
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <Box className="w-6 h-6 text-emerald-400" />
            {gpDisplayName} 3D Living Village Twin
          </h1>
          <p className="text-xs text-slate-400">
            {activePanchayat.specialization} • Real-time WebGL asset health telemetry & autonomous drone inspections
          </p>
        </div>

        {/* View Mode & Gram Panchayat Switcher Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Council Quick Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-emerald-500/40">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={activePanchayat.id}
              onChange={(e) => switchPanchayat(e.target.value)}
              className="bg-transparent text-xs text-emerald-300 font-bold focus:outline-none cursor-pointer"
            >
              {panchayats.map((gp) => (
                <option key={gp.id} value={gp.id} className="bg-slate-900 text-white">
                  {gp.name.replace(' Gram Panchayat', '')} ({gp.id})
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle (3D vs 2D GIS) */}
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center">
            <button
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === '3d'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Spatial Twin
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === '2d'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2D GIS Map
            </button>
          </div>

          <button
            onClick={loadAssets}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Refresh Digital Twin"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Category Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-xl font-medium border transition shrink-0 ${
              activeCategory === cat
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4. Action Notification Banner */}
      {actionNotice && (
        <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 5. Main Digital Twin Viewer & Asset Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main 3D Canvas Column */}
        <div className="lg:col-span-2 glass-card rounded-3xl overflow-hidden border border-slate-800 relative">
          {viewMode === '3d' ? (
            <div className="relative w-full h-[520px]">
              <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing block" />

              {/* Top-Left OSD Badge */}
              <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-700/80 text-[11px] text-slate-300 pointer-events-none space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold text-emerald-400">{gpDisplayName} 3D Living Village Twin</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Left-click & drag to orbit • Click buildings to inspect • Scroll to zoom
                </p>
              </div>

              {/* Top-Right: Time of Day Selector */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80">
                <button
                  onClick={() => setTimeOfDay('dawn')}
                  className={`p-1.5 rounded-xl text-xs transition ${
                    timeOfDay === 'dawn' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Dawn (Sunrise)"
                >
                  <Sunrise className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTimeOfDay('day')}
                  className={`p-1.5 rounded-xl text-xs transition ${
                    timeOfDay === 'day' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Daylight"
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTimeOfDay('golden')}
                  className={`p-1.5 rounded-xl text-xs transition ${
                    timeOfDay === 'golden' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Golden Hour Sunset"
                >
                  <Sunset className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTimeOfDay('night')}
                  className={`p-1.5 rounded-xl text-xs transition ${
                    timeOfDay === 'night' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Night Mode with Illumination"
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom-Left: Camera View Mode Switches */}
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 text-xs">
                <button
                  onClick={() => setCameraMode('orbit')}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition ${
                    cameraMode === 'orbit' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Orbit
                </button>
                <button
                  onClick={() => setCameraMode('drone')}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition flex items-center gap-1 ${
                    cameraMode === 'drone' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Plane className="w-3 h-3" /> Drone Fly
                </button>
                <button
                  onClick={() => setCameraMode('topdown')}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition ${
                    cameraMode === 'topdown' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Satellite GIS
                </button>
                <button
                  onClick={() => setCameraMode('street')}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition ${
                    cameraMode === 'street' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Street
                </button>
              </div>

              {/* Bottom-Right: Zoom & Reset Controls */}
              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80">
                <button
                  onClick={() => controlsRef.current.zoomIn?.()}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => controlsRef.current.zoomOut?.()}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => controlsRef.current.reset?.()}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Reset Camera Orientation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* 2D GIS Interactive Map Layer */
            <div className="p-3">
              <GISMapViewer 
                onSelectAsset={(name) => {
                  const matched = assets.find(a => 
                    a.name.toLowerCase().includes(name.toLowerCase()) || 
                    name.toLowerCase().includes(a.name.toLowerCase())
                  );
                  if (matched) setSelectedAsset(matched);
                }} 
              />
            </div>
          )}
        </div>

        {/* Right Column: Asset Telemetry & AI Inspector Slide-Over Card */}
        <div className="glass-card p-5 rounded-3xl border border-slate-800/80 flex flex-col justify-between">
          {selectedAsset ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {selectedAsset.id}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5 leading-snug">
                    {selectedAsset.name}
                  </h3>
                  <span className="text-xs text-slate-400">{selectedAsset.category}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  selectedAsset.status === 'Operational'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {selectedAsset.status}
                </span>
              </div>

              {/* Health Score Progress */}
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Asset Health Status</span>
                  <span className="font-extrabold text-emerald-400 font-mono">
                    {selectedAsset.health_score} / 100
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-700"
                    style={{ width: `${selectedAsset.health_score}%` }}
                  />
                </div>
              </div>

              {/* Key Specs */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Capacity / Sizing</span>
                  <span className="font-medium text-slate-200">{selectedAsset.capacity}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">GPS Coordinates</span>
                  <span className="font-mono text-slate-300">{selectedAsset.latitude}, {selectedAsset.longitude}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Last Inspection</span>
                  <span className="font-medium text-slate-200">{selectedAsset.last_inspected}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Department Owner</span>
                  <span className="font-medium text-cyan-300">
                    {selectedAsset.category === 'Hospital' ? 'District Health Society' :
                     selectedAsset.category === 'School' ? 'Dept of Public Instruction' :
                     selectedAsset.category === 'Water Tank' ? 'Rural Water & Sanitation' :
                     selectedAsset.category === 'Solar Panel' ? 'BESCOM / KREDL' : activePanchayat.name}
                  </span>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Predictive Recommendation</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedAsset.ai_recommendation}
                </p>
              </div>

              {/* Action Buttons: Drone Scan & Work Order */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleDroneInspect}
                  className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>Drone Scan</span>
                </button>
                <button
                  onClick={handleLogWorkOrder}
                  className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Work Order</span>
                </button>
              </div>

              {/* Maintenance History */}
              {selectedAsset.maintenance_history && selectedAsset.maintenance_history.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-slate-400" />
                    Maintenance History Log
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    {selectedAsset.maintenance_history.map((m, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                        <div>
                          <div className="text-slate-200">{m.action}</div>
                          <div className="text-[10px] text-slate-500">{m.date}</div>
                        </div>
                        <span className="font-mono text-emerald-400 font-semibold">₹{(m.cost ?? 0).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-6 text-slate-500 text-xs">
              Select an asset from the 3D model or list to inspect real-time telemetry.
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Panchayat Asset Registry</span>
            <span className="text-emerald-400 font-semibold">{assets.length} Nodes Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};
