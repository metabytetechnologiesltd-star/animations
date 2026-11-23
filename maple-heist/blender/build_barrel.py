"""Blender: creates the barrel geometry actually loaded and animated in Remotion/Three.js."""
import sys
sys.path.insert(0, '/usr/lib/python3/dist-packages')
import numpy
import bpy, math, os, random
from mathutils import Vector
random.seed(42)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
def mat(name,color,metallic=0,roughness=.55):
    m=bpy.data.materials.new(name);m.diffuse_color=(*color,1)
    m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF')
    if p:
        p.inputs['Base Color'].default_value=(*color,1)
        p.inputs['Metallic'].default_value=metallic
        p.inputs['Roughness'].default_value=roughness
    return m
wood=[mat('Honey colored wooden stave '+str(i),c) for i,c in enumerate([
(.43,.18,.065),(.50,.235,.08),(.56,.285,.105),(.39,.17,.06),(.61,.31,.11)])]
steel=mat('Worn cool steel',(.20,.26,.27),.75,.38)
rim=mat('Darkened steel bands',(.085,.11,.12),.7,.4)
def cyl(n,r,depth,loc,material,verts=40,r2=None):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=depth, location=loc)
    o=bpy.context.object;o.name=n;o.data.materials.append(material)
    return o
cyl('Inner barrel core',.72,1.52,(0,0,0),wood[0])
# Staves on curved cylindrical hull.
for i in range(20):
    a=i*math.tau/20
    obj=cyl('WOOD STAVE %02d'%i,.12,1.46,(.685*math.cos(a),.685*math.sin(a),0),wood[i%len(wood)],verts=12)
    obj.scale.x=1.0;obj.scale.y=.63
for z in [-.6,.58]:
    bpy.ops.mesh.primitive_torus_add(major_segments=48,minor_segments=10,location=(0,0,z),major_radius=.77,minor_radius=.042)
    bpy.context.object.name='Riveted steel hoop %s'%z
    bpy.context.object.data.materials.append(steel)
for z in [-.70,.72]:
    cyl('Steel barrel rim',.79,.075,(0,0,z),steel)
cyl('Sealed base',.70,.045,(0,0,-.775),rim)
# Subtle identification plate on the front
bpy.ops.mesh.primitive_cube_add(size=1,location=(0,-.792,.015))
plate=bpy.context.object;plate.name='Inventory plate';plate.scale=(.29,.014,.21);plate.data.materials.append(mat('Inventory plate brass',(.48,.29,.10),.55,.38))
# Wooden lid is separate in Three.js so it can be removed by the inspector.
out=os.environ.get('BLENDER_BARREL_OUTPUT',os.path.abspath('public/barrel.glb'))
os.makedirs(os.path.dirname(out),exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=out,export_format='GLB',export_apply=True)
print('EXPORTED_GLB',out,os.path.getsize(out))
