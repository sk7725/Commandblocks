/*if(!(Vars.headless||Vars.mobile)){
	importPackage(Packages.arc.graphics.gl);
	const shader = new JavaAdapter(Shader, {
		apply(){
			this.setUniformf("u_time", Time.time() / Scl.scl(1.0));
		}
	},
		//todo make multiline strings work	
		"uniform mat4 u_projTrans;attribute vec4 a_position;attribute vec2 a_texCoord0;attribute vec4 a_color;varying vec4 v_color;varying vec2 v_texCoord;uniform vec2 u_viewportInverse;void main(){gl_Position = u_projTrans * a_position;v_texCoord = a_texCoord0;v_color = a_color;}", "uniform float u_time;uniform sampler2D u_texture;varying vec2 v_texCoord;in vec2 gl_FragCoord;void main(){vec4 color = texture2D(u_texture, v_texCoord.xy);float t = clamp((sin(u_time * .01 + gl_FragCoord.x * .01 + gl_FragCoord.y * .005) + 1.) / 2., 0., 1.);vec3 c = vec3(mix(0., 1., t), mix(.89, .39, t), mix(1., .85, t));gl_FragColor = vec4(color.rgb * c.rgb, color.a);}");
}*/
//todo find out how the fuck this works
const bitcolor1=Color.valueOf("00e5ff");
const bitcolor2=Color.valueOf("ff65db");
const bitcolorspeed=0.01;
	
const magicwalllarge = extendContent(Wall, "magicwalllarge", {
    draw(tile){
      if(true){
        Draw.color(bitcolor1,bitcolor2,(Mathf.sin(Time.time()*bitcolorspeed)+1)/2);
        Draw.rect(this.animRegion, tile.drawx(), tile.drawy());
        Draw.color();
        return;
      }
	  Draw.shader(shader);
      Draw.rect(this.animRegion, tile.drawx(), tile.drawy());
	  Draw.shader();
    },
    load(){
      this.super$load();
      this.region=Core.atlas.find(this.name);
      this.animRegion=Core.atlas.find(this.name+"-anim");
    },
    handleDamage(tile,amount){
      return 1.0;
    },
    handleBulletHit(entity,bullet){
      entity.damage(1.0);
    }
});
