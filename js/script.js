import * as THREE from '../node_modules/three/build/three.module.js'


// Texture loader
const loader = new THREE.TextureLoader()
const cross = loader.load("../static/img/z.png")


// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const radius = 0.65;  // ui: radius
const tubeRadius = 0.18;  // ui: tubeRadius
const radialSegments = 12;  // ui: radialSegments
const tubularSegments = 90;  // ui: tubularSegments
const p = 2;  // ui: p
const q = 3;  // ui: q
const geometry = new THREE.TorusKnotGeometry(
    radius, tubeRadius, tubularSegments, radialSegments, p, q);

const particlesGeometry = new THREE.BufferGeometry;
const particlesCount = 5000;

const posArray = new Float32Array(particlesCount * 3)

for(let i = 0; i< particlesCount; i++){
    posArray[i] = (Math.random() - 0.5) * 5
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

// Materials

const material = new THREE.PointsMaterial({
    size: 0.005
})

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.0075,
    map: cross,
    transparent: true,
})
material.color = new THREE.Color(0xffffff)

// Mesh
const thing = new THREE.Points(geometry,material)
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)

scene.add(thing, particlesMesh)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#000025'), 1)

// MOUSE

document.addEventListener('mousemove', animateParticles)
let mouseX = 0
let mouseY = 0

function animateParticles(event) {
    mouseX = event.clientX
    mouseY = event.clientY
}


/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    const speed = 0.2
    thing.rotation.y = speed * elapsedTime
    thing.rotation.x = speed * elapsedTime
    thing.rotation.z = speed * elapsedTime

    particlesMesh.rotation.y = -0.15 * elapsedTime
    if(mouseX > 0){
        particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00005)
        particlesMesh.rotation.y = mouseX * (elapsedTime * 0.00005)
    }
    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()