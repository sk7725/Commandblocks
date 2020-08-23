this.global.shaders={};

function highShader(apply, frag){
  var cfrag = frag;
  if(!frag.includes("#ifdef GL_ES")) cfrag = "#ifdef GL_ES\nprecision highp float;precision mediump int;\n#endif\n" + frag;
  try{
    const shader = new JavaAdapter(Shader, apply,
    "uniform mat4 u_projTrans;attribute vec4 a_position;attribute vec2 a_texCoord0;attribute vec4 a_color;varying vec4 v_color;varying vec2 v_texCoord;void main(){gl_Position = u_projTrans * a_position;v_texCoord = a_texCoord0;v_color = a_color;}", cfrag);
    return shader;
  }
  catch(err){
    return mediumShader(apply, frag);
  }
}
function mediumShader(apply, frag){
  var cfrag = frag;
  if(!frag.includes("#ifdef GL_ES")) cfrag = "#ifdef GL_ES\nprecision mediump float;precision mediump int;\n#endif\n" + frag;
  try{
    const shader = new JavaAdapter(Shader, apply,
    "uniform mat4 u_projTrans;attribute vec4 a_position;attribute vec2 a_texCoord0;attribute vec4 a_color;varying vec4 v_color;varying vec2 v_texCoord;void main(){gl_Position = u_projTrans * a_position;v_texCoord = a_texCoord0;v_color = a_color;}", cfrag);
    return shader;
  }
  catch(err){
    print("ShaderError: "+err);
    print(err.stack);
    return Shaders.tar;
  }
}

