let scene, camera, renderer, particles, raycaster, mouse;
let particleSystem, particleUniforms, particleGeometry;
const clock = new THREE.Clock();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Create particles
    const particleCount = 5000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;

        colors[i] = Math.random();
        colors[i + 1] = Math.random();
        colors[i + 2] = Math.random();

        sizes[i / 3] = Math.random() * 5;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/disc.png');
    particleUniforms = {
        pointTexture: { value: particleTexture },
        time: { value: 0.0 },
    };

    const particleMaterial = new THREE.ShaderMaterial({
        uniforms: particleUniforms,
        vertexShader: `
            uniform float time;
            attribute float size;
            varying vec3 vColor;
            void main() {
                vColor = color;
                vec3 pos = position;
                pos.y += sin(time + position.x * 10.0) * 0.1;
                pos.x += cos(time + position.z * 10.0) * 0.1;
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform sampler2D pointTexture;
            varying vec3 vColor;
            void main() {
                gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
            }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true
    });

    particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    camera.position.z = 5;

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();
    particleUniforms.time.value = time;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(particleSystem);

    if (intersects.length > 0) {
        const positions = particleSystem.geometry.attributes.position.array;
        const sizes = particleSystem.geometry.attributes.size.array;
        const colors = particleSystem.geometry.attributes.color.array;

        for (let i = 0; i < intersects.length; i++) {
            const index = intersects[i].index;
            sizes[index] = Math.min(sizes[index] + 0.5, 10);
            colors[index * 3] = 1.0;
            colors[index * 3 + 1] = 0.8;
            colors[index * 3 + 2] = 0.0;
        }

        particleSystem.geometry.attributes.size.needsUpdate = true;
        particleSystem.geometry.attributes.color.needsUpdate = true;
    }

    particleSystem.rotation.y += 0.001;

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();

// GSAP animations
gsap.from(".content", {
    duration: 1.5,
    opacity: 0,
    y: 50,
    ease: "power3.out"
});

gsap.from("h1", {
    duration: 1,
    opacity: 0,
    y: -50,
    ease: "back.out(1.7)",
    delay: 0.5
});

gsap.from(".cta-button", {
    duration: 1.2,
    scale: 0,
    ease: "elastic.out(1, 0.3)",
    delay: 1.5
});

gsap.from(".feature-item", {
    duration: 0.8,
    opacity: 0,
    x: 20,
    stagger: 0.1,
    ease: "power2.out",
    delay: 1
});

gsap.from(".team-image", {
    duration: 1.5,
    opacity: 0,
    scale: 0.8,
    ease: "power3.out",
    delay: 0.8
});

gsap.from(".tech-item", {
    duration: 0.8,
    opacity: 0,
    y: 20,
    stagger: 0.1,
    ease: "power2.out",
    delay: 1.2
});

gsap.from(".quote", {
    duration: 1,
    opacity: 0,
    x: -30,
    ease: "power2.out",
    delay: 1.5
});

gsap.from("footer", {
    duration: 1,
    opacity: 0,
    y: 30,
    ease: "power2.out",
    delay: 2
});

// Animated text
const phrases = ["创新 • 激情 • 团队", "探索 • 成长 • 突破", "梦想 • 实践 • 成就"];
let currentIndex = 0;
const changingText = document.getElementById("changingText");

function changeText() {
    gsap.to(changingText, {
        duration: 0.5,
        opacity: 0,
        y: -20,
        ease: "power2.in",
        onComplete: () => {
            changingText.textContent = phrases[currentIndex];
            currentIndex = (currentIndex + 1) % phrases.length;
            gsap.to(changingText, {
                duration: 0.5,
                opacity: 1,
                y: 0,
                ease: "power2.out"
            });
        }
    });
}

setInterval(changeText, 3000);
