let m = new THREE.PointsMaterial({
  size: 0.075, 
  color: 0x7fffff,
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
        float t = -.5;

        for (float f = 1.0 ; f <= 10.0 ; f++ ){
          float power = pow( 2.0, f );
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
    console.log(shader.vertexShader);
    shader.fragmentShader = `
      varying float vShade;
      ${shader.fragmentShader}
    `.replace(
      `vec4 diffuseColor = vec4( diffuse, opacity );`,
      `
      if(length(gl_PointCoord - 0.5) > 0.5) discard; // make'em round
      float shade = vShade * 0.5 + 0.5;
      vec4 diffuseColor = vec4( diffuse * shade, opacity );`
    );
    console.log(shader.fragmentShader);
  }
});