if(!Vars.headless){
  try{
    importPackage(Packages.arc.graphics.gl);

    this.global.shaders.bittrium = mediumShader({
      apply(){
        this.setUniformf("u_time", Time.time() / Scl.scl(1.0));
      }
    }, "uniform sampler2D u_texture;uniform float u_time;varying vec4 v_color;varying vec2 v_texCoord;void main(){vec4 color = texture2D(u_texture, v_texCoord.xy);float t = clamp((sin(u_time * .01 + gl_FragCoord.x * .01 + gl_FragCoord.y * .005) + 1.) / 2., 0., 1.);vec3 c = vec3(mix(0., 1., t), mix(.89, .39, t), mix(1., .85, t));gl_FragColor = vec4(color.rgb * c.rgb, color.a);}");

    this.global.shaders.space = mediumShader({
      apply(){
        this.setUniformf("u_resolution", Core.graphics.getWidth(), Core.graphics.getHeight());
        this.setUniformf("u_time", Time.time()%3141.5926 / Scl.scl(1.0));
      }
    }, "uniform sampler2D u_texture;  \nvarying vec4 v_color;  \nvarying vec2 v_texCoord; \nuniform vec2 u_resolution; \nuniform float u_time;  \n#define PI 2.14159  \nvoid main(void){ \nfloat time = 10.0*sin(u_time*0.002);  \nvec4 color = texture2D(u_texture, v_texCoord.xy);  \nvec2 uv = gl_FragCoord.xy / u_resolution.xy;  \nfloat formafinal  = sin(uv.x*10.*PI+time + sin(uv.y*2.*PI+time + sin(uv.x*10.*PI-time + sin(uv.y*10.*PI-time + sin(uv.x*10.*PI-time + sin(uv.y*10.*PI-time) + sin(uv.x*10.*PI-time))))))*0.5+0.5;  \nfloat formafinal2 = sin(uv.y*10.*PI+time + sin(uv.y*10.*PI+time + sin(uv.x*8.*PI-time + sin(uv.y*5.*PI-time + sin(uv.x*10.*PI-time + sin(uv.y*2.*PI-time) + sin(uv.x*9.*PI-time))))))*0.5+0.5;  \nvec3 color1 = vec3(0.900,0.1,0.7);  \nvec3 color2 = vec3(0.300,0.9,0.05);  \nvec3 fin = color1 * formafinal + color2 * formafinal2;  \ngl_FragColor = vec4(color.rgb * fin, color.a);  \n}");

    this.global.shaders.time = highShader({
      apply(){
        this.setUniformf("u_resolution", Core.graphics.getWidth(), Core.graphics.getHeight());
        this.setUniformf("u_time", Time.time() / Scl.scl(1.0));
      }
    }, "#define PI 3.14159265\nuniform sampler2D u_texture;\nvarying vec4 v_color;\nvarying vec2 v_texCoord;\nuniform float u_time;\nuniform vec2 u_resolution;\nvoid main( void ) {\nvec4 color = texture2D(u_texture, v_texCoord.xy);\nfloat time = u_time*0.0001;\nfloat color1, color2, color3;\ncolor1 = (sin(dot(gl_FragCoord.xy,vec2(sin(time*1.0),cos(time*3.0)))*0.02+time*4.0)+1.0)/2.0;\nvec2 center = vec2(u_resolution.x, u_resolution.y) + vec2(u_resolution.x/2.0*sin(-time*3.0),u_resolution.y/2.0*cos(-time*10.0));\ncolor2 = (cos(length(gl_FragCoord.xy - center)*0.03)+1.0)/2.0;\ncolor3 = (color1+ color2)/2.0;\nfloat red   = (cos(PI*color3/0.5+time*3.0)+1.0)/2.0;\nfloat green   = (sin(PI*color3/0.5+time*3.0)+1.0)/2.0;\nfloat blue   = (sin(PI*color3/0.25+time*3.0)+1.0)/2.0;\nvec3 fin = vec3(blue+0.6, red+0.5, green+0.5);\ngl_FragColor = vec4(color.rgb * fin, color.a);\n}");

    this.global.shaders.bittunit = mediumShader({
      apply(){
        this.setUniformf("u_time", Time.time() / Scl.scl(1.0));
      }
    }, "uniform sampler2D u_texture;uniform float u_time;varying vec4 v_color;varying vec2 v_texCoord;void main(){vec4 color = texture2D(u_texture, v_texCoord.xy);float t = clamp((sin(u_time * .01 + gl_FragCoord.x * .01 + gl_FragCoord.y * .005) + 1.) / 2., 0., 1.);vec3 c = vec3(mix(0., 1., t), mix(.89, .39, t), mix(1., .85, t));float mulp = abs(color.r-color.g)+abs(color.g-color.b)+abs(color.r-color.b);mulp = mulp*mulp/1.1;gl_FragColor = vec4(mix(color.ggg,c.rgb,mulp), color.a);}");

    this.global.shaders.glitch = mediumShader({
      apply(){
        this.setUniformf("u_time", Time.time() / Scl.scl(1.0));
        this.setUniformf("u_resolution", Core.graphics.getWidth(), Core.graphics.getHeight());
      }
    }, "uniform sampler2D u_texture; uniform float u_time; varying vec4 v_color; varying vec2 v_texCoord; const vec2 z = vec2(1); const float complexity =5.; const float density = .9; const float speed = 1.; const float PI = atan(1.)*4.; vec4 hash42(vec2 p) 	vec4 p4 = fract(vec4(p.xyxy) * vec4(.1031, .1030, .0973, .1099));     p4 += dot(p4, p4.wzxy+33.33);     return fract((p4.xxyz+p4.yzzw)*p4.zywx); mat2 rot2D(float r){     return mat2(cos(r), sin(r), -sin(r), cos(r)); #define q(x,p) (floor((x)/(p))*(p)) void main()     vec2 R = u_resolution.xy;     vec2 uv = gl_FragCoord.xy/R.xy;     vec2 N = uv-.5;     float t = u_time*0.01+1e2;     uv.x *= R.x/R.y;     uv *= z;     uv += floor(u_time*speed*0.3)*z;     float s = 1.;     for (float i = 1.;i <= complexity; ++ i) {         vec2 c = floor(uv+i);         vec4 h = hash42(c);         vec2 p = fract(uv+i+q(t,h.z+1.)*h.y);         uv+= p*h.z*h.xy*vec2(s,2.);         uv *= 2.;         if (i < 2. || h.w > density) {             gl_FragColor = h;     gl_FragColor = step(.5,gl_FragColor) * mod(gl_FragCoord.x,3.)/2.;     gl_FragColor *= 1.-dot(N,N*2.);     gl_FragColor.a = 1.;");
  }
  catch(err){
    print("Err: "+err);
    print(err.stack);
  }
}
/*const shader = new JavaAdapter(Shader, {
  apply(){
    this.setUniformf("u_time", Time.time() / Scl.scl(1.0));
  }
},
//todo make multiline strings work
"uniform mat4 u_projTrans;attribute vec4 a_position;attribute vec2 a_texCoord0;attribute vec4 a_color;varying vec4 v_color;varying vec2 v_texCoord;void main(){gl_Position = u_projTrans * a_position;v_texCoord = a_texCoord0;v_color = a_color;}", "#ifdef GL_ES\nprecision mediump float;precision mediump int;\n#endif\nuniform sampler2D u_texture;uniform float u_time;varying vec4 v_color;varying vec2 v_texCoord;void main(){vec4 color = texture2D(u_texture, v_texCoord.xy);float t = clamp((sin(u_time * .01 + gl_FragCoord.x * .01 + gl_FragCoord.y * .005) + 1.) / 2., 0., 1.);vec3 c = vec3(mix(0., 1., t), mix(.89, .39, t), mix(1., .85, t));gl_FragColor = vec4(color.rgb * c.rgb, color.a);}");
this.global.shaders.bittrium=shader;

const shader2 = new JavaAdapter(Shader, {
  apply(){
    this.setUniformf("u_resolution", Core.graphics.getWidth(), Core.graphics.getHeight());
    this.setUniformf("u_time", Time.time()%3141.5926 / Scl.scl(1.0));
  }
},
//todo make multiline strings work
"uniform mat4 u_projTrans;attribute vec4 a_position;attribute vec2 a_texCoord0;attribute vec4 a_color;varying vec4 v_color;varying vec2 v_texCoord;void main(){gl_Position = u_projTrans * a_position;v_texCoord = a_texCoord0;v_color = a_color;}", "#ifdef GL_ES \nprecision mediump float; \n#endif \nuniform sampler2D u_texture;  \nvarying vec4 v_color;  \nvarying vec2 v_texCoord; \nuniform vec2 u_resolution; \nuniform float u_time;  \n#define PI 2.14159  \nvoid main(void){ \nfloat time = 10.0*sin(u_time*0.002);  \nvec4 color = texture2D(u_texture, v_texCoord.xy);  \nvec2 uv = gl_FragCoord.xy / u_resolution.xy;  \nfloat formafinal  = sin(uv.x*10.*PI+time + sin(uv.y*2.*PI+time + sin(uv.x*10.*PI-time + sin(uv.y*10.*PI-time + sin(uv.x*10.*PI-time + sin(uv.y*10.*PI-time) + sin(uv.x*10.*PI-time))))))*0.5+0.5;  \nfloat formafinal2 = sin(uv.y*10.*PI+time + sin(uv.y*10.*PI+time + sin(uv.x*8.*PI-time + sin(uv.y*5.*PI-time + sin(uv.x*10.*PI-time + sin(uv.y*2.*PI-time) + sin(uv.x*9.*PI-time))))))*0.5+0.5;  \nvec3 color1 = vec3(0.900,0.1,0.7);  \nvec3 color2 = vec3(0.300,0.9,0.05);  \nvec3 fin = color1 * formafinal + color2 * formafinal2;  \ngl_FragColor = vec4(color.rgb * fin, color.a);  \n}");
this.global.shaders.space=shader2;

const shader3 = new JavaAdapter(Shader, {
  apply(){
    this.setUniformf("u_resolution", Core.graphics.getWidth(), Core.graphics.getHeight());
    this.setUniformf("u_time", Time.time() / Scl.scl(1.0));
  }
},
//todo make multiline strings work
"uniform mat4 u_projTrans;attribute vec4 a_position;attribute vec2 a_texCoord0;attribute vec4 a_color;varying vec4 v_color;varying vec2 v_texCoord;void main(){gl_Position = u_projTrans * a_position;v_texCoord = a_texCoord0;v_color = a_color;}", "#ifdef GL_ES\nprecision highp float;\n#endif\n#define PI 3.14159265\nuniform sampler2D u_texture;\nvarying vec4 v_color;\nvarying vec2 v_texCoord;\nuniform float u_time;\nuniform vec2 u_resolution;\nvoid main( void ) {\nvec4 color = texture2D(u_texture, v_texCoord.xy);\nfloat time = u_time*0.0001;\nfloat color1, color2, color3;\ncolor1 = (sin(dot(gl_FragCoord.xy,vec2(sin(time*1.0),cos(time*3.0)))*0.02+time*4.0)+1.0)/2.0;\nvec2 center = vec2(u_resolution.x, u_resolution.y) + vec2(u_resolution.x/2.0*sin(-time*3.0),u_resolution.y/2.0*cos(-time*10.0));\ncolor2 = (cos(length(gl_FragCoord.xy - center)*0.03)+1.0)/2.0;\ncolor3 = (color1+ color2)/2.0;\nfloat red   = (cos(PI*color3/0.5+time*3.0)+1.0)/2.0;\nfloat green   = (sin(PI*color3/0.5+time*3.0)+1.0)/2.0;\nfloat blue   = (sin(PI*color3/0.25+time*3.0)+1.0)/2.0;\nvec3 fin = vec3(blue+0.6, red+0.5, green+0.5);\ngl_FragColor = vec4(color.rgb * fin, color.a);\n}");
this.global.shaders.time=shader3;
}
catch(err){
print("Failed to load 1 or more shaders!");
print(err);
print(err.stack);
if(!this.global.shaders.hasOwnProperty("bittrium")) this.global.shaders.bittrium=Shaders.water;
if(!this.global.shaders.hasOwnProperty("space")) this.global.shaders.space=Shaders.tar;
if(!this.global.shaders.hasOwnProperty("time")){
  //try mediump
  try{
    const lowres = new JavaAdapter(Shader, {
      apply(){
        this.setUniformf("u_resolution", Core.graphics.getWidth(), Core.graphics.getHeight());
        this.setUniformf("u_time", Time.time() / Scl.scl(1.0));
      }
    },
    //todo make multiline strings work
    "uniform mat4 u_projTrans;attribute vec4 a_position;attribute vec2 a_texCoord0;attribute vec4 a_color;varying vec4 v_color;varying vec2 v_texCoord;void main(){gl_Position = u_projTrans * a_position;v_texCoord = a_texCoord0;v_color = a_color;}", "#ifdef GL_ES\nprecision mediump float;\n#endif\n#define PI 3.14159265\nuniform sampler2D u_texture;\nvarying vec4 v_color;\nvarying vec2 v_texCoord;\nuniform float u_time;\nuniform vec2 u_resolution;\nvoid main( void ) {\nvec4 color = texture2D(u_texture, v_texCoord.xy);\nfloat time = u_time*0.0001;\nfloat color1, color2, color3;\ncolor1 = (sin(dot(gl_FragCoord.xy,vec2(sin(time*1.0),cos(time*3.0)))*0.02+time*4.0)+1.0)/2.0;\nvec2 center = vec2(u_resolution.x, u_resolution.y) + vec2(u_resolution.x/2.0*sin(-time*3.0),u_resolution.y/2.0*cos(-time*10.0));\ncolor2 = (cos(length(gl_FragCoord.xy - center)*0.03)+1.0)/2.0;\ncolor3 = (color1+ color2)/2.0;\nfloat red   = (cos(PI*color3/0.5+time*3.0)+1.0)/2.0;\nfloat green   = (sin(PI*color3/0.5+time*3.0)+1.0)/2.0;\nfloat blue = (sin(PI*color3/0.25+time*3.0)+1.0)/2.0;\nvec3 fin = vec3(blue+0.6, red+0.5, green+0.5);\ngl_FragColor = vec4(color.rgb * fin, color.a);\n}");
    this.global.shaders.time=lowres;
  }
  catch(err){
    this.global.shaders.time=Shaders.tar;
  }
}

}
}*/

