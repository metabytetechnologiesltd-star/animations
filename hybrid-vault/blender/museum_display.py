"""Construct an original display pedestal / showcase and stone architectural details in Blender. Export GLB for Three.js."""
import bpy,math,os,random,sys
sys.path.insert(0,"/usr/lib/python3/dist-packages")
random.seed(51)
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
def mat(n,c,metal=0,rough=.6):
 m=bpy.data.materials.new(n);m.diffuse_color=(*c,1);m.use_nodes=True
 p=m.node_tree.nodes.get("Principled BSDF")
 if p:
  p.inputs["Base Color"].default_value=(*c,1)
  p.inputs["Metallic"].default_value=metal
  p.inputs["Roughness"].default_value=rough
 return m
slate=mat("Deep green museum marble",(.07,.19,.22),.15,.35)
edge=mat("Aged golden bronze",(.54,.37,.16),.78,.30)
ink=mat("Ink black carvings",(.03,.075,.085))
burg=mat("Garnet velvet cushioning",(.27,.018,.064),0,.87)
stone=mat("Midnight limestone",(.14,.22,.25),.05,.9)
def cub(n,p,scale,m,bevel=0):
 bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.name=n
 o.dimensions=scale;bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
 o.data.materials.append(m)
 if bevel:
  mod=o.modifiers.new("Sculpted bevel","BEVEL");mod.width=bevel;mod.segments=2
  o.modifiers.new("Weighted edge normals","WEIGHTED_NORMAL")
 return o
# pedestal is located at origin and positioned inside the vault by Three.js.
cub("Marble floor pedestal", (0,.25,0),(1.7,1.85,1.27),slate,.13)
cub("Base bronze plinth", (0,-.68,0),(1.93,.15,1.50),edge,.04)
cub("Inlaid face", (0,.18,.68),(1.38,1.12,.05),ink,.02)
for y in [-.49,-.34,.94,1.16]:
 cub("Fine horizontal gilt engraved border", (0,y,.66),(1.78,.025,.045),edge,.01)
cub("Raised museum exhibit tray", (0,1.23,0),(1.38,.16,1.10),edge,.045)
cub("Empty red velvet diamond cushion", (0,1.325,0),(1.20,.085,.95),burg,.055)
# six-pronged empty setting; dramatic empty mount where diamond should be
for i in range(6):
 a=2*math.pi*i/6
 x,z=.29*math.cos(a),.24*math.sin(a)
 bpy.ops.mesh.primitive_cylinder_add(vertices=12,radius=.040,depth=.23, location=(x,1.51,z));o=bpy.context.object;o.name="Empty gold gem claw %d"%i;o.data.materials.append(edge)
 # tilt tips slightly inward
 o.rotation_euler=(.10*math.sin(a),0,-.10*math.cos(a))
bpy.ops.mesh.primitive_torus_add(major_segments=48,minor_segments=8,location=(0,1.42,0),major_radius=.34,minor_radius=.025)
bpy.context.object.name="Vacant setting ring";bpy.context.object.data.materials.append(edge)
# museum geometric wall carvings, positioned at sides of pedestal
for s in [-1,1]:
 cub("Engraved alcove column",(s*1.7,.8,-.93),(.42,3.45,.5),stone,.055)
 for j in range(4):
  cub("Column gilded relief",(s*1.7,-.7+j*.95,-.645),(.27,.046,.035),edge)
# normal / glb
bpy.ops.object.select_all(action="SELECT")
out=os.path.join(os.path.dirname(__file__),"..","public","vault_display.glb")
out=os.path.abspath(out)
os.makedirs(os.path.dirname(out),exist_ok=True)
bpy.ops.export_scene.gltf(filepath=out,export_format="GLB",export_apply=True)
print("VAULT_3D_ASSET_OK",out,os.path.getsize(out))
