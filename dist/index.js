var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

//import * as THREE from '/js/three.module.js';


//			import { OrbitControls } from '/jsm/controls/OrbitControls.js';
			import { PCDLoader } from './jsm/loaders/PCDLoader.js';
//            import { MapControls } from '/jsm/controls/OrbitControls.js';
            import { TWEEN } from './js/tween.module.min.js';
            import { PositionalAudioHelper } from './jsm/PositionalAudioHelper.js';

			let camera, controls, scene, renderer, mouse;
            
            let raycaster, intersects;
            let pointclouds,intersection = null;
			let clock;
			let toggle = 0;
            
            const pointer = new THREE.Vector2();
            const threshold = 0.1;
            const length = 160;
            const pointSize = 0.000000000001;
			



            var mapCamera, mapWidth = 240, mapHeight = 160; // w/h should match div dimensions

            $('#container').hide();
            $('#startButton').click(function() {;
               letsGo();
               console.log('wow');
              $('#startButton').hide();
              $('#container').show();
                                                    
                                            
                     });
            
            function letsGo(){
            init();
			render();
            animate();
            };

			function init() {

				renderer = new THREE.WebGLRenderer( { antialias: true } );
                
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 40 );
                camera.lookAt( new THREE.Vector3(1,0,2));
                camera.position.set( 0, 0, 0 );
                
				scene.add( camera );
                
                //mouse
                
                mouse = new THREE.Vector2();
                raycaster = new THREE.Raycaster();
                raycaster.params.Points.threshold = threshold;
                
            
                

                
                
				// controls

				controls = new THREE.OrbitControls( camera, renderer.domElement );
                
				//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
                controls.target = new THREE.Vector3(1,0,2);
				controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
				controls.dampingFactor = 0.08;

				controls.screenSpacePanning = false;

				controls.minDistance = 0.001;
				controls.maxDistance = 10;
//                controls.autoRotate = true;
                
       
//				controls.maxPolarAngle = Math.PI*2 ;

//				scene.add( new THREE.AxesHelper( 1 ) );
                
                const modelGroup = new THREE.Group();
				const loader = new PCDLoader();
                
                    loader.load( './models/8.pcd', function ( points3 ) {
                    points3.material.vertexColors = THREE.NoColors;
					points3.material.size = pointSize;
//                	points.geometry.rotateX( Math.PI );
                    points3.position.set(10, -5, 30);
				    modelGroup.add( points3 );
                    scene.add( modelGroup );
                	render();

				} );
                
                
				loader.load( './models/6.pcd', function ( points ) {
                    points.material.vertexColors = THREE.NoColors;
                    points.position.set(0, 1, 0);
                    points.material.size = pointSize;
					points.geometry.center();
                    
					//points.geometry.rotateX( Math.PI );
                    
					modelGroup.add( points );
                    scene.add( modelGroup );
					render();

				} );
                    loader.load( './models/7.pcd', function ( plant ) {
                    plant.material.vertexColors = THREE.NoColors;
                    plant.material.size = pointSize;
                    const modelGroup = new THREE.Group();
                    plant.position.set(2, 0.5, 3);
                    plant.yo = 'אהלן';
                    scene.add( plant );
					render(); 

				} );
          
                
                    loader.load( './models/9.pcd', function ( truck ) {
                    truck.material.vertexColors = THREE.NoColors;
					truck.material.size = pointSize;
//                	points.geometry.rotateX( Math.PI );
                    truck.position.set(35, 3, 15);
				    modelGroup.add( truck );
                    scene.add( modelGroup );
                	render();

				} );
                
                
//                let gridHelper = new THREE.GridHelper( 100, 500 );
//                gridHelper.material.color.setHex( 0xff582b );
//                gridHelper.position.set(0, 0, -3);
//		          modelGroup.add( gridHelper );
                
                //
              
                const audioLoader = new THREE.AudioLoader();
		      const listener = new THREE.AudioListener();
		      camera.add( listener );
               
                
                const soundList = ['mp3/story.mp3','mp3/truck.mp3'];
                const positionalAudio = new THREE.PositionalAudio( listener );
			    audioLoader.load( soundList[0], function ( buffer ) {

				positionalAudio.setBuffer( buffer );
				positionalAudio.setRefDistance( 1 );
				positionalAudio.loop = true;
				positionalAudio.play();
                positionalAudio.setDistanceModel = 'inverse';
                positionalAudio.setMaxDistance = 0.01;
				positionalAudio.setDirectionalCone( 180, 230, 0.1 );
                positionalAudio.position.x = 35;
				positionalAudio.position.y = 3;
				positionalAudio.position.z = 15;

				const helper = new PositionalAudioHelper( positionalAudio, 1 );
                helper.scale.set( 1, 1, 1 );
			     positionalAudio.add( helper );

				
			} );
                const positionalAudio2 = new THREE.PositionalAudio( listener );
                audioLoader.load( soundList[1], function ( buffer ) {

				positionalAudio2.setBuffer( buffer );
				positionalAudio2.setRefDistance( 1 );
				positionalAudio2.loop = true;
				positionalAudio2.play();
                positionalAudio2.setDistanceModel = 'inverse';
                positionalAudio2.setMaxDistance = 0.01;
				positionalAudio2.setDirectionalCone( 180, 230, 0.1 );
                positionalAudio2.position.x = 34;
				positionalAudio2.position.y = 3;
				positionalAudio2.position.z = 16;

				const helper = new PositionalAudioHelper( positionalAudio, 1 );
                helper.scale.set( 1, 1, 1 );
			     positionalAudio2.add( helper );

				
			} );
                
                   //
                
                
                
                /////minimap
                
               
                
                
                
                
                /////

				window.addEventListener( 'resize', onWindowResize );

				window.addEventListener( 'keypress', keyboard );
                document.addEventListener( 'mousemove', onMouseMove );
                controls.addEventListener( 'change', cameraMove );


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
                    case 'Enter':
                        let x = parseFloat(document.getElementById("numbX").value);
                        let y = parseFloat(document.getElementById("numbY").value);
                        let z = parseFloat(document.getElementById("numbZ").value);
                        lookAtPoint(x,y,z);
                        break;
                    case 'a':
                        cameraStae();
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
                    
                    intersects[i].object.material.color.setHex( 0xff582b );
                    document.getElementById("p1").innerHTML = intersects[i].object.yo;
                    
                    
                }
            }