/*
#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D u_texture;
varying vec4 v_color;
varying vec2 v_texCoord;
uniform vec2 u_resolution;
uniform float u_time;
#define PI 3.14159
void main(void){
float time = u_time*0.01;
vec4 color = texture2D(u_texture, v_texCoord.xy);
vec2 uv = gl_FragCoord.xy /1250.0;
float formafinal  = sin(uv.x*10.*PI+time + sin(uv.y*2.*PI+time + sin(uv.x*10.*PI-time + sin(uv.y*10.*PI-time + sin(uv.x*10.*PI-time + sin(uv.y*10.*PI-time) + sin(uv.x*10.*PI-time))))))*0.5+0.5;
float formafinal2 = sin(uv.y*10.*PI+time + sin(uv.y*10.*PI+time + sin(uv.x*8.*PI-time + sin(uv.y*5.*PI-time + sin(uv.x*10.*PI-time + sin(uv.y*2.*PI-time) + sin(uv.x*9.*PI-time))))))*0.5+0.5;
vec3 color1 = vec3(0.900,0.1,0.4);
vec3 color2 = vec3(0.300,0.9,0.05);
vec3 fin = color1 * formafinal + color2 * formafinal2;
gl_FragColor = vec4(color.rgb * fin, color.a);
}
*/

/*
#ifdef GL_ES
precision highp float;
#endif
#define PI 3.14159265
uniform sampler2D u_texture;
varying vec4 v_color;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;
void main( void ) {
vec4 color = texture2D(u_texture, v_texCoord.xy);
float time = u_time*0.0001;
float color1, color2, color3;
color1 = (sin(dot(gl_FragCoord.xy,vec2(sin(time*1.0),cos(time*3.0)))*0.02+time*4.0)+1.0)/2.0;
vec2 center = vec2(u_resolution.x, u_resolution.y) + vec2(u_resolution.x/2.0*sin(-time*3.0),u_resolution.y/2.0*cos(-time*10.0));
color2 = (cos(length(gl_FragCoord.xy - center)*0.03)+1.0)/2.0;
color3 = (color1 + color2)/2.0;
float red   = (cos(PI*color3/0.5+time*3.0)+1.0)/2.0;
float green   = (sin(PI*color3/0.5+time*3.0)+1.0)/2.0;
float blue   = (sin(PI*color3/0.25+time*3.0)+1.0)/2.0;
vec3 fin = vec3(blue+0.6, red+0.5, green+0.5);
gl_FragColor = vec4(color.rgb * fin, color.a);
}
*/
