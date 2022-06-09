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
            const pointSize = 1/5000;
			




            var mapCamera, mapWidth = 240, mapHeight = 160; // w/h should match div dimensions

            $('#container').hide();
            $('#startButton').click(function() {;
               letsGo();
             $('#splash').fadeOut();
            $('#container').fadeIn();
                                                    
                                            
                     });

             //dictionary
                
                let islands = {
                    "tombs": [12, 2, 5],
                    "parking": [3, 0, 40],
                    "plant": [2, 0.5, 3],
                    "stairs": [25, 20, 20],
                    "truck":[45, 3, 25],
                    "yotam": [0,5,20],
                    "yuval": [35,8,0],
                    "ben": [45,6,50]
                    
                };

                ///
            

            
            init();


            function letsGo(){
            initSound();
			render();
            animate();
            };

            var tombsGeomety;

			function init() {

				renderer = new THREE.WebGLRenderer( { antialias: true } );
                
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 40 );
                camera.maxPolarAngle = 0;
                camera.panSpeed = 10;
                camera.lookAt( new THREE.Vector3(1,0,40));
                camera.position.set( 7, 2, 40 );
                
				scene.add( camera );
                
                //mouse
                
                mouse = new THREE.Vector2();
                raycaster = new THREE.Raycaster();
                raycaster.params.Points.threshold = threshold;
                
            
                

                
                
				// controls

				controls = new THREE.OrbitControls( camera, renderer.domElement );
                
				//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
                controls.target = new THREE.Vector3(1,0,40);
				controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
				controls.dampingFactor = 0.08;

				controls.screenSpacePanning = false;

				controls.minDistance = 1;
				controls.maxDistance = 8;
                controls.autoRotate = false;
                controls.autoRotateSpeed = 0.5;
                
                
          

       
//				controls.maxPolarAngle = Math.PI*2 ;

//				scene.add( new THREE.AxesHelper( 1 ) );
                
                
                var manager = new THREE.LoadingManager();
                manager.onProgress = function ( item, loaded, total ) {
//                  progressBar.style.width = (loaded / total * 100) + '%';
                    $('#loader').text(Math.trunc(loaded / total * 100) + '%');
                };
                manager.onLoad = function ( ) {
                    
                $('#loader').fadeOut('slow').promise().done(function(){
               $('#startButton').fadeIn('slow');
            });

            };


                
                const modelGroup = new THREE.Group();
                const loader = new PCDLoader(manager);
                
                let truck, plant, points;
                
                    loader.load( './models/8.pcd', function ( parking ) {
                    parking.material.vertexColors = THREE.NoColors;
                        parking.material.color.setHex( 0xecebe6 );
					parking.material.size = pointSize;
                    const pos = islands['parking'];
                    parking.position.set(pos[0],pos[1],pos[2]);
				    modelGroup.add( parking );
                    scene.add( modelGroup );
                	render();

				} );
                
                
				loader.load( './models/6.pcd', function ( tombs ) {
                    tombs.material.vertexColors = THREE.NoColors;
                    tombs.material.color.setHex( 0xecebe6 );
                    const pos = islands['tombs'];
                    tombs.position.set(pos[0],pos[1],pos[2]);
                    tombs.material.size = pointSize;
//                    tombs.material = m;
					tombs.geometry.center();
                    tombs.name = 'tombs';
                    modelGroup.add( tombs );
                    scene.add( modelGroup );
					render();

				} );
