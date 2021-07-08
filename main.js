// import * as THREE from 'last_resort\\node_modules\\three\\build\\three.module.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.114/build/three.module.js'
// import * as dat from 'dat.gui'
// import * as THREE from "https://threejs.org/build/three.module.js";
// import { OrbitControls } from "last_resort\\node_modules\\three\\examples\\jsm\\controls\\OrbitControls.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.114.0/examples/jsm/controls/OrbitControls.js'
// import { GLTFLoader } from 'C:\\last_resort\\node_modules\\three\\examples\\jsm\\loaders\\GLTFLoader.js';
// import { FBXLoader } from 'last_resort\\node_modules\\three\\examples\\jsm\\loaders\\FBXLoader.js';
import { FBXLoader } from  'https://cdn.jsdelivr.net/npm/three@0.114.0/examples/jsm/loaders/FBXLoader.js'
import {Clock} from 'https://cdn.jsdelivr.net/npm/three@0.114.0/src/core/Clock.js'
// import {Clock} from 'last_resort\\node_modules\\three\\src\\core\\Clock'
// import {OrbitControls} from 'C:\\Windows\\System32\\node_modules\\three\\examples\\jsm\\controls\\OrbitControls'
// import {FBXLoader} from 'C:\\Windows\\System32\\node_modules\\three\\examples\\jsm\\loaders\\FBXLoader.js'
// var FBXLoader = require('three-fbx-loader'); 
// var loader = new FBXLoader();
const loader = new FBXLoader()
// const loader = new THREE.ObjectLoader()
// const loader = new GLTFLoader()
const twopi = Math.PI*2
const world = {
	box: {
		a:2,
		b:3,
		c:32,
		d:6,
		e:6.3,
		f:6,
		g:6.3,
		speed:0.2,
		width: 600,
		height_segments: 10,
		width_segments: 10,
		red: 140,
		green: 206,
		blue: 235,
		character_position:2
		
	}
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, innerWidth / innerHeight, 0.1, 1000)
const render = new THREE.WebGLRenderer()
// const gui = new dat.GUI()
const camera_position = {x: -9.976490534470582, 
			y: 6.318006965318281, 
			z: 7.422031403348987}

const texture_loader = new THREE.TextureLoader();
    const texture = texture_loader.load(
      'city.jpg',
      () => {
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(render, texture);
        scene.background = rt.texture;
      });
let prev_state = -100;


camera.position.y = camera_position.y 
camera.position.z = camera_position.z
camera.position.x = camera_position.x



new OrbitControls(camera, render.domElement)

render.setSize(innerWidth, innerHeight)
render.setPixelRatio(devicePixelRatio)
document.body.appendChild(render.domElement)


function random_range(min, max){
	return Math.random()*(max-min+1) + min
}
let second_random_position = []
let number_enemies = 9
const random_position = []

for(let i = 0;i<=number_enemies;i++){
		
		if(random_position.length>0){
			let random = random_range(random_position[random_position.length-1]+20, random_position[random_position.length-1]+30)	
			random_position.push(random)
		}
		else{
			random_position.push(random_range(40,50))
		}
	}

let single = false
let double = false
let triple = false
function random_position_generator(){
	let farest_enemy = 0
	for(let i = 0;i<=random_position.length;i++){
		const enemy = scene.getObjectByName(i)
		if(farest_enemy < enemy.position.x){
			farest_enemy = enemy.position.x
		}
	}
	// console.log(farest_enemy)
	const second_enemy_chance = 0.5
	const third_enemy_chance = 0.25
	const random = Math.random()

	

	if(random<=third_enemy_chance && single == false && double == true && triple == false){
		single = false
		double = false
		triple = true
		return random_range(farest_enemy+1,farest_enemy+3)
	}
	else if(random<=second_enemy_chance && single == true && triple == false && double == false){
		single = false
		double = true
		triple = false
		return random_range(farest_enemy+1,farest_enemy+5)
	}
	else{
		single = true
		double = false
		triple = false
		return random_range(farest_enemy+15,farest_enemy+40)
	}
	// console.log(random)
	
}

