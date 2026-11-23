"""Blender 4 procedural production asset pack for original illustrated finance documentary.
Creates separate office and exterior GLBs. Characters, reports and camera animate independently in Three.js.
"""
import sys,os,math,random
sys.path.insert(0,"/usr/lib/python3/dist-packages")
import bpy
random.seed(42)
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),"..","public"))
os.makedirs(ROOT,exist_ok=True)
def clear():
 bpy.ops.object.select_all(action="SELECT");bpy.ops.object.delete(use_global=False)
def material(name,hex_color,metal=0,rough=.65):
 h=hex_color.lstrip("#");color=tuple(int(h[i:i+2],16)/255 for i in (0,2,4))
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
 b=m.node_tree.nodes.get("Principled BSDF")
 b.inputs["Base Color"].default_value=(*color,1)
 b.inputs["Metallic"].default_value=metal
 b.inputs["Roughness"].default_value=rough
 return m
navy=material("blue grey architectural slate","#142f3c",.18,.65)
dark=material("charcoal powdercoat","#11232e",.42,.50)
brass=material("warm brushed metal","#a7835a",.68,.40)
wood=material("fine walnut timber","#54352b",.08,.54)
wood2=material("wooden grain lowlights","#39251f",.12,.73)
paper=material("ivory office paper","#e9dec2",0,.92)
white=material("bone glass finish","#afc5c8",.35,.23)
glass=material("blue mirror glass","#1e4c64",.46,.18)
black=material("computer face","#0b151c",.24,.28)
teal=material("screen aqua","#1f687a",.14,.38)
red=material("ledger red","#bb5646",.13,.48)
tile=material("stone floor","#293f4a",.05,.45)
def block(name,xyz,scale,mat,bevel=.02):
 bpy.ops.mesh.primitive_cube_add(size=1,location=xyz);o=bpy.context.object;o.name=name
 o.dimensions=scale;bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
 o.data.materials.append(mat)
 if bevel:
  b=o.modifiers.new("Machined edge chamfer","BEVEL");b.width=bevel;b.segments=2
  o.modifiers.new("Weighted normals","WEIGHTED_NORMAL")
 return o
def cylinder(name,xyz,r,d,mat,segments=18,rot=None):
 bpy.ops.mesh.primitive_cylinder_add(vertices=segments,radius=r,depth=d,location=xyz)
 o=bpy.context.object;o.name=name;o.data.materials.append(mat)
 if rot:o.rotation_euler=rot
 return o
def glb(name):
 bpy.ops.object.select_all(action="SELECT")
 dest=os.path.join(ROOT,name+".glb")
 bpy.ops.export_scene.gltf(filepath=dest,export_format="GLB",export_apply=True,export_yup=False)
 print("PRODUCTION_GLTF_EXPORT",name,os.path.getsize(dest),dest)
# Interior: office set matching mid shots, desk at z0 and actors left/right.
clear()
block("polished dark office floor",(0,-1.92,-2),(18,.14,16),tile)
block("painted office wall",(0,1.6,-7.25),(18,8,.18),navy)
block("window back wall framing",(0,1.42,-6.95),(13,4.5,.25),dark)
for i in range(8):
 x=-5.65+i*1.62
 block("window pane "+str(i),(x,1.55,-6.79),(1.52,3.8,.055),glass,.005)
 block("black mullion "+str(i),(x+.79,1.53,-6.67),(.07,4.2,.12),black)
 for j in range(7):
  bx=x+random.uniform(-.65,.62)
  by=.15+j*.42
  block("city silhouette "+str(i)+"."+str(j),(bx,by,-6.66),(.22,.11,.02),wood2,.005)
block("upper glazing lintel",(0,3.52,-6.65),(14,.16,.24),brass)
# raised conference desk
block("walnut desktop",(0,-.91,.42),(5.9,.20,2.55),wood,.07)
block("desk apron",(0,-1.09,.42),(5.5,.20,2.28),wood2,.04)
for x in (-2.51,2.51):
 for z in (-.45,1.3):block("walnut table post",(x,-1.43,z),(.20,.91,.21),wood,.02)
# floating banker screen to make monitor real in stage
block("LCD monitor body",(0,-.12,-.16),(2.12,1.34,.09),black,.06)
block("LED screen front",(0,-.11,-.105),(1.93,1.16,.016),teal,.016)
block("monitor stand",(0,-.76,-.23),(.10,.34,.12),brass,.02)
block("monitor base",(0,-.84,-.12),(.66,.025,.35),black,.02)
block("keyboard plate",(0,-.777,.86),(1.57,.035,.50),black,.04)
for j in range(4):
 for i in range(16):
  block("keyboard key %d %d"%(j,i),(-.72+i*.094,-.741,.70+j*.094),(.069,.012,.063),white,.004)
block("desk phone",(2.12,-.77,.48),(.54,.12,.42),black,.03)
block("phone receiver",(2.12,-.65,.48),(.48,.10,.12),navy,.04)
# desk paper stack and two overlapping reports
for i in range(7):
 block("thin printed confirmation "+str(i),(-1.25,-.796+i*.007,.76+i*.012),(.82,.006,1.04),paper,.002)
block("red binder",(-2.05,-.735,.25),(.61,.095,.86),red,.017)
cylinder("stainless pen",(-.76,-.71,1.22),.018,.49,brass,10,(math.pi/2,0,.23))
# desk lamp
cylinder("office lamp base",(2.58,-.73,-.48),.22,.06,black)
cylinder("office lamp post",(2.58,-.33,-.48),.035,.75,brass)
cylinder("office lamp shade",(2.53,.04,-.47),.28,.19,wood2)
# accent strips and pinned chronology along side
for x in (-7.4,7.4):block("teal wall sconce",(x,1.1,-5.5),(.11,1.0,.24),brass)
glb("office")
# exterior: not exact 2020 location; stylized Munich fintech HQ reconstruction
clear()
block("2020 Munich concrete building",(0,1.3,-5.0),(13,8.3,2.15),navy,.05)
for j in range(6):
 for i in range(12):
  x=-5.5+i*1.02;y=-1.80+j*.88
  block("window %02d-%02d"%(j,i),(x,y,-3.877),(.82,.70,.07),glass,.006)
  block("lit computer desk %02d-%02d"%(j,i),(x-.18,y-.18,-3.837),(.18,.05,.015),teal,.002)
block("headquarters upper sign plate",(0,3.51,-3.81),(8.9,.95,.08),wood2,.09)
block("concrete entrance canopy",(0,-1.50,-2.95),(7,.24,3.8),dark,.04)
block("corporate entry",(0,-2.32,-3.71),(3.18,2.4,.09),black,.02)
block("road frontage",(0,-3.24,-3.02),(25,.16,9),tile,.04)
for x in (-4.0,4.0):
 cylinder("steel plaza bollard"+str(x),(x,-2.65,-1.85),.11,.87,brass)
glb("building")