//                    loader.load( './models/7.pcd', function ( plant ) {
//                    plant.material.vertexColors = THREE.NoColors;
//                        plant.material.color.setHex( 0xecebe6 );
//                    plant.material.size = pointSize;
//                    const modelGroup = new THREE.Group();
//                    const pos = islands['plant'];
//                    const pos = islands['plant'];
//                    plant.position.set(pos[0],pos[1],pos[2]);
//                    plant.name = 'plant';
//                    plant.yo = 'אהלן';
//                    scene.add( plant );
//					render(); 
//
//				} );
                
                    loader.load( './models/stairs.pcd', function ( stairs ) {
                    stairs.material.vertexColors = THREE.NoColors;
                        stairs.material.color.setHex( 0xecebe6 );
                    stairs.material.size = pointSize;
                    const modelGroup = new THREE.Group();
                    const pos = islands['stairs'];
                    stairs.position.set(pos[0],pos[1],pos[2]);
                    stairs.name = 'stairs';
                    modelGroup.add( stairs );
                    scene.add( modelGroup );
					render(); 

				} );
          
                
                    loader.load( './models/9.pcd', function ( truck ) {
                    truck.material.vertexColors = THREE.NoColors;
                        truck.material.color.setHex( 0xecebe6 );
					truck.material.size = pointSize;
//                	points.geometry.rotateX( Math.PI );
                    const pos = islands['truck'];
                    truck.position.set(pos[0],pos[1],pos[2]);
				    modelGroup.add( truck );
                    scene.add( modelGroup );
                	render();

				} );
                
                    loader.load( './models/yotam.pcd', function ( yotam ) {
                    yotam.material.vertexColors = THREE.NoColors;
                        yotam.material.color.setHex( 0xecebe6 );
					yotam.material.size = pointSize;
                    const pos = islands['yotam'];
                    yotam.position.set(pos[0],pos[1],pos[2]);
				    modelGroup.add( yotam );
                    yotam.rotation.y = 180;
                    scene.add( modelGroup );
                	render();

				} );
                
                    loader.load( './models/yuval.pcd', function ( yuval ) {
                    yuval.material.vertexColors = THREE.NoColors;
                        yuval.material.color.setHex( 0xecebe6 );
					yuval.material.size = pointSize;
                    const pos = islands['yuval'];
                    yuval.position.set(pos[0],pos[1],pos[2]);
				    modelGroup.add( yuval );
                    scene.add( modelGroup );
                	render();

				} );
                    loader.load( './models/ben.pcd', function ( ben ) {
                    ben.material.vertexColors = THREE.NoColors;
                        ben.material.color.setHex( 0xecebe6 );
					ben.material.size = pointSize;
                    const pos = islands['ben'];
                    ben.position.set(pos[0],pos[1]-4,pos[2]);
                    ben.rotation.y = 270;
				    modelGroup.add( ben );
                    scene.add( modelGroup );
                	render();

				} );
                
                
