importPackage(Packages.arc.graphics.gl);
var shader = new JavaAdapter(Shader, {
  apply(){
    this.setUniformf("u_time", Time.time() / Scl.scl(1.0));
  }
},
//todo make multiline strings work
"uniform mat4 u_projTrans;attribute vec4 a_position;attribute vec2 a_texCoord0;attribute vec4 a_color;varying vec4 v_color;varying vec2 v_texCoord;void main(){gl_Position = u_projTrans * a_position;v_texCoord = a_texCoord0;v_color = a_color;}", "#ifdef GL_ES\nprecision mediump float;precision mediump int;\n#endif\nuniform sampler2D u_texture;uniform float u_time;varying vec4 v_color;varying vec2 v_texCoord;void main(){vec4 color = texture2D(u_texture, v_texCoord.xy);float t = clamp((sin(u_time * .01 + gl_FragCoord.x * .01 + gl_FragCoord.y * .005) + 1.) / 2., 0., 1.);vec3 c = vec3(mix(0., 1., t), mix(.89, .39, t), mix(1., .85, t));gl_FragColor = vec4(color.rgb * c.rgb, color.a);}");
const shadertester=extendContent(MessageBlock,"shadertester",{
  draw(tile){
    Draw.shader(shader);
    Draw.rect(this.region, tile.drawx(), tile.drawy());
    Draw.shader();
  },
  load(){
    this.super$load();
    this.region=Core.atlas.find(this.name);
  },
  buildConfiguration(tile, table){
    //this.super$buildConfiguration(tile, table);
    const entity = tile.ent();
    // Add buttons
    table.addImageButton(Icon.pencil, Styles.clearTransi, run(() => {
        if (Vars.mobile) {
            // Mobile and desktop version have different dialogs
            const input = new Input.TextInput();
            input.text = entity.message;
            input.multiline = true;
            input.accepted = cons(text => Call.setMessageBlockText(null,tile,text));

            Core.input.getTextInput(input);
        } else {
            // Create dialog
            const dialog = new FloatingDialog("Shader");
            dialog.setFillParent(false);

            // Add text area to dialog
            const textArea = new TextArea(entity.message);
            dialog.cont.add(textArea).size(380, 160);

            // Add "ok" button to dialog
            dialog.buttons.addButton("$ok", run(() => {
                Call.setMessageBlockText(null,tile,textArea.getText());
                dialog.hide();
            }));

            // Show it
            dialog.show();
        }
    })).size(40);
    table.addImageButton(Icon.star, Styles.clearTransi, run(() => {
      tile.configure(1);
    })).size(40);
  },
  configured(tile,player, value){
    if(value!=1) return;
    var msg=tile.ent().message;
    shader.dispose();
    shader = new JavaAdapter(Shader, {
      apply(){
        this.setUniformf("u_time", Time.time() / Scl.scl(1.0));
      }
    },
    //todo make multiline strings work
    "uniform mat4 u_projTrans;attribute vec4 a_position;attribute vec2 a_texCoord0;attribute vec4 a_color;varying vec4 v_color;varying vec2 v_texCoord;void main(){gl_Position = u_projTrans * a_position;v_texCoord = a_texCoord0;v_color = a_color;}", msg);
  },
  placed(tile){
		this.super$placed(tile);
    Call.setMessageBlockText(null,tile,"#ifdef GL_ES\nprecision mediump float;precision mediump int;\n#endif\nuniform sampler2D u_texture;uniform float u_time;varying vec4 v_color;varying vec2 v_texCoord;void main(){vec4 color = texture2D(u_texture, v_texCoord.xy);float t = clamp((sin(u_time * .01 + gl_FragCoord.x * .01 + gl_FragCoord.y * .005) + 1.) / 2., 0., 1.);vec3 c = vec3(mix(0., 1., t), mix(.89, .39, t), mix(1., .85, t));gl_FragColor = vec4(color.rgb * c.rgb, color.a);}");
	}
});

shadertester.maxTextLength=1300;
shadertester.maxNewlines=50;