//

           function lookAtPoint(x,y,z) {
                    
                 
                
                  
//                    const oldTargetPosition = controls.target.clone();
                    console.log(camera.position);
//             controls.enabled = false;
                    var duration = 2500;
                    var position = new THREE.Vector3().copy(camera.position);
                    var lookAt = new THREE.Vector3().copy(controls.target);
                    var targetPosition = new THREE.Vector3(x-1, y+1, z-2);
                    var targetLookAt = new THREE.Vector3(x, y, z);
                    var tween = new TWEEN.Tween(position)
                        .to(targetPosition, duration)
                        .easing( TWEEN.Easing.Cubic.InOut )
                        .onUpdate(function () {
                            camera.position.copy(position);
//                            controls.target = lookAt;
//                            camera.lookAt( controls.target );
                        })
                        .onComplete(function () {

                            camera.position.copy( targetPosition );
//                            controls.target = targetLookAt;
//                            camera.lookAt( controls.target );
                            controls.enabled = true;
                        })
                    .start();
   
                
                    var tween = new TWEEN.Tween(lookAt)
                        .to(targetLookAt, duration)
                        .easing( TWEEN.Easing.Cubic.InOut )
                        .onUpdate(function () {
                            controls.target = lookAt;
                            camera.lookAt( controls.target );
                        })
                        .onComplete(function () {

                            
                            controls.target = targetLookAt;
                            camera.lookAt( controls.target );
                            
                        })
                    .start();
   
                }

           function goToIsland(x,y,z) {
                    
                 
                
                  
//                    const oldTargetPosition = controls.target.clone();
                    console.log(camera.position);
//             controls.enabled = false;
                    var duration = 2500;
                    var position = new THREE.Vector3().copy(camera.position);
                    var lookAt = new THREE.Vector3().copy(controls.target);
                    var targetPosition = new THREE.Vector3(x, y+10, z);
                    var targetLookAt = new THREE.Vector3(x, y, z);
                    var tween = new TWEEN.Tween(position)
                        .to(targetPosition, duration)
                        .easing( TWEEN.Easing.Cubic.InOut )
                        .onUpdate(function () {
                            camera.position.copy(position);
//                            controls.target = lookAt;
//                            camera.lookAt( controls.target );
                        })
                        .onComplete(function () {

                            camera.position.copy( targetPosition );
//                            controls.target = targetLookAt;
//                            camera.lookAt( controls.target );
                            controls.enabled = true;
                        })
                    .start();
   
                
                    var tween = new TWEEN.Tween(lookAt)
                        .to(targetLookAt, duration)
                        .easing( TWEEN.Easing.Cubic.InOut )
                        .onUpdate(function () {
                            controls.target = lookAt;
                            camera.lookAt( controls.target );
                        })
                        .onComplete(function () {

                            
                            controls.target = targetLookAt;
                            camera.lookAt( controls.target );
                            
                        })
                    .start();
   
                }

                function cameraStae(){
                    let posX = camera.position.x.toFixed(1);
                    let posY = camera.position.y.toFixed(1);
                    let posZ = camera.position.z.toFixed(1);

                    let rotX = camera.rotation.x.toFixed(1);
                    let rotY = camera.rotation.y.toFixed(1);
                    let rotZ = camera.rotation.z.toFixed(1);

                    let tarX = controls.target.x.toFixed(1);
                    let tarY = controls.target.y.toFixed(1);
                    let tarZ = controls.target.z.toFixed(1);
                    
                     document.getElementById("data").innerHTML = 'Position:   '+posX+' , '+posY+' , '+posZ+'<br>'+'Target:   '+ tarX+' , '+tarY+' , '+tarZ;
                }

            function cameraMove(){
                 cameraStae();
            }

            



//
            	function animate() {
				
				 // only required if controls.enableDamping = true, or if controls.autoRotate = true
                resetObject();
                hoverObject();
				camera.updateProjectionMatrix();
                requestAnimationFrame(animate);
                TWEEN.update();
                render();

			}
			function render() {
                controls.update();
				renderer.render( scene, camera );
              


			}





////// Navigation script 

                const islandPositions = []

                $( ".icon" ).click(function() {
              lookAtPoint(1,5,3);
            });