//                let gridHelper = new THREE.GridHelper( 100, 500 );
//                gridHelper.material.color.setHex( 0xff582b );
//                gridHelper.position.set(0, 0, -3);
//		          modelGroup.add( gridHelper );
                
                //
              

                    
     

                }  
                    
                    
                    
                    



                function initSound(){
                const audioLoader = new THREE.AudioLoader();
                const listener = new THREE.AudioListener();
		        camera.add( listener );
               
                
                    
                const newSounds = [ 

                    {file:'mp3/parking/story.mp3', x:0, y:0, z:47, radius:5},
                    {file:'mp3/parking/fx.mp3', x:10, y:0, z:36, radius:5},
                    {file:'mp3/parking/music.mp3', x:3, y:0, z:29, radius:5},
                    {file:'mp3/ben/story.mp3', x:45, y:6, z:48, radius:5},
                    {file:'mp3/ben/story.mp3', x:18, y:5, z:47, radius:3},
                     {file:'mp3/ben/fx.mp3', x:24, y:6, z:52, radius:5,volume:8},
                    {file:'mp3/ben/piano.mp3', x:60.7, y:6, z:52, radius:3,volume:8},
                    {file:'mp3/stairs/story4.mp3', x:22, y:18, z:19, radius:5},
                    {file:'mp3/stairs/story3.mp3', x:25, y:12, z:19, radius:5},
                    {file:'mp3/stairs/story2.mp3', x:24, y:6, z:20, radius:5},
                    {file:'mp3/stairs/story1.mp3', x:22, y:1, z:20, radius:5},
                    {file:'mp3/stairs/music.mp3', x:24, y:10, z:20, radius:2},
                    {file:'mp3/stairs/cat.mp3', x:22, y:3, z:19, radius:6},
                    {file:'mp3/stairs/washing.mp3', x:25, y:7, z:17.4, radius:5},
                    {file:'mp3/stairs/neighbors.mp3', x:23, y:12, z:19, radius:5},
                    {file:'mp3/stairs/roof.mp3', x:26, y:19, z:29, radius:3,volume:6},
                    {file:'mp3/tombs/story.mp3', x:19, y:1, z:5, radius:5, volume:2},
                    {file:'mp3/tombs/fx.mp3', x:10, y:4, z:3, radius:5,volume:2},
                    {file:'mp3/tombs/fx2.mp3', x:12, y:2, z:10, radius:2,volume:6},
                    {file:'mp3/truck/music.mp3', x:42, y:3, z:30, radius:5, volume:3},
                    {file:'mp3/truck/story.mp3', x:52, y:4, z:20, radius:4, volume:7},
                    {file:'mp3/truck/truck.mp3', x:50, y:2, z:26, radius:5, volume:2},
                     {file:'mp3/yuval/music1.mp3', x:33.8, y:8, z:-2.2, radius:5, volume:3},
                    {file:'mp3/yuval/music2.mp3', x:36.4, y:9, z:3, radius:5, volume:3},
                    {file:'mp3/yuval/fx.mp3', x:39.2, y:4, z:2.3, radius:5, volume:2},
                    {file:'mp3/yotam/music.mp3', x:2.3, y:5, z:20.8, radius:5, volume:5},
                    {file:'mp3/yotam/fx.mp3', x:-1.5, y:5, z:18.6, radius:5, volume:5},

                    ];
                    

                newSounds.forEach(function(sound) {
                const positionalAudio = new THREE.PositionalAudio( listener );
                audioLoader.load( sound.file, function ( buffer ) {
                positionalAudio.setBuffer( buffer );
                positionalAudio.setRefDistance( 0.5 );
                positionalAudio.loop = true;
                positionalAudio.setRolloffFactor(sound.radius);
                positionalAudio.setVolume(( sound.volume || 5 ));
                positionalAudio.setMaxDistance( 10 );
                positionalAudio.play();
                });
                const audioObject = new THREE.Object3D;
                audioObject.position.set(sound.x, sound.y,sound.z);
                audioObject.add(positionalAudio);
                scene.add(audioObject);
                })
                    
                    
                    
                    
                    
                    
                    
                    

                
    

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

             controls.enabled = false;
                    var duration = 2500;
                    var position = new THREE.Vector3().copy(camera.position);
                    var lookAt = new THREE.Vector3().copy(controls.target);
                    var targetPosition = new THREE.Vector3(x+1, (y+0.5)*1.2, z+1);
                    var targetLookAt = new THREE.Vector3(x, y, z);
                    var tween = new TWEEN.Tween(position)
                        .to(targetPosition, duration)
                        .easing( TWEEN.Easing.Cubic.InOut )
                        .onUpdate(function () {
                            camera.position.copy(position);

                        })
                        .onComplete(function () {
                            camera.position.copy( targetPosition );
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
//                    console.log(camera.position);
//             controls.enabled = false;
                    var duration = 3500;
                    var position = new THREE.Vector3().copy(camera.position);
                    var lookAt = new THREE.Vector3().copy(controls.target);
                    var targetPosition = new THREE.Vector3(x+0.5, y+10, z+0.2);
                    var finalPosition = new THREE.Vector3(x+1, y+1, z+1);
                    var targetLookAt = new THREE.Vector3(x, y, z);
                    var tween = new TWEEN.Tween(position)
                        .to(targetPosition, duration)
                        .easing( TWEEN.Easing.Cubic.InOut )
                        .onUpdate(function () {
                            camera.position.copy(position);

                        })
                        .onComplete(function () {

                            camera.position.copy( targetPosition );

//                            controls.enabled = true;
                        })
                    
//                    .start();
               
                    var tweenA = new TWEEN.Tween(lookAt)
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
//                    .start();
   
              
               
              
               
                    var tweenB = new TWEEN.Tween(position)
                        .to(finalPosition, 3500)
                        .easing( TWEEN.Easing.Cubic.Out )
                        .onUpdate(function () {
                            camera.position.copy(position);

                        })
                        .onComplete(function () {

                            camera.position.copy( finalPosition );

                            controls.enabled = true;
                        })
                 
                     tween.chain(tweenB);
                    tween.start();
                    tweenA.start();
   
                  }
         

           

                function cameraStae(){
                    let posX = camera.position.x.toFixed(1);
                    let posY = camera.position.y.toFixed(1);
                    let posZ = camera.position.z.toFixed(1);

                    let rotX = camera.rotation.x.toFixed(1);
                    let rotY = camera.rotation.y.toFixed(1);
                    let rotZ = camera.rotation.z.toFixed(1);

                    var tarX = controls.target.x.toFixed(1);
                    let tarY = controls.target.y.toFixed(1);
                    var tarZ = controls.target.z.toFixed(1);
                    
                    document.getElementById("data").innerHTML = 'Position:   '+posX+' , '+posY+' , '+posZ+'<br>'+'Target:   '+ tarX+' , '+tarY+' , '+tarZ;
                    boundries(tarX,tarY,tarZ);
               
                }



                     const islandsBoundries =[
                    {name: 'עבר האגרון הצפוני', minX: 7, maxX: 27, minY: 0, maxY:6, minZ: -1, maxZ: 10},
                    {name: 'בקעת הסובלנות התיכונה', minX: 35, maxX: 55, minY: 0, maxY:9, minZ: 19, maxZ: 30},
                    {name: 'חבל יהודה הדרומי', minX: 7, maxX: 88, minY: 5, maxY:12, minZ: 36, maxZ: 67},
                     {name: 'חולות מישור לאונרדו', minX: 0, maxX: 16, minY: 0, maxY:8, minZ: 30, maxZ: 54},
                      {name: 'מעלות ג׳ורג׳ מספר 33', minX:21, maxX: 28, minY: 0, maxY:50, minZ: 18, maxZ: 28},
                      {name: 'שמואל הנגיד מספר 19', minX: 0, maxX: 3, minY: 4, maxY:10, minZ: 16, maxZ: 21},
                        {name: 'אוסישקין<br> מספר 42', minX: 32, maxX: 39, minY: 6, maxY:12, minZ: -5, maxZ: 7}
                    ];

                    const pointCaptions = [
                           { text: 'בחורשה היה מעט דשא ומעט דשא סינטטי', x: 11, z: 5, y: 3 },
                              { text: 'בחורשה היו קברים מוסלמים עתיקים ובינהם היו ערמות של ספסלי רחוב',
                                x: 15,
                                z: 7,
                                y: 2 },
                              { text: 'ליד אתר הבנייה של מוזיאון הסובלנות חנתה משאית זבל מונעת שתפסה 4 חניות',
                                x: 50,
                                z: 27,
                                y: 8 },
                              { text: 'הגיעה לעברינו אישה דתייה שדיברה בטלפון עם חנה שהלכה לאיבוד',
                                x: 43,
                                z: 26,
                                y: 2 },
                              { text: ' בגן התקינו צ׳קלקה של משטרה, כמו שיש בכבישים, רק לאנשים שעושים מנגל',
                                x: 40,
                                z: 26,
                                y: 2 },
                              { text: 'עברנו ליד בניין גבוהה שבו גרים חברים של יובל',
                                x: 24,
                                z: 19,
                                y: 16 },
                              { text: 'בקומה הראשונה הייתה דלת אפורה וכבדה עם קודן',
                                x: 25,
                                z: 19,
                                y: 2 },
                              { text: 'על המדרגות הייתה מיטת חתול, וקערת בונזו אחת על כל מדרגה',
                                x: 23,
                                z: 19,
                                y: 8 },
                              { text: 'הייתה עוד דלת שסתם נשענה על הקיר וחסמה את החלון',
                                x: 21,
                                z: 18,
                                y: 17 },
                              { text: 'מולנו התגלה יער של דודי שמש מסנוורים',
                                x: 28,
                                z: 26,
                                y: 20 },
                              { text: 'על הרצפה ישב מוכר עיתונים וסביבו עמד קהל נלהב',
                                x: 64,
                                z: 47,
                                y: 6 },
                              { text: 'בהינו ממש יותר מידי זמן בבחור יהודי אמריקאי שקנה עיתון ממוכר העיתונים',
                                x: 27,
                                z: 57,
                                y: 5 },
                              { text: 'הזר שהלכנו בעקבותיו התקדם לכיוון בוטקה של מפעל הפיס',
                                x: 24,
                                z: 56,
                                y: 6 },
                              { text: 'הגענו למגרש חניה שצמוד למלון, קרוב לגן העצמאות',
                                x: 3,
                                z: 45,
                                y: 5 },
                              { text: 'בקבוק פלסטיק כחול שהיה ממש שטוח ומקובצ׳ץ׳ בגלל כל המכוניות שעברו עליו',
                                x: 3,
                                z: 47,
                                y: 0 },
                              { text: 'אישה יצא מהמלון כשהיא מגלגלת אישה מבוגרת יותר בכסא גלגלים',
                                x: 2,
                                z: 36,
                                y: 0 },
                              { text: 'בצד השני בו היה שרשרת פלסטיק שחסמה את המעבר',
                                x: 9,
                                z: 46,
                                y: 1 } ]


                    let islandTitle = null;
                    let caption = null;

                    function boundries(x,y,z){
                        
                    for(let i=0; i<islandsBoundries.length; i++){
                        const island = islandsBoundries[i];
                        
                    if(
                            island.maxX >= x &&  island.minX <= x &&
                            island.maxY  >= y &&  island.minY <=  y &&
                            island.maxZ  >=  z &&  island.minZ <= z
                        ){
                        islandTitle = island.name;
                        break;
                    }else{
                        
                    islandTitle = null
                    }}
                    for(let i=0; i<pointCaptions.length; i++){
                        const point = pointCaptions[i];
                        
                    if(
                            point.x+1 >= x &&  point.x-1 <= x &&
                            point.y+1  >= y &&  point.y-1 <=  y &&
                            point.z+1  >=  z &&  point.z-1 <= z
                        ){
                        caption = point.text;
                        
                        break;
                    }else{
                        
                    caption = null
                    }}
                        
                    if (islandTitle === null){
                       $('h1').fadeOut('slow'); 
                    }else{
                         $('h1').fadeIn('slow');
                        $('h1').html(islandTitle);
                    };
                        
               
                    if (caption === null){
                       $('#p1').fadeOut('slow'); 
                    }else{
                        $('#p1').text(caption);
                         $('#p1').fadeIn('slow');
                        
                    };
                      
                        
                    
                    
                    
                    };

            
//                    function boundries(x,y,z){
//                    islandsBoundries.forEach(function(island){
//                                    
//                                if( x >= island.minX &&  x <= island.maxX &&
//                                    y >= island.minY &&  y <= island.maxY  &&
//                                    z >= island.minZ &&  z <= island.maxZ ){
//                                    islandTitle = island.name
//                                    break;
//                                }else{
//                                    islandTitle = null;
//                                }
//                    )};
//                        console.log(islandTitle);
//                    };
//           
                


          
      
        

            function cameraMove(){
                 cameraStae();
                
//                idleTime = 0;
                
            }


         

                    var clock2 = new THREE.Clock();
                    var t = 0;
                    var delta = 0;
//
            	function animate() {
              
                     delta = clock2.getDelta();
                    t += delta;
                    
//                   m.shader.vertexShader + t
//                const geometry = scene.getObjectByName( 'tombs' ).geometry;
//                        const count = geometry.attributes.position.count;
//                        
//                        const now = Date.now() / 5000;
//                        for (let i = 0; i< count; i++) {
//                            const x = geometry.attributes.position.getX(i);
//                            const xsin = Math.sin(x+now);
//                            geometry.attributes.position.getZ(i, xsin);
//                        }
//                        geometry.attributes.position.needsUpdate = true
//                        console.log(count);
                    


				
                    
				 // only required if controls.enableDamping = true, or if controls.autoRotate = true
//                resetObject();
//                hoverObject();
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

              

                $( ".icon" ).click(function() {
                var X= parseInt($(this).attr("data-X"));
                var Y= parseInt($(this).attr("data-Y"));
                var Z= parseInt($(this).attr("data-Z"));
                const island= $(this).attr("island");
                const pos = islands[island];
//                console.log(X,Y,Z);
              goToIsland(pos[0],pos[1],pos[2]);
            });



    let x;
    let y = 1;
    let z = 5;
    
$(".drum").drum({
	max: 85,
	value: 5,
    step:1,
    acceleration: 400,
     watchOutside:true,
    orderAsc:true,
	change: function(event, data) {
        if ($(this).attr("id") === "drum-x") {
//		console.log('X: '+ data.value);
         x = data.value;
            
        }
        else if($(this).attr("id") == "drum-z"){
//         console.log('Z: '+ data.value);
         z = data.value;  
            
        } else if($(this).attr("id") == "drum-y"){
//         console.log('Y: '+ data.value);
         y = data.value;   
        };
      
        lookAtPoint(x,y,z);
	
    }
});


  let idleTime = 0;
$(document).ready(function(){
var idleInterval = setInterval(timerIncrement, 3000);
      $(this).mousemove(function (e) {
            controls.autoRotate = false;
            idleTime = 0;
        });
    
        function timerIncrement() {
       
        idleTime = idleTime + 1;
//             console.log(idleTime);
        if (idleTime > 4) { // 20 minutes
            controls.autoRotate = true;
        }else{
            controls.autoRotate = false;
        }
    } 



});



var simplexNoise = `
        //	Simplex 3D Noise 
        //	by Ian McEwan, Ashima Arts
        //
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

        float snoise(vec3 v){ 
          const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

        // First corner
          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 =   v - i + dot(i, C.xxx) ;

        // Other corners
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );

          //  x0 = x0 - 0. + 0.0 * C 
          vec3 x1 = x0 - i1 + 1.0 * C.xxx;
          vec3 x2 = x0 - i2 + 2.0 * C.xxx;
          vec3 x3 = x0 - 1. + 3.0 * C.xxx;

        // Permutations
          i = mod(i, 289.0 ); 
          vec4 p = permute( permute( permute( 
                     i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                   + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                   + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        // Gradients
        // ( N*N points uniformly over a square, mapped onto an octahedron.)
          float n_ = 1.0/7.0; // N=7
          vec3  ns = n_ * D.wyz - D.xzx;

          vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);

          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );

          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));

          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);

        //Normalise gradients
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;

        // Mix final noise value
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                        dot(p2,x2), dot(p3,x3) ) );
        }
        `;

let u = {
  time: {value: 0},
  lightPos: {value: new THREE.Vector3()}
}

let m = new THREE.PointsMaterial({
  size: 1/5000, 
  color: 0xffffff,
  //map: new THREE.TextureLoader().load("https://threejs.org/examples/textures/sprites/circle.png"),
  onBeforeCompile: shader => {
    shader.uniforms.lightPos = u.lightPos;
    shader.vertexShader = `
      uniform float time;
      uniform vec3 lightPos;
      varying float vShade;
      
      ${simplexNoise}
      
      float turbulence( vec3 p ) {

        float w = 100.0;
        float t = -.1;

        for (float f = 1.0 ; f <= 10.0 ; f++ ){
          float power = pow( 10.0, f );
          t += snoise( vec3( power * p ) )  / power ;
        }

        return t;

      }
      
      vec3 setFromSphericalCoords( float radius, float phi, float theta ) {
        float sinPhiRadius = sin( phi ) * radius;
        vec3 v = vec3( sinPhiRadius * sin( theta ), cos( phi ) * radius, sinPhiRadius * cos( theta ) );
        return v;
      }
      
      vec2 setFromCartesianCoords( vec3 v ) {
        float radius = sqrt( v.x * v.x + v.y * v.y + v.z * v.z );
        float theta = 0.;
        float phi = 0.;
        if ( radius != 0. ) {
          theta = atan( v.x, v.z );
          phi = acos( clamp( v.y / radius, - 1., 1. ) );
        }
        return vec2(phi, theta);
      }
      
      vec3 getPoint(vec3 p){
        vec3 n = normalize(p);
        float s = turbulence(n * 0.5);
        return p + n * s;
      }
      
      ${shader.vertexShader}
    `.replace(
      `#include <begin_vertex>`,
      `#include <begin_vertex>
        
        vec3 p0 = getPoint(position);
        vec2 spherical = setFromCartesianCoords(position);
        vec2 s = vec2(0.01, 0.);
        vec3 p1 = setFromSphericalCoords(length(position), spherical.x + s.x, spherical.y + s.y);
        vec3 p2 = setFromSphericalCoords(length(position), spherical.x + s.y, spherical.y + s.x);
        p1 = getPoint(p1);
        p2 = getPoint(p2);
        
        vec3 nor = normalize(cross(p1 - p0, p2 - p0));
        
        transformed = p0;
      `
    ).replace(
      `gl_PointSize = size;`,
      `
      vec3 lightDir = normalize(lightPos);
      
      float shade = clamp(dot(nor, lightDir), 0., 1.);
      float mvShade = dot(normalize(normalMatrix * nor), -normalize(mvPosition.xyz));
      //shade *= smoothstep(0., 0.125, mvShade);
      vShade = shade;
      
      gl_PointSize = size + (shade * size);`
    );
//    console.log(shader.vertexShader);
    shader.fragmentShader = `
      varying float vShade;
      ${shader.fragmentShader}
    `.replace(
//      `vec4 diffuseColor = vec4( diffuse, opacity );`,
      `
      if(length(gl_PointCoord - 0.5) > 0.5) discard; // make'em round
      float shade = vShade * 0.5 + 0.5;
//      vec4 diffuseColor = vec4( diffuse * shade, opacity );`
    );
//    console.log(shader.fragmentShader);
  }
});