loader.setPath('model/')
loader.load('stop.fbx',(fbx)=>{
	
	const geometry_stop = fbx.children[1].geometry

	const material_stop = fbx.children[1].material
	for(let i = 0; i <= random_position.length; i++){
		const stop_sign = new THREE.Mesh(geometry_stop, material_stop)
		stop_sign.position.set(random_position[i], 0, 0)
		stop_sign.name = i+100
		stop_sign.rotateX(-Math.PI/2)

		stop_sign.rotateZ(Math.PI/2)
		stop_sign.scale.setScalar(0.5)
		scene.add(stop_sign)
	}
	
})


// scene.add(stop_sign)
for(let i = 0; i <= random_position.length; i++){
		const hindrance_geometry = new THREE.BoxGeometry(1,3,1)
		const hindrance_material = new THREE.MeshPhongMaterial({
			'color': 0x00ff00})

		const hindrance_mesh = new THREE.Mesh(hindrance_geometry, hindrance_material)
		

		// stop_sign.name = (i+100)
		hindrance_mesh.name = i

		hindrance_mesh.position.set(random_position[i], 2, 0)
		// stop_sign.position.set(random_position[i], 2, 0)
		
		scene.add(hindrance_mesh)
		// scene.add(stop_sign)
	}




	



// console.log(group)



const road_texture = texture_loader.load('road.jpg')
road_texture.wrapT = THREE.RepeatWrapping

const box_geometry = new THREE.BoxGeometry(world.box.width,1,7)
const box_material = new THREE.MeshPhongMaterial({
	map:road_texture,
	side:THREE.DoubleSide
})
const road_mesh = new THREE.Mesh(box_geometry, box_material)

scene.add(road_mesh)



const character_geometry = new THREE.SphereGeometry(world.box.a,world.box.b,world.box.c,world.box.d,world.box.e,world.box.f,world.box.g)
const character_material = new THREE.MeshPhongMaterial({

	'color': 0x156289
})


const character_mesh = new THREE.Mesh(character_geometry, character_material)




character_mesh.position.set(0,10,0)
const edges = new THREE.EdgesGeometry( character_geometry );
const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );

// line.position.set(0,10,0)
// scene.add( line )
// scene.add(character_mesh)

	




const mouse = {
	x: undefined,
	y: undefined
}

// function widen_box(){
	
// 	console.log(road_mesh.geometry.parameters.width)
// 	road_mesh.geometry.parameters.width = 
	
// }

// gui.add(world.box, 'width', 1, 1000).onChange(() => {
// 	road_mesh.geometry.dispose()
// 	road_mesh.geometry = new THREE.BoxGeometry(world.box.width,1,7)
// })

// gui.add(world.box, 'character_position', 0, 3).onChange(() => {
// 	wall.rotation.y = world.box.character_position
// })
// gui.add(world.box, 'red', 0, 255).onChange(() => {
	
// 	scene.background = new THREE.Color(rgbToHex(world.box.red, world.box.green, world.box.blue))

// // console.log(scene.background)	
// })
// gui.add(world.box, 'green', 0, 255).onChange(() => {
// 	scene.background = new THREE.Color(rgbToHex(world.box.red, world.box.green, world.box.blue))

	
// })
// gui.add(world.box, 'blue', 0, 255).onChange(() => {
	
// 	scene.background = new THREE.Color(rgbToHex(world.box.red, world.box.green, world.box.blue))

// })
// gui.add(world.box, 'speed', 0.1, 1).onChange(() => {
	
	
// })
const ambient_light = new THREE.AmbientLight(0x404040)
scene.add(ambient_light)
const light = new THREE.DirectionalLight()
const new_light = new THREE.DirectionalLight()
new_light.position.set(1,0,0)
new_light.castShadow = false

light.position.set(-10,5,7)
light.castShadow = true
scene.add(light)
scene.add(new_light)

