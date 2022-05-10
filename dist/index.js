import { OrbitControls } from 'https://unpkg.com/three@0.140.0/examples/jsm/controls/OrbitControls.js';
import { PCDLoader } from 'https://unpkg.com/three@0.140.0/examples//jsm/loaders/PCDLoader.js';
import * as THREE from 'https://unpkg.com/three@0.140.0/build/three.module.js';
const canvas = document.querySelector('canvas.webgl');

let camera, controls, scene, renderer, mouse;
            
            let raycaster, intersects;
            let pointclouds,intersection = null;
			let clock;
			let toggle = 0;
            
            const pointer = new THREE.Vector2();
            const threshold = 0.1;
            const length = 160;
			

			init();
			render();
            animate();

			function init() {

				renderer = new THREE.WebGLRenderer( { antialias: true } );
                
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 40 );
                camera.position.set( 2, 2, 1 );
                
				scene.add( camera );
                
                //mouse
                
                mouse = new THREE.Vector2();
                raycaster = new THREE.Raycaster();
                raycaster.params.Points.threshold = threshold;
                
                //cubes
                
                const geometry = new THREE.CapsuleGeometry( 0.1, 0.05, 4, 8 );
                const cube = new THREE.Mesh( geometry );
                cube.material = new THREE.MeshBasicMaterial({ color: 0xAE0000 });
                cube.position.set(3,0,2);
                cube.yo = 'אהלן';
                
                scene.add( cube );
                

                
                
				// controls

				controls = new OrbitControls( camera, renderer.domElement );

				//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

				controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
				controls.dampingFactor = 0.08;

				controls.screenSpacePanning = false;

				controls.minDistance = 0.1;
				controls.maxDistance = 1000;

				controls.maxPolarAngle = Math.PI / 2;

				//scene.add( new THREE.AxesHelper( 1 ) );

				const loader = new PCDLoader();
				loader.load( '/models/6.pcd', function ( points ) {
                    points.material.vertexColors = THREE.NoColors;
					points.geometry.center();
                    
					//points.geometry.rotateX( Math.PI );
                    const modelGroup = new THREE.Group();
					modelGroup.add( points );
                    scene.add( modelGroup );
					render();

				} );
                    loader.load( '/models/7.pcd', function ( points2 ) {
                    points2.material.vertexColors = THREE.NoColors;
					//points2.geometry.center();
                    //points.position.set(0,0,0);
					//points.geometry.rotateX( Math.PI );
                    const modelGroup = new THREE.Group();
                    
					//modelGroup.add( points2 );
                    scene.add( points2 );
					render();

				} );
                
                //
                
                
                
                
				
                
                
                //

				window.addEventListener( 'resize', onWindowResize );

				window.addEventListener( 'keypress', keyboard );
                document.addEventListener( 'mousemove', onMouseMove );


			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}
            
            function onMouseMove( event ) {

				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			}

			function keyboard( ev ) {

				const points = scene.getObjectByName( '6.pcd' );

				switch ( ev.key || String.fromCharCode( ev.keyCode || ev.charCode ) ) {

					case '+':
						points.material.size *= 1.2;
						break;

					case '-':
						points.material.size /= 1.2;
						break;

					case 'c':
						points.material.color.setHex( Math.random() * 0xffffff );
						break;

				}

				render();

			}
            function resetObject(){
                document.getElementById("p1").innerHTML = "";
                for (let i = 0; i < scene.children.length; i++){
                    if (scene.children[i].material){
                        scene.children[i].material.color.setHex( 0xffffff );
                        }
                
                }
            }
            
            function hoverObject(){
                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(scene.children, false);
                for (let i = 0; i < intersects.length; i++){
                    
                    intersects[i].object.material.color.setHex( 0x0EEEEE );
                    document.getElementById("p1").innerHTML = intersects[i].object.yo;
                    
                    
                }
            }

            	function animate() {

				requestAnimationFrame( animate );

				controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
                resetObject();
                hoverObject();
				render();

			}
			function render() {

				renderer.render( scene, camera );
              


			}