function componentToHex(c) {
  var hex = Math.floor(c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// scene.background = new THREE.Color(rgbToHex(world.box.red, world.box.green, world.box.blue))


// scene.fog = new THREE.FogExp2(new THREE.Color(rgbToHex(world.box.red, world.box.green, world.box.blue))
// ,0.01)

let space = false
let double_space = false
let triple_space = false

let one = false
let two = false
let level = 15.5
let x = -3.1


let object = [];

let clock
let mixer_run;
let mixer_jump;

let jump;
let run;
loader.setPath('model/')

loader.load(
	'run.fbx',function ( gltf ) {
		gltf.scale.setScalar(0.05)
		
		scene.add(gltf)
		object = gltf
		// console.log(object)
		object.rotation.y = Math.PI/2
		mixer_run = new THREE.AnimationMixer(object);
		const clips = object.animations;
		const clip = THREE.AnimationClip.findByName( clips, 'mixamo.com' );
		run = mixer_run.clipAction( clip );
		clock = new Clock()
		run.play();

		loader.load('jump.fbx',(anim) =>{
		mixer_jump = new THREE.AnimationMixer(object)
		
		jump = mixer_jump.clipAction(anim.animations[0])
		// jump.crossFadeFrom(run,1)
		// jump.crossFadeTo(run, 0.3)
		jump.repetitions = 1
		jump.paused = true
		jump.play()
		animate()
		})
		
	})




let second_jump = false
let third_jump = false
function animate(){
	world.box.speed+=0.0000000001
	if(character_mesh.position.y==10){
		object.position.y = 0
	}
	else{
		object.position.y = character_mesh.position.y-5.5
	}
	

	if(space==true){

		run.stop()
		jump.play()
		mixer_jump.update(clock.getDelta()+(world.box.speed/15));
		if(double_space){

			if(second_jump==false){
				// jump.stop()
				jump.repetitions = 2
				second_jump = true

			}
			


		}
		if(triple_space){
			if(third_jump){
				jump.repetitions = 3
				
				third_jump = true
			}
		}


	}
	else{
		jump.stop()
		run.play()
		
		mixer_run.update(clock.getDelta()+(world.box.speed/15));
	}
	if(road_mesh.position.x <= -80){
		road_mesh.position.x = 0
	}
	if(space==true){
		
		x+= world.box.speed+0.1
		
		

		if(double_space==false){
			level = 15.5

		}

		else {
			if(one==false&&double_space==true){
				x = -2.47
				one=true
				level = character_mesh.position.y+10
			}
			else if (two==false&&triple_space==true){
				x = -2.47
				two=true
				level= character_mesh.position.y+10
			}
			
		}
					
		
		
		// console.log(triple_space)
		let y = x*x
		let position_y = ((y*-1)+level)
		

		if(space==true){	
			character_mesh.position.y = position_y}

		if(position_y<5.5){
			jump.repetitions = 1
			character_mesh.position.y = 5.5
			space=false
			double_space=false
			triple_space=false
			second_jump = false
			third_jump = false
			x =-3.1
			one = false
			two = false
		}
		// character_mesh.position.y = 
	}


	for(let i=0;i<=random_position.length;i++){
		const enemy = scene.getObjectByName(i)
		const stop_block = scene.getObjectByName(i+100)
		
		enemy.translateX(-(world.box.speed*4))
		stop_block.position.x = enemy.position.x
		if(enemy.position.x < -50){
			enemy.position.x = random_position_generator()
		}
	}

	// for(let i=0;i<=random_position.length;i++){	
	// 	const enemy = scene.getObjectByName(i)
	// 	if(enemy.position.x < -5.0){
	// 		console.log(random_position[i])
	// 		// enemy.position.x = random_position[i]
	// 	}		
	// }
	road_mesh.geometry.dispose()
	road_mesh.geometry = new THREE.BoxGeometry(world.box.width,1,7)
	road_mesh.translateX(-(world.box.speed*4))
	// console.log(camera.position)
	requestAnimationFrame(animate)
	render.render(scene, camera)
	
	// wall.rotation.y += 0.01
	// wall.rotation.x += 0.01
	// wall.rotation.z += 0.01

}


addEventListener('touchstart', (event) => {
	// mouse.x = (event.clientX/innerWidth)*2-1
	// mouse.y = ((event.clientY/ innerHeight)*2-1)*-1
	// if(event.code==='Space'){
		if(space==true){
			if(double_space==true){
				triple_space=true
			}
			double_space = true
		}
		

		
		else{
			space = true
		}

	// }

})





